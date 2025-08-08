import ast
import datetime as dt
import secrets
from typing import Any, Optional

import jwt
from app.core.auth.google import OAuthUserInfoSchema
from app.core.dependencies.auth import GetGoogleAuth
from app.core.dependencies.redis import AsyncRedis
from app.core.dependencies.settings import AppSettings, get_settings
from app.core.schemas import RegisterRedirectUrl, UserSchema
from fastapi import HTTPException, status
from fastapi.responses import RedirectResponse
from google.oauth2.credentials import Credentials
from passlib.context import CryptContext
from pydantic import BaseModel
from starlette.responses import JSONResponse

settings = get_settings()


class TokenPayload(BaseModel):
    sub: str


pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


class AuthHelpers:
    @staticmethod
    def decode_jwt_token(encoded_token: str) -> str:
        try:
            token = AuthHelpers.encode_jwt_data(TokenPayload(sub="jaja"))
            assert jwt.decode(
                token,
                settings.security.token_secret_key,
                algorithms=[settings.security.jwt_algorithm],
            )
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
    def encode_jwt_data(payload: TokenPayload) -> str:
        try:
            encoded_token = jwt.encode(  # type: ignore
                payload.model_dump(),
                settings.security.token_secret_key,
                algorithm=settings.security.jwt_algorithm,
            )
            return encoded_token
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not encode JWT",
            ) from e

    @staticmethod
    def create_session_id() -> str:
        return secrets.token_urlsafe(16)

    @staticmethod
    async def create_oauth_state(session_id: str, r_client: AsyncRedis) -> str:
        state = secrets.token_urlsafe(32)
        await r_client.set(f"oauth:state:{state}", session_id, ex=600)
        return state

    @staticmethod
    async def verify_oauth_state(session_id: str, session_token: str, r_client: AsyncRedis):
        ## use the session id to look it up in redis
        raw_session_id = await r_client.get(f"oauth:state:{session_token}")
        retrieved_session_id = raw_session_id.decode("utf-8")
        if session_id != retrieved_session_id:
            raise Exception("session_id does not match")
        await r_client.delete(f"oauth:state:{session_token}")
        return

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
        print("data", data)
        original_page = ast.literal_eval(state)["originalPage"]

        data["accessToken"] = credentials.token
        data["originalPage"] = original_page
        data["settings"] = {"settings": "empty"}
        redirect_url_object = RegisterRedirectUrl.model_validate(data, by_alias=True)
        redirect_str = google_auth.construct_redirect_url(
            redirect_url_object, app_settings.app.frontend_url, "register"
        )
        return RedirectResponse(url=redirect_str)

    @staticmethod
    def login_redirect_response(
        user: UserSchema,
        credentials: Credentials,
        user_settings: dict[str, Any],
        state: str,
        google_auth: GetGoogleAuth,
        app_settings: AppSettings,
    ) -> RedirectResponse:
        # data["access_token"] = credentials.token
        # data["original_page"] = state
        # data["settings"] = {"settings": "empty"}
        user_dict = user.model_dump(by_alias=True, exclude={"external_user_id", "auth_provider"})
        original_page = ast.literal_eval(state)["originalPage"]
        response_content = {
            "redirectUrl": original_page,
            "user": user_dict,
        }
        response = JSONResponse(content=response_content)
        access_token = AuthHelpers.create_access_token(
            data={"sub": str(user.id)}, settings=settings
        )
        redirect_str = f"{settings.app.frontend_url}{original_page}"
        response = RedirectResponse(url=redirect_str)
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=settings.auth.http_only,
            max_age=settings.auth.cookie_max_age,
            samesite=settings.auth.same_site,
            secure=True,
            domain=settings.auth.domain,
            path="/",
        )
        return response

    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
