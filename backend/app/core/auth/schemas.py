from enum import Enum
from typing import Any

from pydantic import BaseModel


class GoogleAuthClientConfig(BaseModel):
    client_id: str
    project_id: str
    auth_provider_x509_cert_url: str
    client_secret: str
    redirect_uris: list[str]
    auth_uri: str
    token_uri: str

    javascript_origins: list[str]


class GoogleAuthWebClientConfig(BaseModel):
    web: GoogleAuthClientConfig


class AuthProviderEnum(str, Enum):
    google = "google"
    discord = "discord"
    microsoft = "microsoft"


class OAuthUserInfoSchema(BaseModel):
    o_auth_id: str
    email: str
    name: str
    given_name: str | None
    family_name: str | None
    picture_url: str | None
    auth_provider: AuthProviderEnum


class RegisterRedirectUrl(OAuthUserInfoSchema):
    access_token: str
    original_page: str
    settings: dict[str, Any]


# class LoginUserResponse(BaseModel):
