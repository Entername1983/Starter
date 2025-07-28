from app.core.auth.auth import AuthHelpers
from app.core.dependencies.auth import GetGoogleAuth
from app.core.dependencies.settings import AppSettings, get_settings
from app.core.schemas import UserSchema
from app.core.schemas.requests import SignUpRequest
from app.core.schemas.user import LogoutResponse, UserDataResponse
from app.core.services.user_service import UserService
from app.dependencies import CurrentUser, GetDbAsync
from app.models import User
from fastapi import APIRouter, Request, Response
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

router = APIRouter(
    prefix="/user",
    tags=["user"],
)


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


# TODO: Find a better name than extra for the additional state passed in
@router.get("/auth/google_sign_in/", tags=["user"])
async def sign_in_with_google(
    google_auth: GetGoogleAuth,
    request: Request,
):
    params: dict[str, str] = dict(request.query_params)
    print(params)
    auth_url = await google_auth.get_auth_url(params)
    return RedirectResponse(url=auth_url)


class CallbackQueryParams(BaseModel):
    access_token: str
    expires_at: int
    scope: list[str]


@router.get(
    "/auth/callback",
)
async def auth_callback(
    state: str,
    code: str,
    request: Request,
    google_auth: GetGoogleAuth,
    db: GetDbAsync,
    settings: AppSettings,
    scope: str | None = None,
) -> RedirectResponse:
    credentials = await google_auth.exchange_code_for_token(code)
    user_info = await google_auth.request_google_user_info(credentials.token)
    print(user_info)
    new_user = google_auth.turn_google_oauth_info_into_object(user_info)
    user = await UserService.get_user_by_external_id(db, new_user.o_auth_id, new_user.auth_provider)
    if user:
        return AuthHelpers.login_redirect_response(
            user=user,
            credentials=credentials,
            user_settings={"None": "None"},
            state=state,
            google_auth=google_auth,
            app_settings=settings,
        )
    return AuthHelpers.registration_redirect_response(
        new_user=new_user,
        credentials=credentials,
        user_settings={"None": "None"},
        state=state,
        google_auth=google_auth,
        app_settings=settings,
    )


@router.post("/auth/register")
async def register(
    request: SignUpRequest,
    settings: AppSettings,
    db: GetDbAsync,
):
    print(request.model_dump)
    ## Receive the registration info from the frontend
    ## Can either be internal, in which case a password will be supplied.  Needs to be encrypted and stored in db
    ## if not internal, no password, just store the user with external_id + auth provider in db
    ## return a token attached to a cookie in a redirect response
    if request.auth_provider == "internal":
        ## register internal user
        pass

    else:
        new_user: User = await UserService.create_user(
            db,
            request.email,
            request.username,
            request.auth_provider,
            request.given_name,
            request.family_name,
            request.external_id,
            request.password,
        )
    access_token = AuthHelpers.create_access_token(
        data={"sub": str(new_user.id)}, settings=settings
    )

    ## stringify user to add to url as query param
    user_dict = "test"
    originalPage = request.original_page if request.original_page is not None else "/"
    stringified_user = str(user_dict)
    redirect_url = f"{settings.app.frontend_url}/?{stringified_user}"
    response = RedirectResponse(url=redirect_url)

    print(redirect_url)
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=settings.auth.http_only,
        max_age=settings.auth.cookie_max_age,
        samesite=settings.auth.same_site,
        secure=settings.app.environment == "production",
        domain=settings.auth.domain,
        path="/",
    )

    return response
