import redis.asyncio as RedisAsync
from app.dependencies import get_settings
from fastapi import Request
from redis import Redis

settings = get_settings()


async def setup_redis_client() -> Redis:
    return Redis(
        host=settings.redis.redis_host,
        port=int(settings.redis.redis_port),
        password=settings.redis.redis_password,
        decode_responses=True,
    )


async def setup_async_redis_client() -> RedisAsync.Redis:
    return RedisAsync.Redis(
        host=settings.redis.redis_host,
        port=int(settings.redis.redis_port),
        password=settings.redis.redis_password,
        decode_responses=True,
    )


def setup_redis_pool() -> RedisAsync.ConnectionPool:
    return RedisAsync.ConnectionPool(
        host=settings.redis.redis_host,
        port=settings.redis.redis_port,
        password=settings.redis.redis_password,
        max_connections=settings.redis.redis_max_connections,
        socket_connect_timeout=settings.redis.redis_socket_connection_timout,
        socket_timeout=settings.redis.redis_socket_timeout,
    )


def get_redis_pool(request: Request) -> RedisAsync.ConnectionPool:
    return request.app.state.redis_pool
