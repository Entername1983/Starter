import datetime as dt
from typing import Any, Optional

import jwt
from app.core.auth.google import OAuthUserInfoSchema
from app.core.dependencies.auth import GetGoogleAuth
from app.core.dependencies.settings import AppSettings, get_settings
from app.core.models.user import User
from app.core.schemas import RegisterRedirectUrl
from fastapi import HTTPException, status
from fastapi.responses import RedirectResponse
from google.oauth2.credentials import Credentials
from pydantic import BaseModel

settings = get_settings()


class TokenPayload(BaseModel):
    sub: str


class AuthHelpers:
    @staticmethod
    async def decode_jwt_token(encoded_token: str) -> str:
        try:
            decoded_jwt: Any = jwt.decode(  # type: ignore
                encoded_token,
                settings.security.token_secret_key,
                algorithms=[settings.security.jwt_algorithm],
            )  # type: ignore
            return decoded_jwt.get("sub")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            ) from e

    @staticmethod
    async def encode_jwt_data(payload: TokenPayload) -> str:
        try:
            return jwt.encode(  # type: ignore
                payload.model_dump(),
                settings.security.token_secret_key,
                algorithm=settings.security.jwt_algorithm,
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not encode JWT",
            ) from e

    @staticmethod
    def create_access_token(
        data: dict,
        settings: AppSettings,
        expires_delta: Optional[dt.timedelta] = None,
    ) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = dt.datetime.now() + expires_delta
        else:
            expire = dt.datetime.now() + dt.timedelta(
                minutes=settings.auth.cookie_max_age,
            )
        to_encode.update({"exp": expire})
        return jwt.encode(
            to_encode,
            settings.auth.secret_key,
            algorithm=settings.auth.algorithm,
        )

    @staticmethod
    def registration_redirect_response(
        new_user: OAuthUserInfoSchema,
        credentials: Credentials,
        user_settings: dict[str, Any],
        state: str,
        google_auth: GetGoogleAuth,
        app_settings: AppSettings,
    ) -> RedirectResponse:
        data = new_user.model_dump(by_alias=True)
        data["accessToken"] = credentials.token
        data["originalPage"] = state
        data["settings"] = {"settings": "empty"}
        redirect_url_object = RegisterRedirectUrl.model_validate(data, by_alias=True)
        redirect_str = google_auth.construct_redirect_url(
            redirect_url_object, app_settings.app.frontend_url, "register"
        )
        print(redirect_str)
        return RedirectResponse(url=redirect_str)

    @staticmethod
    def login_redirect_response(
        user: User,
        credentials: Credentials,
        user_settings: dict[str, Any],
        state: str,
        google_auth: GetGoogleAuth,
        app_settings: AppSettings,
    ) -> RedirectResponse:
        data = user.model_dump()
        data["access_token"] = credentials.token
        data["original_page"] = state
        data["settings"] = {"settings": "empty"}
        redirect_url_object = RegisterRedirectUrl.model_validate(data)
        redirect_str = google_auth.construct_redirect_url(
            redirect_url_object, app_settings.app.frontend_url, state
        )
        response = RedirectResponse(url=redirect_str)
        access_token = AuthHelpers.create_access_token(
            data={"sub": str(user.id)}, settings=settings
        )
        response.set_cookie(
            key="access_token",
            value=f"Bearer {access_token}",
            httponly=settings.auth.http_only,
            max_age=settings.auth.cookie_max_age,
            samesite=settings.auth.same_site,
            secure=True,
            domain=settings.auth.domain,
            path="/",
        )
        return response
