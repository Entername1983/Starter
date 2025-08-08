import ast
from http.client import HTTPException
from typing import Any

from app.core.auth.auth_helpers import AuthHelpers, TokenPayload
from app.core.auth.google import GoogleAuth, OAuthUserInfoSchema
from app.core.dependencies.auth import GetGoogleAuth
from app.core.dependencies.redis import AsyncRedis
from app.core.dependencies.settings import AppSettings
from app.core.schemas import RegisterRedirectUrl, UserSchema
from app.core.schemas.requests import SignUpRequest
from app.core.services.user_service import UserService
from app.models import User
from fastapi import Request
from fastapi.responses import JSONResponse, RedirectResponse
from google.oauth2.credentials import Credentials
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
    ) -> JSONResponse | RedirectResponse:
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
            raise HTTPException("missing session_id")
        await AuthHelpers.verify_oauth_state(
            session_id, ast.literal_eval(state)["oAuthState"], r_client
        )

        credentials = await google_auth.exchange_code_for_token(code)
        user_info = await google_auth.request_google_user_info(credentials.token)
        new_user = google_auth.turn_google_oauth_info_into_object(user_info)
        user = await UserService.get_user_by_external_id(
            db, new_user.o_auth_id, new_user.auth_provider
        )

        if user:
            return AuthService.login_redirect_response(
                user=UserService.turn_user_model_to_pydantic_schema(user),
                credentials=credentials,
                user_settings={"None": "None"},
                state=state,
                google_auth=google_auth,
                app_settings=settings,
            )

        return await AuthService.registration_redirect_response(
            new_user=new_user,
            credentials=credentials,
            user_settings={"None": "None"},
            state=state,
            google_auth=google_auth,
            app_settings=settings,
            r_client=r_client,
        )

    @staticmethod
    async def register_user(
        data: SignUpRequest,
        settings: AppSettings,
        db: AsyncSession,
        r_client: AsyncRedis,
        request: Request,
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
        session_id = request.cookies.get("provider_id")
        if session_id is None:
            raise HTTPException("No provider id")
        await AuthHelpers.verify_oauth_state(
            session_id, f"{data.auth_provider}-{data.o_auth_id}", r_client
        )
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

    @staticmethod
    async def registration_redirect_response(
        new_user: OAuthUserInfoSchema,
        credentials: Credentials,
        user_settings: dict[str, Any],
        state: str,
        google_auth: GetGoogleAuth,
        app_settings: AppSettings,
        r_client: AsyncRedis,
    ) -> RedirectResponse:
        data = new_user.model_dump(by_alias=True)
        print("data", data)
        original_page = ast.literal_eval(state)["originalPage"]
        ## Creat
        session_id = AuthHelpers.create_session_id()
        await r_client.set(
            f"oauth:state:{new_user.auth_provider}-{new_user.o_auth_id}", session_id, ex=600
        )

        data["accessToken"] = credentials.token
        data["originalPage"] = original_page
        data["settings"] = {"settings": "empty"}
        redirect_url_object = RegisterRedirectUrl.model_validate(data, by_alias=True)
        redirect_str = google_auth.construct_redirect_url(
            redirect_url_object, app_settings.app.frontend_url, "register"
        )
        response = RedirectResponse(url=redirect_str)
        response.set_cookie(
            key="provider_id",
            value=session_id,
            httponly=app_settings.auth.http_only,
            max_age=app_settings.auth.cookie_max_age,
            samesite=app_settings.auth.same_site,
            secure=True,
            domain=app_settings.auth.domain,
            path="/",
        )
        return response

    @staticmethod
    def login_redirect_response(
        user: UserSchema,
        credentials: Credentials,
        user_settings: dict[str, Any],
        state: str,
        google_auth: GetGoogleAuth,
        app_settings: AppSettings,
    ) -> RedirectResponse:
        # data["access_token"] = credentials.token
        # data["original_page"] = state
        # data["settings"] = {"settings": "empty"}
        user_dict = user.model_dump(by_alias=True, exclude={"external_user_id", "auth_provider"})
        original_page = ast.literal_eval(state)["originalPage"]
        response_content = {
            "redirectUrl": original_page,
            "user": user_dict,
        }
        response = JSONResponse(content=response_content)
        access_token = AuthHelpers.encode_jwt_data(TokenPayload(sub=str(user.id)))
        redirect_str = f"{app_settings.app.frontend_url}{original_page}"
        response = RedirectResponse(url=redirect_str)
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=app_settings.auth.http_only,
            max_age=app_settings.auth.cookie_max_age,
            samesite=app_settings.auth.same_site,
            secure=True,
            domain=app_settings.auth.domain,
            path="/",
        )
        return response
