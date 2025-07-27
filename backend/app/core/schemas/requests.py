from app.core.schemas.base import BaseConfig
from app.core.schemas.enums import AuthProviderEnum
from pydantic.networks import EmailStr


class SignUpRequest(BaseConfig):
    email: EmailStr
    username: str
    password: str | None = None
    given_name: str | None = None
    family_name: str | None = None
    external_id: str | None = None
    auth_provider: AuthProviderEnum
    access_token: str | None = None
    picture_url: str | None = None
    terms: bool = False
    newsletter: bool = False
    promo_code: str | None = None
    original_page: str | None = None
    settings: str | None = None
