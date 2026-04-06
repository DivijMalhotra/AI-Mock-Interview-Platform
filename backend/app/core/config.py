"""
ACIE Backend — Centralized Configuration

Loads all settings from environment variables via pydantic-settings.
Every module imports `settings` from here instead of reading env directly.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── OpenAI ──
    openai_api_key: str = ""
    openai_model: str = "gpt-4o"
    openai_embedding_model: str = "text-embedding-3-small"

    # ── Redis ──
    redis_url: str = "redis://localhost:6379/0"

    # ── FAISS ──
    faiss_index_dir: str = "./data/faiss"

    # ── Whisper ──
    whisper_model_size: str = "base"

    # ── Server ──
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    cors_origins: str = '["http://localhost:3000"]'

    # ── Session ──
    session_ttl_seconds: int = 3600

    # ── Derived helpers ──
    @property
    def cors_origin_list(self) -> List[str]:
        """Parse the JSON-encoded CORS_ORIGINS string into a list."""
        try:
            return json.loads(self.cors_origins)
        except (json.JSONDecodeError, TypeError):
            return ["http://localhost:3000"]

    @property
    def faiss_index_path(self) -> Path:
        p = Path(self.faiss_index_dir)
        p.mkdir(parents=True, exist_ok=True)
        return p


settings = Settings()
