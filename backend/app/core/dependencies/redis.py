import logging
from typing import Annotated, AsyncGenerator, Generator

import redis.asyncio as RedisAsync
from fastapi import Depends, Request
from redis import Redis
from redis.asyncio import ConnectionPool as AsyncConnectionPool
from redis.asyncio import Redis as ARedis
from redis.asyncio import Redis as AsyncRedis
from redis.connection import ConnectionPool

from app.dependencies import get_settings

settings = get_settings()


logger = logging.getLogger("app")


def get_redis_async_pool(request: Request) -> RedisAsync.ConnectionPool:
    return request.app.state.redis_async_pool


def get_redis_pool(request: Request) -> ConnectionPool:
    return request.app.state.redis_pool


def get_redis_client(
    pool: ConnectionPool = Depends(get_redis_pool),
) -> Generator[Redis, None, None]:
    client = Redis(connection_pool=pool, decode_responses=True)
    try:
        yield client
    finally:
        client.close()


async def get_async_redis_client(
    pool: AsyncConnectionPool = Depends(get_redis_async_pool),
) -> AsyncGenerator[AsyncRedis, None]:
    client = AsyncRedis(connection_pool=pool, decode_responses=True)
    try:
        yield client
    finally:
        await client.aclose()


RedisDep = Annotated[Redis, Depends(get_redis_client)]
RedisAsyncDep = Annotated[ARedis, Depends(get_async_redis_client)]
