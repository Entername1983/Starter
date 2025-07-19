from typing import Any

import jwt
from app.dependencies import get_db_async, get_settings
from app.models import User
from app.services import UserService
from fastapi import Depends, HTTPException, Request, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.status import HTTP_401_UNAUTHORIZED


class TokenPayload(BaseModel):
    sub: str


settings = get_settings()


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


async def parse_jwt_data(request: Request) -> str:
    """Parse JWT from cookie in the request.
    Raises:
        HTTPException: If the JWT is invalid or not present.
    """

    token_data = request.cookies.get(settings.security.access_token_cookie_name)
    if not token_data:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail="Access token is missing",
        )
    encoded_token: str = (
        token_data.split(" ")[1] if token_data.startswith("Bearer ") else token_data
    )
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


##TODO: Add redis cache and check
async def get_current_user(
    user_id: str = Depends(parse_jwt_data), db: AsyncSession = Depends(get_db_async)
) -> User:
    ## First check if user is cached in Redis
    user: User | None = await UserService.get_user_by_id(int(user_id), db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user
