from app.core.auth.auth_service import AuthService
from app.core.dependencies.auth import GetGoogleAuth
from app.core.dependencies.redis import GetRedisAsync
from app.core.dependencies.settings import AppSettings, get_settings
from app.core.schemas.requests import SignUpRequest
from app.core.schemas.responses import RegistrationResponse
from app.core.schemas.user import LogoutResponse, UserDataResponse
from app.dependencies import CurrentUser, GetDbAsync
from app.services import UserService
from fastapi import APIRouter, Request, Response
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
        status="success",
        loggedIn=True,
        user=UserService.turn_user_model_to_pydantic_schema(user),
        message=None,
    )


@router.post("/auth/logout/", response_model=LogoutResponse, tags=["user"])
async def logout_user(user: CurrentUser, response: Response):
    """Logs out the user by clearing the session cookie.
    Frontend should clear the browser state
    """
    response.delete_cookie("access_token")
    return LogoutResponse(status="success", message="User logged out successfully.")


@router.get("/auth/google_sign_in/", tags=["user"])
async def sign_in_with_google(
    google_auth: GetGoogleAuth,
    request: Request,
    r_client: GetRedisAsync,
    settings: AppSettings,
):
    """_summary_

    Args:
        google_auth (GetGoogleAuth)
        request (Request)
        r_client (GetRedisAsync)
        settings (AppSettings)

    Returns:
        RedirectResponse: Redirects to google auth and sets a cookie with a session_id
        to be matched later in the auth process
    """
    return await AuthService.sign_in_w_google(google_auth, request, r_client, settings)


##TODO: Need to add a check to make sure there is no tampering with the exteranl auth id or external provider
@router.get("/auth/callback")
async def auth_callback(
    state: str,
    code: str,
    request: Request,
    google_auth: GetGoogleAuth,
    db: GetDbAsync,
    settings: AppSettings,
    r_client: GetRedisAsync,
    scope: str | None = None,
):
    """
    Takes the sign-in info and redirects to registration page or back
    to original page if user already exists
    Currently only implemented to handle google auth
    Uses a session id that is stored in the users browser + an oauth verification
    token passed through the callback state, these are checked against redis key value to
    protected against CSRF

    Args:
        state (str): State including originalPage & oAuthState token
        code (str): Code that will be exchange for the oauth token
        request (Request)
        google_auth (GetGoogleAuth)
        db (GetDbAsync)
        settings (AppSettings)
        r_client (GetRedisAsync)
        scope (str | None, optional): Optionally add extra scopes here

    Returns:
        RedirectResponse: _description_
    """

    return await AuthService.handle_auth_callback(
        request, state, code, settings, google_auth, r_client, db
    )


@router.post("/auth/register", response_model=RegistrationResponse)
async def register(
    request: Request,
    data: SignUpRequest,
    settings: AppSettings,
    db: GetDbAsync,
    r_client: GetRedisAsync,
):
    """
    Args:
        data (SignUpRequest)
        settings (AppSettings)
        db (GetDbAsync)
        r_client (GetRedisAsync)

    Returns:
        RegistrationResponse: Returns a user object and a redirect url.  Also attachees a cookie
        with an access token used for authentification.
    """

    return await AuthService.register_user(data, settings, db, r_client, request)


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
