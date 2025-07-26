from typing import Optional

from app.core.schemas.base import BaseConfig
from app.core.schemas.enums import AuthProviderEnum
from pydantic.networks import EmailStr


class SignUpRequest(BaseConfig):
    email: EmailStr
    username: str
    given_name: str | None
    family_name: Optional[str] = None
    auth_provider: AuthProviderEnum
    access_token: str | None
    picture_url: Optional[str] = None
    terms: bool
    newsletter: bool
    promo_code: str | None = None
    original_page: str | None = None
    settings: str | None = None
