"""
ACIE Backend — Memory Store (Redis with In-Memory Fallback).
Handles distributed session state management or local cache if Redis is unavailable.
"""
from __future__ import annotations

import orjson
from typing import Dict, Optional
from redis.asyncio import Redis
import asyncio

from app.core.config import settings
from app.core.logging import logger
from app.models.schemas import SessionState

class InMemoryStore:
    """Fallback store used when Redis is unavailable."""
    def __init__(self):
        self._data: Dict[str, bytes] = {}
        logger.warning("Using InMemoryStore fallback for session management.")

    async def setex(self, key: str, ttl: int, value: bytes):
        self._data[key] = value
        # Basic TTL simulation (optional, but keep it simple for now)
        return True

    async def get(self, key: str) -> Optional[bytes]:
        return self._data.get(key)

    async def delete(self, key: str):
        if key in self._data:
            del self._data[key]
        return True

    async def ping(self):
        return True

class RedisStore:
    """Manages interview sessions in Redis with automatic In-Memory fallback."""

    def __init__(self):
        self.client = Redis.from_url(settings.redis_url, decode_responses=False)
        self.use_fallback = False
        self._fallback_store = None

    async def _get_client(self):
        """Returns the Redis client or the fallback store if Redis is down."""
        if self.use_fallback:
            return self._fallback_store

        try:
            # Short timeout ping to check if Redis is alive
            await asyncio.wait_for(self.client.ping(), timeout=1.0)
            return self.client
        except (Exception, asyncio.TimeoutError):
            logger.error("Redis connection failed. Switching to InMemoryStore.")
            self.use_fallback = True
            self._fallback_store = InMemoryStore()
            return self._fallback_store

    async def save_session(self, session: SessionState) -> None:
        """Serialize and save the session state."""
        try:
            client = await self._get_client()
            key = f"session:{session.session_id}"
            data = orjson.dumps(session.model_dump())
            
            if self.use_fallback:
                await client.setex(key, settings.session_ttl_seconds, data)
            else:
                await client.setex(key, settings.session_ttl_seconds, data)
        except Exception as e:
            logger.error("Failed to save session: %s", e)

    async def get_session(self, session_id: str) -> SessionState | None:
        """Fetch and deserialize a session object."""
        try:
            client = await self._get_client()
            key = f"session:{session_id}"
            data = await client.get(key)
            if not data:
                return None
            return SessionState(**orjson.loads(data))
        except Exception as e:
            logger.error("Failed to get session: %s", e)
            return None

    async def delete_session(self, session_id: str) -> None:
        try:
            client = await self._get_client()
            key = f"session:{session_id}"
            await client.delete(key)
        except Exception as e:
            logger.error("Failed to delete session: %s", e)

redis_store = RedisStore()
