from typing import Any

import jwt
from app.dependencies import get_settings
from fastapi import HTTPException, status
from pydantic import BaseModel

settings = get_settings()


class TokenPayload(BaseModel):
    sub: str


class AuthService:
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
