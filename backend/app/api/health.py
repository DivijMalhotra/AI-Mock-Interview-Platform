"""
Health check & system status endpoints.
"""

from __future__ import annotations

from fastapi import APIRouter

from app.core.config import settings
from app.models.schemas import APIResponse

router = APIRouter(prefix="/health", tags=["health"])


@router.get("", response_model=APIResponse)
async def health_check() -> APIResponse:
    """Basic liveness probe."""
    return APIResponse(
        data={
            "status": "healthy",
            "service": "acie-backend",
            "debug": settings.debug,
        }
    )


@router.get("/ready", response_model=APIResponse)
async def readiness_check() -> APIResponse:
    """
    Readiness probe — validates that critical services are reachable.
    Phases 2-3 will add Redis and FAISS checks here.
    """
    checks: dict = {
        "config_loaded": True,
        "openai_key_set": bool(settings.openai_api_key and settings.openai_api_key != "sk-YOUR_KEY_HERE"),
    }
    all_ok = all(checks.values())
    return APIResponse(
        success=all_ok,
        data={"checks": checks},
        error=None if all_ok else "One or more readiness checks failed",
    )
