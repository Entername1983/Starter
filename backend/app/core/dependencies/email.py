from functools import lru_cache
from typing import Annotated

from app.core.dependencies.settings import get_settings
from app.core.email.email_service import EmailService
from fastapi import Depends

settings = get_settings()


@lru_cache()
def get_email_service() -> EmailService:
    """Create and cache EmailService instance"""
    return EmailService(
        smtp_server=settings.email.SMTP_SERVER,
        smtp_port=settings.email.SMTP_PORT,
        smtp_username=settings.email.SMTP_USERNAME,
        smtp_password=settings.email.SMTP_PASSWORD,
    )


GetEmailService = Annotated[EmailService, Depends(get_email_service)]
