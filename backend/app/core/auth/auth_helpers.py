import secrets
from typing import Any

import jwt
from app.core.dependencies.redis import AsyncRedis
from app.core.dependencies.settings import get_settings
from fastapi import HTTPException, status
from passlib.context import CryptContext
from pydantic import BaseModel

settings = get_settings()


class TokenPayload(BaseModel):
    sub: str


pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


class AuthHelpers:
    @staticmethod
    def decode_jwt_token(encoded_token: str) -> str:
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
    def encode_jwt_data(
        payload: TokenPayload,
    ) -> str:
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
    def generate_secret_token(length=16) -> str:
        return secrets.token_urlsafe(length)

    @staticmethod
    async def create_oauth_state(session_id: str, r_client: AsyncRedis) -> str:
        """Creates a url safe secret and adds it as the value for the session id key to
        redis

        Args:
            session_id (str)
            r_client (AsyncRedis)

        Returns:
            str: returns the urlsafe secret
        """
        state = secrets.token_urlsafe(32)
        await r_client.set(f"oauth:state:{state}", session_id, ex=600)
        return state

    @staticmethod
    async def verify_oauth_state(session_id: str, session_token: str, r_client: AsyncRedis):
        """Checks that the session id matches the session token logged in Redis
        after verification deletes entry in Redis

        Args:
            session_id (str)
            session_token (str)
            r_client (AsyncRedis)

        Raises:
            HTTPException: Raises 401 if session verification fails
        """
        raw_session_id = await r_client.get(f"oauth:state:{session_token}")

        if raw_session_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired OAuth state"
            )

        retrieved_session_id = raw_session_id.decode("utf-8")
        if session_id != retrieved_session_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="OAuth state verification failed"
            )

        await r_client.delete(f"oauth:state:{session_token}")

    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
