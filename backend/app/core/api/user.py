from app.core.auth.google_auth import get_google_auth_url
from app.core.dependencies.settings import get_settings
from app.dependencies import CurrentUser, GetDbAsync
from fastapi import APIRouter, Response
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

router = APIRouter(
    prefix="/user",
    tags=["user"],
)


class BaseSchema(BaseModel):
    id: int
    created_at: str
    updated_at: str


class UserSchema(BaseSchema):
    email: str
    first_name: str
    last_name: str
    username: str
    external_id: str | None
    external_id_type: str | None
    disabled: bool


class UserDataResponse(BaseModel):
    status: str
    loggedIn: bool
    user: UserSchema
    message: str | None


class LogoutResponse(BaseModel):
    status: str
    message: str


@router.get("/auth/status/", response_model=UserDataResponse, tags=["user"])
async def check_user_status(user: CurrentUser, db: GetDbAsync):
    return UserDataResponse(
        status="success", loggedIn=True, user=UserSchema(**user.dict()), message=None
    )


@router.post("/auth/logout/", response_model=LogoutResponse, tags=["user"])
async def logout_user(user: CurrentUser, response: Response):
    """Logs out the user by clearing the session cookie."""
    response.delete_cookie("access_token")
    return LogoutResponse(status="success", message="User logged out successfully.")


settings = get_settings()


@router.get("/auth/google_sign_in/", tags=["user"])
async def sign_in_with_google():
    auth_url = get_google_auth_url()
    return RedirectResponse(url=auth_url)


# @router.get("/google_callback")
# async def google_callback(
#     code: str,
#     state: str,
#     response: Response,
#     db: GetDbAsync,
#     settings: AppSettings):
