'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Loader2,
  BarChart2,
  ArrowRight,
  Clock,
  Target,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useDashboardCtx } from '../layout';
import { startInterview } from '@/lib/api';

export default function AnalysisLandingPage() {
  const router = useRouter();
  const { darkMode, isMobile } = useDashboardCtx();
  const [loading, setLoading] = useState(false);

  const dark = darkMode;
  const text = dark ? '#f1f5f9' : '#0f172a';
  const sub = dark ? '#64748b' : '#9ca3af';
  const bg = dark ? '#0c1032' : '#fff';
  const border = dark ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.07)';

  // ── Retrieve recent session IDs from localStorage ──
  const [recentSessions, setRecentSessions] = useState<
    { id: string; topic: string; date: string }[]
  >([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('aceagent_recent_sessions');
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentSessions(Array.isArray(parsed) ? parsed.slice(0, 8) : []);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const res = await startInterview('General', 'medium');
      if (res.data?.session_id) {
        router.push(`/interview/${res.data.session_id}`);
      }
    } catch (err) {
      console.error('Failed to start:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: isMobile ? 24 : 32,
            fontWeight: 800,
            color: text,
            margin: 0,
            letterSpacing: -0.5,
          }}
        >
          Session Analysis
        </h1>
        <p style={{ color: sub, fontSize: 14, marginTop: 4, marginBottom: 0 }}>
          View AI-generated analysis for completed interview sessions.
        </p>
      </div>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 18,
          padding: '48px 32px',
          textAlign: 'center',
          boxShadow: dark
            ? '0 2px 12px rgba(0,0,0,0.2)'
            : '0 2px 12px rgba(0,0,0,0.06)',
          marginBottom: 28,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: 'rgba(139,92,246,0.1)',
            border: '1px solid rgba(139,92,246,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <BarChart2 size={28} style={{ color: '#8b5cf6' }} />
        </div>

        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: text,
            marginBottom: 8,
          }}
        >
          {recentSessions.length > 0
            ? 'Select a session below or start a new interview'
            : 'Complete an Interview to View Analysis'}
        </div>
        <div
          style={{
            fontSize: 13,
            color: sub,
            maxWidth: 440,
            margin: '0 auto 24px',
            lineHeight: 1.6,
          }}
        >
          After completing a mock interview session, your AI-powered analysis
          will appear here with detailed scores, behavioral insights, speech
          metrics, and actionable feedback.
        </div>

        <motion.button
          suppressHydrationWarning
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleStartInterview}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 28px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            border: 'none',
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 4px 16px rgba(139,92,246,0.35)',
          }}
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              Start Interview
              <ArrowRight size={16} />
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Recent Sessions List */}
      {recentSessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: 'rgba(139,92,246,0.08)',
                border: '1px solid rgba(139,92,246,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={14} style={{ color: '#8b5cf6' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: text }}>
                Recent Sessions
              </div>
              <div style={{ fontSize: 11, color: sub }}>
                Click to view full analysis
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {recentSessions.map((session, i) => (
              <motion.button
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                onClick={() =>
                  router.push(`/dashboard/analysis/${session.id}`)
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 18px',
                  background: bg,
                  border: `1px solid ${border}`,
                  borderRadius: 14,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all 0.2s',
                }}
                whileHover={{
                  scale: 1.01,
                  borderColor: 'rgba(139,92,246,0.3)',
                }}
              >
                {/* Icon badge */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'rgba(139,92,246,0.08)',
                    border: '1px solid rgba(139,92,246,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Target size={16} style={{ color: '#8b5cf6' }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: text,
                      marginBottom: 2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {session.topic || 'Interview Session'}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 11,
                      color: sub,
                    }}
                  >
                    <Clock size={10} />
                    <span>{session.date || session.id.substring(0, 8)}</span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight
                  size={16}
                  style={{ color: sub, flexShrink: 0 }}
                />
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}
