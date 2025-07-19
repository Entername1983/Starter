from typing import Annotated

from app.dependencies import get_db_async, get_settings
from app.models import User
from app.services import AuthService, UserService
from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.status import HTTP_401_UNAUTHORIZED

settings = get_settings()


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
    return await AuthService.decode_jwt_token(encoded_token)


##TODO: Add redis cache and check
async def get_current_user(
    user_id: str = Depends(parse_jwt_data), db: AsyncSession = Depends(get_db_async)
) -> User:
    ## First check if user is cached in Redis
    """Get the current user from the database using the user ID from the JWT token.
    Raises:
        HTTPException: If the user is not found or the JWT is invalid.
    """
    user = await UserService.get_user_by_id(int(user_id), db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user


async def get_current_user_with_settings(
    user_id: str = Depends(parse_jwt_data), db: AsyncSession = Depends(get_db_async)
) -> User:
    """Get the current user with settings loaded from the database using the user ID from the JWT token.
    Raises:
        HTTPException: If the user is not found or the JWT is invalid.
    """
    user = await UserService.get_user_with_settings_by_id(int(user_id), db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
CurrentUserWithSettings = Annotated[User, Depends(get_current_user_with_settings)]
