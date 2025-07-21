import json
from enum import Enum
from pathlib import Path
from typing import cast

import google_auth_oauthlib.flow
import httpx
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from pydantic import BaseModel

CURRENT_DIR = Path(__file__).resolve().parent.parent.parent.parent

FILENAME = "google_auth_secret_file.json"
GOOGLE_SECRET_FILE = CURRENT_DIR / "secrets" / FILENAME


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


class AuthProvider(str, Enum):
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
    auth_provider: AuthProvider


GOOGLE_AUTH_SCOPES = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/drive.metadata.readonly",
    "https://www.googleapis.com/auth/calendar.readonly",
    "openid",
]

GOOGLE_REDIRECT_URI = "http://localhost:8000/user/auth/callback"


class GoogleAuth:
    def __init__(
        self,
        client_secret_path: Path = GOOGLE_SECRET_FILE,
        scopes: list[str] = GOOGLE_AUTH_SCOPES,
        redirect_uri: str = GOOGLE_REDIRECT_URI,
    ):
        self.scopes = scopes
        self.redirect_uri = redirect_uri

        # Load and validate config
        with open(client_secret_path, "r") as f:
            config = json.load(f)
            GoogleAuthWebClientConfig.model_validate(config)

        # Initialize the Flow instance
        self.flow: Flow = google_auth_oauthlib.flow.Flow.from_client_config(  # type:ignore
            config,
            scopes=scopes,
        )
        self.flow.redirect_uri = redirect_uri  # type:ignore

    async def get_auth_url(self) -> str:
        auth_url, _ = self.flow.authorization_url(  # type:ignore
            access_type="offline", included_granted_scopes="true", prompt="consent"
        )
        if not isinstance(auth_url, str):
            raise Exception("Missing google auth url")
        return auth_url

    async def exchange_code_for_token(self, code: str) -> Credentials:
        self.flow.fetch_token(code=code)  # type:ignore
        credentials = cast(Credentials, self.flow.credentials)  # type:ignore
        return credentials

    async def request_google_user_info(self, access_token: str) -> dict[str, str]:
        print(access_token)
        async with httpx.AsyncClient() as client:
            raw_bytes = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )
        json_str = raw_bytes.content.decode("utf-8")
        return json.loads(json_str)

    @staticmethod
    def turn_google_oauth_info_into_object(
        google_auth_content: dict[str, str],
    ) -> OAuthUserInfoSchema:
        return OAuthUserInfoSchema(
            o_auth_id=google_auth_content["id"],
            email=google_auth_content["email"],
            name=google_auth_content["name"],
            given_name=google_auth_content.get("given_name"),
            family_name=google_auth_content.get("family_name"),
            picture_url=google_auth_content.get("picture"),
            auth_provider=AuthProvider.google,
        )
