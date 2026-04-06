"""
Interview lifecycle API endpoints.

- POST /interview/start  → create session, return first question
- POST /interview/{id}/answer → submit answer, get evaluation + next question
- GET  /interview/{id}/summary → get full session summary
- POST /interview/{id}/end → end session early
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.core.logging import logger
from app.models.schemas import (
    APIResponse,
    Answer,
    AnswerEvaluation,
    ConfidenceBreakdown,
    ConfidenceScore,
    Difficulty,
    InterviewAnswerResponse,
    InterviewConfig,
    InterviewStartResponse,
    InterviewStatus,
    InterviewSummary,
    Question,
    SessionState,
)

router = APIRouter(prefix="/interview", tags=["interview"])

# In-memory session storage (Phase 3 replaces with Redis)
_sessions: dict[str, SessionState] = {}


@router.post("/start", response_model=APIResponse)
async def start_interview(config: InterviewConfig) -> APIResponse:
    """
    Start a new interview session.
    Phase 2 will wire in the AI agents for real question generation.
    """
    session = SessionState(config=config)
    logger.info("Starting session %s | topic=%s difficulty=%s", session.session_id, config.topic, config.difficulty)

    # Placeholder first question (Phase 2 replaces with agent-generated)
    first_question = Question(
        text=f"Tell me about your experience with {config.topic}.",
        difficulty=config.difficulty,
        topic=config.topic,
    )

    session.status = InterviewStatus.ACTIVE
    session.questions_asked.append(first_question.model_dump())
    _sessions[session.session_id] = session

    return APIResponse(
        data=InterviewStartResponse(
            session_id=session.session_id,
            first_question=first_question,
            status=InterviewStatus.ACTIVE,
        ).model_dump()
    )


@router.post("/{session_id}/answer", response_model=APIResponse)
async def submit_answer(session_id: str, answer: Answer) -> APIResponse:
    """
    Submit an answer to the current question.
    Phase 2 will wire in real evaluation + follow-up generation.
    Phase 4-6 will add audio/video/confidence scoring.
    """
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.status != InterviewStatus.ACTIVE:
        raise HTTPException(status_code=400, detail=f"Session is {session.status.value}")

    logger.info("Answer received for session %s | question=%s", session_id, answer.question_id)

    session.answers.append(answer.model_dump())

    # Placeholder evaluation (Phase 2 replaces)
    evaluation = AnswerEvaluation(
        question_id=answer.question_id,
        score=7.0,
        strengths=["Good structure"],
        weaknesses=["Could add more detail"],
        missing_concepts=[],
        depth_rating="adequate",
        suggestion="Try to include concrete examples.",
    )

    # Placeholder confidence (Phase 6 replaces)
    confidence = ConfidenceScore(
        overall=0.7,
        breakdown=ConfidenceBreakdown(
            eye_contact=0.8,
            speech_clarity=0.7,
            speech_pace=0.6,
            facial_expression=0.7,
            filler_word_ratio=0.8,
        ),
        feedback="Maintain eye contact and reduce filler words.",
    )

    session.confidence_scores.append(confidence.model_dump())

    # Generate next question (placeholder — Phase 2 replaces)
    next_q = Question(
        text=f"Can you elaborate on {session.config.topic} further?",
        difficulty=session.config.difficulty,
        topic=session.config.topic,
        follow_up=True,
    )
    session.questions_asked.append(next_q.model_dump())
    session.current_question_index += 1

    return APIResponse(
        data=InterviewAnswerResponse(
            evaluation=evaluation,
            confidence=confidence,
            next_question=next_q,
            session_status=InterviewStatus.ACTIVE,
        ).model_dump()
    )


@router.get("/{session_id}/summary", response_model=APIResponse)
async def get_summary(session_id: str) -> APIResponse:
    """Return the full interview summary."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    avg_confidence = 0.0
    if session.confidence_scores:
        avg_confidence = sum(c["overall"] for c in session.confidence_scores) / len(session.confidence_scores)

    summary = InterviewSummary(
        session_id=session_id,
        topic=session.config.topic,
        total_questions=len(session.questions_asked),
        average_score=7.0,  # placeholder
        average_confidence=round(avg_confidence, 2),
        strengths=["Good communication"],
        weaknesses=["Needs more depth"],
        roadmap=["Practice system design", "Study advanced concepts"],
    )

    return APIResponse(data=summary.model_dump())


@router.post("/{session_id}/end", response_model=APIResponse)
async def end_interview(session_id: str) -> APIResponse:
    """End an active session."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.status = InterviewStatus.COMPLETED
    logger.info("Session %s ended | questions=%d", session_id, len(session.questions_asked))

    return APIResponse(data={"session_id": session_id, "status": "completed"})
