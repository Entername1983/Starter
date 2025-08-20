import json
import logging
from typing import Annotated

from app.core.auth.auth_helpers import AuthHelpers
from app.core.dependencies.db import GetDbAsync
from app.core.dependencies.redis import GetRedisAsync
from app.core.dependencies.settings import get_settings
from app.models import User, UserSettings
from app.services import UserService
from fastapi import Depends, HTTPException, Request, status
from starlette.status import HTTP_401_UNAUTHORIZED

settings = get_settings()


logger = logging.getLogger("app")


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
    return AuthHelpers.decode_jwt_token(encoded_token)


##TODO: Add redis cache and check
async def get_current_user(
    db: GetDbAsync, r_client: GetRedisAsync, user_id: str = Depends(parse_jwt_data)
) -> User:
    ## First check if user is cached in Redis
    """Get the current user from the cache/database using the user ID from the JWT token.
    Raises:
        HTTPException: If the user is not found or the JWT is invalid.
    """

    cached_user = await r_client.json().get(f"user_{user_id}")  # type:ignore - Having to ignore this the Redis package does not seperate the get method out for async - should not be an issue at runtime
    if cached_user:
        cached_user_dict = json.loads(cached_user)

        logger.info("Retrieved user", extra={**cached_user_dict})
        return User(**cached_user)
    user = await UserService.get_user_by_id(int(user_id), db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


async def get_current_user_with_settings(
    user: CurrentUser,
    db: GetDbAsync,
    r_client: GetRedisAsync,
) -> User:
    """Get the current user with settings loaded from the database using the user ID from the JWT token.
    Raises:
        HTTPException: If the user is not found or the JWT is invalid.
    """

    cached_settings = await r_client.json().get(f"user_settings_{user.id}")  # type:ignore - Having to ignore this the Redis package does not seperate the get method out for async - should not be an issue at runtime
    if cached_settings:
        return UserSettings(**cached_settings)
    user = await UserService.get_user_with_settings_by_id(int(user.id), db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user


CurrentUserWithSettings = Annotated[User, Depends(get_current_user_with_settings)]
