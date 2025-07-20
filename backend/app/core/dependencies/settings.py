from functools import lru_cache
from typing import Annotated

from app.core.config.config import Settings
from fastapi import Depends


@lru_cache
def get_settings() -> Settings:
    """Returning app settings"""
    return Settings()


AppSettings = Annotated[Settings, Depends(get_settings)]
