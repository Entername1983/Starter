import ast

from app.core.auth.auth_helpers import AuthHelpers, TokenPayload
from app.core.auth.google import GoogleAuth
from app.core.dependencies.redis import AsyncRedis
from app.core.dependencies.settings import AppSettings
from app.core.schemas.requests import SignUpRequest
from app.core.services.user_service import UserService
from app.models import User
from fastapi import Request
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession


class AuthService:
    @staticmethod
    async def handle_auth_callback(
        request: Request,
        state: str,
        code: str,
        settings: AppSettings,
        google_auth: GoogleAuth,
        r_client: AsyncRedis,
        db: AsyncSession,
    ) -> RedirectResponse:
        """Receives the oauth callback from external providers, checks oAuthState against
        session id stored as a cookie to protect against CSRF

        Args:
            request (Request)
            state (str): Storing oAuthState + originalPage
            code (str): Code that needs to be exchanged for access token by oAuth provider
            settings (AppSettings)
            google_auth (GoogleAuth)
            r_client (AsyncRedis)
            db (AsyncSession)

        Raises:
            Exception: TODO

        Returns:
            RedirectResponse: Redirects to either log the user in or to the registration
            page depending on if a user exists
        """
        session_id = request.cookies.get("session_id")
        if session_id is None:
            raise Exception("missing session_id")
        o_auth_state = ast.literal_eval(state)["oAuthState"]
        await AuthHelpers.verify_oauth_state(session_id, o_auth_state, r_client)

        credentials = await google_auth.exchange_code_for_token(code)
        user_info = await google_auth.request_google_user_info(credentials.token)
        new_user = google_auth.turn_google_oauth_info_into_object(user_info)
        user = await UserService.get_user_by_external_id(
            db, new_user.o_auth_id, new_user.auth_provider
        )

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

    @staticmethod
    async def register_user(
        data: SignUpRequest, settings: AppSettings, db: AsyncSession, r_client: AsyncRedis
    ) -> JSONResponse:
        """Receives the registration form data and creates a new user

        Args:
            data (SignUpRequest)
            settings (AppSettings)
            db (AsyncSession)
            r_client (AsyncRedis)

        Returns:
            JSONResponse: Returns a response with a redirectUrl and a user object with
            an attached cookie containing the access_token.
        """
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
        access_token = AuthHelpers.encode_jwt_data(TokenPayload(sub=str(new_user.id)))
        user_schema = UserService.turn_user_model_to_pydantic_schema(new_user)
        redirect_url = data.original_page
        if redirect_url == "/login":
            redirect_url = "/"
        if redirect_url is None:
            redirect_url = "/"
        user_dict = user_schema.model_dump(
            by_alias=True, exclude={"external_user_id", "auth_provider"}
        )

        response_content = {
            "redirectUrl": redirect_url,
            "user": user_dict,
        }
        response = JSONResponse(content=response_content)

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=settings.auth.http_only,
            max_age=settings.auth.cookie_max_age,
            samesite=settings.auth.same_site,
            secure=settings.app.environment == "production",
            domain=settings.auth.domain,
            path="/",
        )

        return response

    @staticmethod
    async def sign_in_w_google(
        google_auth: GoogleAuth,
        request: Request,
        r_client: AsyncRedis,
        settings: AppSettings,
    ):
        """Starts the oauth flow with google

        Args:
            google_auth (GoogleAuth)
            request (Request)
            r_client (AsyncRedis)
            settings (AppSettings)

        Returns:
            _type_: A redirect response with url containing all necessary query params
            and attached session id cookie
        """
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
