"""
Health check & system status endpoints.
"""

from __future__ import annotations

from fastapi import APIRouter

from app.core.config import settings
from app.models.schemas import APIResponse
from app.services.memory import redis_store

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
    """
    # Trigger a store check
    await redis_store._get_client()
    
    checks: dict = {
        "config_loaded": True,
        "openai_key_set": bool(settings.openai_api_key and settings.openai_api_key.startswith("sk-")),
        "memory_store": "in_memory" if redis_store.use_fallback else "redis",
    }
    all_ok = all(checks.values())
    return APIResponse(
        success=all_ok,
        data={"checks": checks},
        error=None if all_ok else "One or more readiness checks failed",
    )
