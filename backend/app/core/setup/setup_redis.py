import redis.asyncio as RedisAsync
from redis import Redis
from redis.connection import ConnectionPool

from app.dependencies import get_settings

settings = get_settings()


def setup_redis_client() -> Redis:
    return Redis(
        host=settings.redis.redis_host,
        port=int(settings.redis.redis_port),
        password=settings.redis.redis_password,
        decode_responses=True,
    )


def setup_redis_async_pool() -> RedisAsync.ConnectionPool:
    return RedisAsync.ConnectionPool(
        host=settings.redis.redis_host,
        port=settings.redis.redis_port,
        password=settings.redis.redis_password,
        max_connections=settings.redis.redis_max_connections,
        socket_connect_timeout=settings.redis.redis_socket_connection_timout,
        socket_timeout=settings.redis.redis_socket_timeout,
    )


def setup_redis_pool() -> ConnectionPool:
    return ConnectionPool(
        host=settings.redis.redis_host,
        port=settings.redis.redis_port,
        password=settings.redis.redis_password,
        max_connections=settings.redis.redis_max_connections,
        socket_connect_timeout=settings.redis.redis_socket_connection_timout,
        socket_timeout=settings.redis.redis_socket_timeout,
    )
