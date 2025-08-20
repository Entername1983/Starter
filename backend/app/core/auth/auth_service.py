import ast
import logging
from typing import Any

from app.core.auth.auth_helpers import AuthHelpers, TokenPayload
from app.core.auth.google import GoogleAuth, OAuthUserInfoSchema
from app.core.dependencies.auth import GetGoogleAuth
from app.core.dependencies.email import GetEmailService
from app.core.dependencies.redis import AsyncRedis
from app.core.dependencies.settings import AppSettings
from app.core.email.email_service import EmailService
from app.core.schemas import RegisterRedirectUrl, UserSchema
from app.core.schemas.requests import ConfirmEmailRequest, SignUpRequest
from app.core.schemas.responses import ConfirmEmailResponse
from app.core.services.user_service import UserService
from app.models import User
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse, RedirectResponse
from google.oauth2.credentials import Credentials
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger("app")


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
            raise HTTPException(status_code=401, detail="No session id")
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
        email_service: GetEmailService,
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
        redirect_url = await AuthService.return_redirect_url(data.original_page)

        async with db.begin():
            password = None
            try:
                if data.auth_provider == "internal":
                    if data.password is None:
                        raise Exception("No password provided")
                    password = AuthHelpers.hash_password(data.password)
                else:
                    session_id = request.cookies.get("provider_id")
                    if session_id is None:
                        raise HTTPException(status_code=401, detail="No provider id")
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
                    password,
                    commit=False,
                )
                db.add(new_user)
                await db.flush()
                access_token = AuthHelpers.encode_jwt_data(TokenPayload(sub=str(new_user.id)))
                user_schema = UserService.turn_user_model_to_pydantic_schema(new_user)
                user_dict = user_schema.model_dump(
                    by_alias=True, exclude={"external_user_id", "auth_provider"}
                )

                response = JSONResponse(
                    content={
                        "redirectUrl": redirect_url,
                        "user": user_dict,
                    }
                )
                email_service.send_welcome_email(user_schema.email, user_schema.username)
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
            except Exception:
                logger.exception
                await db.rollback()
                error_response = JSONResponse(
                    status_code=500, content={"detail": "Registration failed"}
                )
                error_response.delete_cookie("provider_id", path="/")
                error_response.delete_cookie("session_id", path="/")
                error_response.delete_cookie("access_token", path="/")
                return error_response

    @staticmethod
    async def return_redirect_url(redirect_url: str | None) -> str:
        if (redirect_url == "/login") or (redirect_url == "/register") or (redirect_url is None):
            redirect_url = "/"
        return redirect_url

    @staticmethod
    async def register_internal_user(
        data: SignUpRequest,
        settings: AppSettings,
        db: AsyncSession,
        r_client: AsyncRedis,
        request: Request,
        email_service: EmailService,
    ) -> JSONResponse:
        if data.password is None:
            raise Exception("No password provided")
        new_user: User = await UserService.create_user(
            db,
            data.email,
            data.username,
            data.auth_provider,
            data.given_name,
            data.family_name,
            data.o_auth_id,
            AuthHelpers.hash_password(data.password),
        )
        redirect_url = data.original_page

        if (redirect_url == "/login") or (redirect_url == "/register"):
            redirect_url = "/"
        if redirect_url is None:
            redirect_url = "/"
        user_schema = UserService.turn_user_model_to_pydantic_schema(new_user)

        user_dict = user_schema.model_dump(
            by_alias=True, exclude={"external_user_id", "auth_provider"}
        )

        response_content = {
            "redirectUrl": redirect_url,
            "user": user_dict,
        }
        response = JSONResponse(content=response_content)
        access_token = AuthHelpers.encode_jwt_data(TokenPayload(sub=str(new_user.id)))

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

        email_token = AuthHelpers.generate_secret_token(32)
        await r_client.set(new_user.email, f"email:confirmation:{email_token}")
        email_service.send_confirmation_email(
            new_user.email, new_user.username, email_token, settings.app.frontend_url
        )

        return response

    @staticmethod
    async def confirm_email(
        request: ConfirmEmailRequest,
        r_client: AsyncRedis,
        settings: AppSettings,
        db: AsyncSession,
        email_service: EmailService,
    ) -> ConfirmEmailResponse:
        stored_token = await r_client.get(request.email)
        if stored_token != request.token:
            raise HTTPException(status_code=401, detail="Access denied")
        await UserService.mark_email_confirmed(request.email, db)
        ## TODO: Send confirmation email has been confirmed
        response = ConfirmEmailResponse(confirmed=True)
        return response

    @staticmethod
    async def sign_in(
        request, r_client: AsyncRedis, app_settings: AppSettings, db
    ) -> RedirectResponse:
        ## Check if password is correct
        username = request.username
        if username is None:
            raise HTTPException(status_code=401, detail="Username not found")
        user = await UserService.get_user_by_username(username, db)
        if user is None:
            raise HTTPException(status_code=401, detail="Username not found")
        if not AuthHelpers.verify_password(request.password, user.password):
            raise HTTPException(status_code=401, detail="Password does not match")

        access_token = AuthHelpers.encode_jwt_data(TokenPayload(sub=str(user.id)))

        redirect_url = request.originalPage if request.originalPage is not None else "/"
        response = RedirectResponse(url=redirect_url)
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
        session_id = AuthHelpers.generate_secret_token()
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
        original_page = ast.literal_eval(state)["originalPage"]
        ## Creat
        session_id = AuthHelpers.generate_secret_token()
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
            max_age=600,
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
        original_page = ast.literal_eval(state)["originalPage"]

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
