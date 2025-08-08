from typing import Any

from app.core.schemas.base import BaseConfig, BaseSchema
from app.core.schemas.enums import AuthProviderEnum
from pydantic.networks import EmailStr


class UserSettingsSchema(BaseConfig):
    id: int
    user_id: int
    notifications_enabled: bool


class UserSchema(BaseSchema):
    email: EmailStr
    given_name: str
    family_name: str | None
    username: str
    external_user_id: str | None
    auth_provider: AuthProviderEnum | None
    disabled: bool
    settings: UserSettingsSchema | None = None
    picture_url: str | None


class UserDataResponse(BaseConfig):
    status: str
    loggedIn: bool
    user: UserSchema
    message: str | None


class LogoutResponse(BaseConfig):
    status: str
    message: str


class GoogleAuthClientConfig(BaseConfig):
    client_id: str
    project_id: str
    auth_provider_x509_cert_url: str
    client_secret: str
    redirect_uris: list[str]
    auth_uri: str
    token_uri: str

    javascript_origins: list[str]


class GoogleAuthWebClientConfig(BaseConfig):
    web: GoogleAuthClientConfig


class OAuthUserInfoSchema(BaseConfig):
    o_auth_id: str
    email: str
    name: str | None
    given_name: str | None
    family_name: str | None
    picture_url: str | None
    auth_provider: AuthProviderEnum


class RegisterRedirectUrl(OAuthUserInfoSchema):
    access_token: str
    original_page: str
    settings: dict[str, Any]
