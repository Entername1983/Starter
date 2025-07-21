from app.core.dependencies.auth import GetGoogleAuth
from app.core.dependencies.settings import get_settings
from app.core.services.user_service import UserService
from app.dependencies import CurrentUser, GetDbAsync
from fastapi import APIRouter, Request, Response
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
async def sign_in_with_google(google_auth: GetGoogleAuth):
    auth_url = await google_auth.get_auth_url()
    return RedirectResponse(url=auth_url)


class CallbackQueryParams(BaseModel):
    access_token: str
    expires_at: int
    scope: list[str]


@router.get("/auth/callback")
async def auth_callback(
    state: str,
    code: str,
    request: Request,
    google_auth: GetGoogleAuth,
    db: GetDbAsync,
    scope: str | None = None,
):
    credentials = await google_auth.exchange_code_for_token(code)
    user_info = await google_auth.request_google_user_info(credentials.token)
    new_user = google_auth.turn_google_oauth_info_into_object(user_info)
    user = await UserService.get_user_by_external_id(
        db, int(new_user.o_auth_id), new_user.auth_provider
    )
    if user:
        return {"Status": "User is registered"}
    ## Implement redirect to registration page
    return {"Status": "User not yet registered"}
    # await UserService.create_user(db, user.email, user.first_name, user.last_name, user.username)
    # return
