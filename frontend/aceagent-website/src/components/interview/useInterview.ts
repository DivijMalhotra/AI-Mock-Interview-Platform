"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type InterviewPhase =
  | "idle"
  | "connecting"
  | "active"
  | "ending"
  | "uploading"
  | "redirecting"
  | "error";

export function useInterview(sessionId: string) {
  // ── Core state (unchanged) ──
  const [status, setStatus] = useState<InterviewPhase>("idle");
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [systemMessage, setSystemMessage] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState(false);

  // ── Recording state (NEW) ──
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  // ── Refs ──
  const videoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Load initial session state (unchanged) ──
  useEffect(() => {
    async function loadSession() {
      try {
        const { getSessionState } = await import("@/lib/api");
        const { data } = await getSessionState(sessionId);
        if (data?.questions_asked?.length > 0) {
          const lastIdx = data.questions_asked.length - 1;
          setCurrentQuestion(data.questions_asked[lastIdx]);
        }
        // 🔥 Persist to localStorage for recent sessions list
        try {
          const key = "aceagent_recent_sessions";
          const existing = JSON.parse(localStorage.getItem(key) || "[]");
          const alreadyExists = existing.some((s: any) => s.id === sessionId);
          if (!alreadyExists) {
            existing.unshift({
              id: sessionId,
              topic: data?.config?.topic || "Interview",
              date: new Date().toLocaleDateString(),
            });
            localStorage.setItem(key, JSON.stringify(existing.slice(0, 20)));
          }
        } catch { /* ignore localStorage errors */ }
      } catch (err) {
        console.error("Failed to load session:", err);
      }
    }
    if (sessionId) loadSession();
  }, [sessionId]);

  // ── WebSocket connection (unchanged) ──
  useEffect(() => {
    if (!sessionId) return;

    setStatus("connecting");
    const WS_URL = (
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
    ).replace("http", "ws");
    const ws = new WebSocket(`${WS_URL}/ws/${sessionId}`);

    ws.onopen = () => setStatus("active");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "live_metrics") {
          setMetrics(data.data);
        } else if (data.type === "system_event") {
          setSystemMessage(data.data);
        }
      } catch (e) {
        console.error("Failed to parse WS message", e);
      }
    };

    ws.onerror = () => setStatus("error");
    ws.onclose = () => {
      // Only set idle if not in a terminal phase
      setStatus((prev) =>
        prev === "ending" || prev === "uploading" || prev === "redirecting"
          ? prev
          : "idle"
      );
    };

    wsRef.current = ws;

    return () => {
      ws.close();
      stopMedia();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // ── Media (unchanged) ──
  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");

      videoIntervalRef.current = setInterval(() => {
        if (
          wsRef.current?.readyState === WebSocket.OPEN &&
          videoRef.current &&
          ctx
        ) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                blob.arrayBuffer().then((buffer) => {
                  wsRef.current?.send(buffer);
                });
              }
            },
            "image/jpeg",
            0.6
          );
        }
      }, 250);
    } catch (e) {
      console.error("Failed to acquire media devices", e);
      setSystemMessage(
        "Camera/microphone access denied. Please allow access to continue."
      );
    }
  };

  const stopMedia = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
  };

  // ── 🔥 RECORDING (NEW) ──

  const startRecording = useCallback(() => {
    if (!streamRef.current) {
      setSystemMessage("No media stream available. Please start your camera first.");
      return;
    }

    chunksRef.current = [];
    setVideoBlob(null);
    setRecordingTime(0);

    try {
      // Prefer webm with VP9/opus, fallback to whatever the browser supports
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
        ? "video/webm;codecs=vp9,opus"
        : MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
        ? "video/webm;codecs=vp8,opus"
        : "video/webm";

      const recorder = new MediaRecorder(streamRef.current, {
        mimeType,
        videoBitsPerSecond: 1_500_000, // 1.5 Mbps
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setVideoBlob(blob);
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      recorder.onerror = () => {
        setSystemMessage("Recording error. Please try again.");
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      recorder.start(1000); // Collect data every 1s for smoother chunks
      recorderRef.current = recorder;
      setIsRecording(true);

      // Timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (e) {
      console.error("Failed to start recording:", e);
      setSystemMessage("Recording is not supported in this browser.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetRecording = useCallback(() => {
    setVideoBlob(null);
    setRecordingTime(0);
    chunksRef.current = [];
    setUploadProgress("");
  }, []);

  // ── Submit Answer (unchanged, with minor robustness improvements) ──
  const submitAnswer = async (transcript: string) => {
    if (!transcript.trim()) return;

    setIsEvaluating(true);
    setSystemMessage("AI is analyzing your response...");

    try {
      const { submitAnswer: apiSubmitAnswer } = await import("@/lib/api");
      const response = await apiSubmitAnswer(sessionId, {
        question_id: currentQuestion?.id || "unknown",
        transcript: transcript,
        audio_metrics: metrics?.audio_metrics || {},
        video_metrics: metrics || {},
      });

      if (response.data?.next_question) {
        setCurrentQuestion(response.data.next_question);
        setSystemMessage("Excellent. Next question ready.");
        // Reset recording state for next question
        resetRecording();
      } else {
        setSystemMessage("Interview Complete. Redirecting to analysis...");
        // Auto-end if no next question
        await handleEndInterview();
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setSystemMessage("Failed to evaluate answer. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // ── 🔥 END INTERVIEW (NEW) ──

  const handleEndInterview = useCallback(async () => {
    setStatus("ending");
    setSystemMessage("Ending interview session...");

    try {
      // 1. Stop recording if active
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
        // Wait for recorder to finish producing the blob
        await new Promise<void>((resolve) => {
          if (recorderRef.current) {
            recorderRef.current.onstop = () => {
              const blob = new Blob(chunksRef.current, { type: "video/webm" });
              setVideoBlob(blob);
              resolve();
            };
          } else {
            resolve();
          }
        });
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // 2. Upload recording if we have one
      const blobToUpload = videoBlob || (chunksRef.current.length > 0
        ? new Blob(chunksRef.current, { type: "video/webm" })
        : null);

      if (blobToUpload && blobToUpload.size > 0) {
        setStatus("uploading");
        setUploadProgress("Uploading recording...");
        setSystemMessage("Uploading your recording...");

        try {
          const { uploadRecording } = await import("@/lib/api");
          await uploadRecording(sessionId, blobToUpload, "interview-recording.webm");
          setUploadProgress("Upload complete!");
        } catch (uploadErr) {
          console.error("Upload failed:", uploadErr);
          setUploadProgress("Upload failed — continuing to analysis");
          // Don't block the flow on upload failure
        }
      }

      // 3. End session via API
      const { endInterview } = await import("@/lib/api");
      await endInterview(sessionId);

      // 4. Stop media and redirect
      stopMedia();
      setStatus("redirecting");
      setSystemMessage("Redirecting to your analysis...");

      // Brief delay so user sees the status
      await new Promise((resolve) => setTimeout(resolve, 1200));
      window.location.href = `/dashboard/analysis/${sessionId}`;
    } catch (err) {
      console.error("End interview failed:", err);
      setSystemMessage("Failed to end session. Redirecting anyway...");
      // Redirect even on failure
      setTimeout(() => {
        window.location.href = `/dashboard/analysis/${sessionId}`;
      }, 1500);
    }
  }, [sessionId, videoBlob, stopMedia]);

  // ── Cleanup timer on unmount ──
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    // Original
    status,
    metrics,
    systemMessage,
    currentQuestion,
    isEvaluating,
    videoRef,
    startMedia,
    stopMedia,
    submitAnswer,
    // 🔥 NEW: Recording
    isRecording,
    recordingTime,
    videoBlob,
    uploadProgress,
    startRecording,
    stopRecording,
    resetRecording,
    // 🔥 NEW: End interview
    handleEndInterview,
  };
}
