import logging
import time

from app.core.dependencies.settings import get_settings
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logger = logging.getLogger("App")
logger.propagate = False

settings = get_settings()
logger = logging.getLogger("App")

settings = get_settings()


class AuthCookieMiddleware(BaseHTTPMiddleware):
    """This middleware is used so we can clear auth cookies eaisly if there is an exception"""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        if response.status_code in [401, 403]:
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            response.delete_cookie("session_id")
            response.delete_cookie("provider_id")

        return response


class TimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = None
        if settings.app.debug:
            start_time = time.time()
            response = await call_next(request)
            process_time = time.time() - start_time
            logger.debug(
                f"Path: {request.url.path}, Method: {request.method}, Duration: {process_time:.4f} seconds",
            )
        else:
            response = await call_next(request)
        return response


def setup_middlewares(app):
    print("settings.cors.origins", settings.cors.origins)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors.origins,
        allow_credentials=settings.cors.allow_credentials,
        allow_methods=settings.cors.allow_methods,
        allow_headers=settings.cors.allow_headers,
    )
    app.add_middleware(AuthCookieMiddleware)
    if settings.app.debug:
        app.add_middleware(TimingMiddleware)
