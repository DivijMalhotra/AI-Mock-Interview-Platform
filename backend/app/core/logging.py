"""
ACIE Backend — Structured logging setup.

Provides a configured logger that every module should use:
    from app.core.logging import logger
    logger.info("message")
"""

from __future__ import annotations

import logging
import sys

from app.core.config import settings


def _build_logger() -> logging.Logger:
    level = logging.DEBUG if settings.debug else logging.INFO

    formatter = logging.Formatter(
        fmt="%(asctime)s │ %(levelname)-8s │ %(name)s │ %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root = logging.getLogger("acie")
    root.setLevel(level)
    root.addHandler(handler)
    root.propagate = False

    # Silence noisy third-party loggers
    for name in ("httpcore", "httpx", "openai", "urllib3", "multipart"):
        logging.getLogger(name).setLevel(logging.WARNING)

    return root


logger = _build_logger()
