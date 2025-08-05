import ast

from app.core.auth.auth import AuthHelpers
from app.core.dependencies.auth import GetGoogleAuth
from app.core.dependencies.redis import GetRedisAsync
from app.core.dependencies.settings import AppSettings, get_settings
from app.core.schemas import UserSchema
from app.core.schemas.requests import SignUpRequest
from app.core.schemas.responses import RegistrationResponse
from app.core.schemas.user import LogoutResponse, UserDataResponse
from app.core.services.user_service import UserService
from app.dependencies import CurrentUser, GetDbAsync
from app.models import User
from fastapi import APIRouter, Request, Response
from fastapi.responses import JSONResponse, RedirectResponse
from pydantic import BaseModel

router = APIRouter(
    prefix="/user",
    tags=["user"],
)

settings = get_settings()


class CallbackQueryParams(BaseModel):
    access_token: str
    expires_at: int
    scope: list[str]


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


# TODO: Find a better name than extra for the additional state passed in
@router.get("/auth/google_sign_in/", tags=["user"])
async def sign_in_with_google(
    google_auth: GetGoogleAuth, request: Request, r_client: GetRedisAsync
):
    params: dict[str, str] = dict(request.query_params)

    session_id = AuthHelpers.create_session_id()
    oauth_state = await AuthHelpers.create_oauth_state(session_id, r_client)
    params["oAuthState"] = oauth_state
    auth_url = await google_auth.get_auth_url(params)
    response = RedirectResponse(url=auth_url)
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=settings.auth.http_only,
        max_age=600,
        samesite=settings.auth.same_site,
        secure=settings.app.environment == "production",
        domain=settings.auth.domain,
    )
    return response


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
    r_client: GetRedisAsync,
    scope: str | None = None,
) -> RedirectResponse:
    session_id = request.cookies.get("session_id")
    if session_id is None:
        raise Exception("missing session_id")
    o_auth_state = ast.literal_eval(state)["oAuthState"]
    await AuthHelpers.verify_oauth_state(session_id, o_auth_state, r_client)

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


@router.post("/auth/register", response_model=RegistrationResponse)
async def register(
    data: SignUpRequest,
    settings: AppSettings,
    db: GetDbAsync,
    r_client: GetRedisAsync,
):
    ## Receive the registration info from the frontend
    ## Can either be internal, in which case a password will be supplied.  Needs to be encrypted and stored in db
    ## if not internal, no password, just store the user with external_id + auth provider in db
    ## return a token attached to a cookie in a redirect response
    new_user: User = await UserService.create_user(
        db,
        data.email,
        data.username,
        data.auth_provider,
        data.given_name,
        data.family_name,
        data.o_auth_id,
        data.password,
    )
    access_token = AuthHelpers.create_access_token(
        data={"sub": str(new_user.id)}, settings=settings
    )
    user_schema = UserService.turn_user_model_to_pydantic_schema(new_user)
    redirect_url = data.original_page
    if redirect_url == "/login":
        redirect_url = "/"
    if redirect_url is None:
        redirect_url = "/"
    user_dict = user_schema.model_dump(by_alias=True, exclude={"external_user_id", "auth_provider"})

    response_content = {
        "redirectUrl": redirect_url,
        "user": user_dict,
    }
    response = JSONResponse(content=response_content)

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


# "redirectUrl": "/",
#     "user": {
#         "id": 96,
#         "createdAt": "2025-08-04T20:22:26.527284",
#         "updatedAt": "2025-08-04T20:22:26.527291",
#         "email": "kevin.e.mccarthy1983@gmail.com",
#         "givenName": "Kevin",
#         "familyName": "McCarthy",
#         "username": "qfqfqefqefeq",
#         "externalUserId": "112573635607727600000",
#         "authProvider": "google",
#         "disabled": false,
#         "settings": null,
#         "pictureUrl": null
#     }
