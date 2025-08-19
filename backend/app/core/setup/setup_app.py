from contextlib import asynccontextmanager
from typing import Any, AsyncGenerator, Dict

from app.core.auth.google import GoogleAuth
from app.core.dependencies.settings import get_settings
from app.core.logger.logger import logger
from app.core.setup.ascii_art import BY_KEM, PLANET
from app.core.setup.setup_db import Base, setup_async_sessionmaker, setup_sessionmaker
from app.core.setup.setup_middleware import setup_middlewares
from app.core.setup.setup_redis import (
    setup_redis_async_pool,
    setup_redis_pool,
)
from app.core.setup.setup_routes import setup_routes
from fastapi import FastAPI
from fastapi.routing import APIRoute
from redis.asyncio import Redis as AsyncRedis
from sqlalchemy import text

settings = get_settings()


def custom_generate_unique_id(route: APIRoute) -> str:
    """USE for SDK generation"""
    return f"{route.name}"


async def verify_db_connection(db):
    try:
        async with db.connect() as conn:
            result = await conn.execute(
                text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE table_name = 'alembic_version'
                );
            """)
            )
            table_exists = result.scalar()
        if not table_exists:
            logger.info("TABLES DO NOT EXIST")
            await conn.run_sync(Base.metadata.create_all)
        else:
            logger.info("CONFIRM TABLES EXIST YAY")
    except Exception as e:
        raise ConnectionError(e)


async def verify_redis_connection(redis_pool):
    try:
        client = AsyncRedis(connection_pool=redis_pool, decode_responses=True)
        await client.ping()
    except Exception as e:
        raise ConnectionError(e)


## TODO: Add posthog
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[Any, Any]:
    logger.info("Starting application lifespan")
    if settings.app.environment == "development":
        # pprint.pprint(settings.model_dump())
        # print(WARNING_BANNER)
        logger.info(settings.model_dump())
    app.state.db_async_engine, app.state.async_session_maker = setup_async_sessionmaker()
    await verify_db_connection(app.state.db_async_engine)

    app.state.db_engine, app.state.session_maker = setup_sessionmaker()
    app.state.google_auth = GoogleAuth()
    app.state.redis_async_pool = setup_redis_async_pool()
    app.state.redis_pool = setup_redis_pool()
    await verify_redis_connection(app.state.redis_async_pool)
    # app.state.posthog = setup_post_hog()
    print(PLANET)
    print(BY_KEM)

    logger.info("STARTING APP...")
    # setup_payment_logger()

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
    setup_middlewares(app)
    setup_routes(app)
    return app
