import logging

from app.core.dependencies.settings import get_settings
from sqlalchemy import create_engine, event
from sqlalchemy.engine.interfaces import DBAPIConnection
from sqlalchemy.ext.asyncio import (
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import ConnectionPoolEntry, PoolProxiedConnection

logger = logging.getLogger("app.db")
settings = get_settings()

echo_enabled = settings.app.environment == "development"


engine = create_async_engine(
    settings.db.async_pg_db_uri,
    **settings.db.engine_options,
    echo=echo_enabled,
)
async_session = async_sessionmaker(engine, expire_on_commit=settings.db.expire_on_commit)

sync_engine = create_engine(
    settings.db.pg_db_uri,
    **settings.db.engine_options,
)
session = sessionmaker(
    autocommit=settings.db.auto_commit,
    autoflush=settings.db.auto_flush,
    bind=sync_engine,
)


sync_engine = engine.sync_engine


@event.listens_for(sync_engine, "connect")
def receive_connect(dbapi_connection: DBAPIConnection, connection_record: ConnectionPoolEntry):
    connection_info = f"New connection {id(dbapi_connection)}"
    logger.debug(connection_info)


@event.listens_for(sync_engine, "checkout")
def receive_checkout(
    dbapi_connection: DBAPIConnection,
    connection_record: ConnectionPoolEntry,
    connection_proxy: PoolProxiedConnection,
):
    logger.debug("Checked in connection %s", id(dbapi_connection))


@event.listens_for(sync_engine, "checkin")
def receive_checkin(dbapi_connection: DBAPIConnection, connection_record: ConnectionPoolEntry):
    logger.debug("Checked in connection %s", id(dbapi_connection))


Base = declarative_base()
