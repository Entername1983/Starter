import json
import logging
from typing import cast
from urllib.parse import urlencode

import google_auth_oauthlib.flow
import httpx
from app.core.dependencies.settings import get_settings
from app.core.schemas.user import (
    AuthProviderEnum,
    OAuthUserInfoSchema,
    RegisterRedirectUrl,
)
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow

# GOOGLE_REDIRECT_URI = "http://localhost:8000/user/auth/callback"

settings = get_settings()

logger = logging.getLogger("app")


class GoogleAuth:
    def __init__(
        self,
    ):
        self.scopes = settings.auth.google_auth_scopes
        self.google_auth_req_api = settings.auth.google_auth_req_api
        self.config = {
            "web": {
                "client_id": settings.auth.google_client_id,
                "project_id": settings.auth.google_project_id,
                "auth_uri": settings.auth.google_auth_uri,
                "token_uri": settings.auth.google_token_uri,
                "auth_provider_x509_cert_url": settings.auth.google_auth_provider_x509_cert_url,
                "client_secret": settings.auth.google_client_secret,
                "redirect_uris": settings.auth.google_redirect_uris,
                "javascript_origins": settings.auth.google_javascript_origins,
            }
        }

        self.redirect_uri = "https://cognaite.com/api/user/auth/callback"
        # self.redirect_uri = GoogleAuthWebClientConfig.model_validate(self.config).web.redirect_uris[
        #     0
        # ]

        self.flow: Flow = google_auth_oauthlib.flow.Flow.from_client_config(  # type:ignore
            self.config,
            scopes=self.scopes,
        )
        # self.flow.redirect_uri = self.redirect_uri  # type:ignore
        self.flow.redirect_uri = "https://cognaite.com/api/user/auth/callback"  # type:ignore

    async def get_auth_url(self, extra: dict) -> str:
        auth_url, _ = self.flow.authorization_url(
            state=extra,  # type:ignore
            access_type="offline",
            included_granted_scopes="true",
            prompt="consent",
        )
        if not isinstance(auth_url, str):
            raise Exception("Missing google auth url")
        return auth_url

    async def exchange_code_for_token(self, code: str) -> Credentials:
        self.flow.fetch_token(code=code)  # type:ignore
        credentials = cast(Credentials, self.flow.credentials)  # type:ignore
        return credentials

    async def request_google_user_info(self, access_token: str) -> dict[str, str]:
        print(self.flow.redirect_uri)
        print(access_token)
        async with httpx.AsyncClient() as client:
            raw_bytes = await client.get(
                self.google_auth_req_api,
                headers={"Authorization": f"Bearer {access_token}"},
            )
        return json.loads(raw_bytes.content.decode("utf-8"))

    @staticmethod
    def turn_google_oauth_info_into_object(
        google_auth_content: dict[str, str],
    ) -> OAuthUserInfoSchema:
        print("google auth info", google_auth_content)
        return OAuthUserInfoSchema(
            o_auth_id=google_auth_content["id"],
            email=google_auth_content["email"],
            name=google_auth_content["name"],
            given_name=google_auth_content.get("given_name"),
            family_name=google_auth_content.get("family_name"),
            picture_url=google_auth_content.get("picture"),
            auth_provider=AuthProviderEnum.google,
        )

    @staticmethod
    def construct_redirect_url(data: RegisterRedirectUrl, url: str, slug: str) -> str:
        query_string = urlencode(data.model_dump(by_alias=True))
        return f"{url}/{slug}?{query_string}"
