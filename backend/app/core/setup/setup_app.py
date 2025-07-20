import pprint
from contextlib import asynccontextmanager
from typing import Any, AsyncGenerator, Dict

from app.core.dependencies.settings import get_settings
from app.core.logger.logger import logger
from app.core.setup.ascii_art import BY_KEM, PLANET, WARNING_BANNER
from app.core.setup.setup_db import setup_async_sessionmaker, setup_sessionmaker
from app.core.setup.setup_redis import (
    setup_redis_async_pool,
    setup_redis_pool,
)
from app.core.setup.setup_routes import setup_routes
from fastapi import FastAPI
from fastapi.routing import APIRoute

settings = get_settings()


def custom_generate_unique_id(route: APIRoute) -> str:
    """USE for SDK generation"""
    return f"{route.name}"


## TODO: Add posthog
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[Any, Any]:
    logger.info("Starting application lifespan")

    app.state.db_async_engine, app.state.async_session_maker = setup_async_sessionmaker()
    app.state.db_engine, app.state.session_maker = setup_sessionmaker()

    app.state.redis_async_pool = setup_redis_async_pool()
    app.state.redis_pool = setup_redis_pool()
    # app.state.posthog = setup_post_hog()
    yield

    app.state.db_engine.dispose()
    await app.state.db_async_engine.dispose()
    await app.state.redis_async_pool.disconnect()
    app.state.redis_pool.close()


def create_app() -> FastAPI:  # noqa: C901
    app_config: Dict[str, Any] = {
        "generate_unique_id_function": custom_generate_unique_id,
        "lifespan": lifespan,
        "debug": settings.app.debug,
        "title": settings.app.name,
        "description": settings.app.description,
        "version": settings.app.version,
    }
    if settings.app.environment != "development":
        app_config["openapi_url"] = app_config["docs_url"] = app_config["redoc_url"] = None

    app = FastAPI(**app_config)
    print(PLANET)
    print(BY_KEM)

    logger.info("STARTING APP...")
    # setup_payment_logger()
    # setup_middleware(app)
    setup_routes(app)
    if settings.app.environment == "development":
        pprint.pprint(settings.model_dump())
        print(WARNING_BANNER)
    return app
