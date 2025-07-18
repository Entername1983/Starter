import logging
import pprint
from contextlib import asynccontextmanager
from typing import Any, AsyncGenerator, Dict

from app.core.dependencies.settings import get_settings
from app.core.setup.ascii_art import BY_KEM, PLANET, WARNING_BANNER
from fastapi import FastAPI
from fastapi.routing import APIRoute

settings = get_settings()

logger = logging.getLogger("app")


def setup_routes(app: FastAPI) -> None:
    """Setup all API routes from routers."""


def custom_generate_unique_id(route: APIRoute) -> str:
    """USE for SDK generation"""
    return f"{route.name}"


## TODO: Add types + redis client + posthog + redis pool
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    logger.info("Starting application lifespan")
    # app.state.redis_client = await setup_redis_client()
    # app.state.sync_redis_client = setup_sync_redis_client()
    # app.state.posthog = setup_post_hog()
    yield
    # await app.state.redis_client.close()
    # app.state.sync_redis_client.close()

    # app.state.redis_pool = setup_redis_pool()
    # print("Redis pool created")
    # yield
    # await app.state.redis_pool.aclose()


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
    # logger.info(settings.model_dump_json(indent=2))
    if settings.app.environment == "development":
        pprint.pprint(settings.model_dump())
        print(WARNING_BANNER)
    return app
