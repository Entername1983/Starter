from typing import Tuple

from app.core.dependencies.settings import get_settings
from sqlalchemy import MetaData, create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import Session, declarative_base, sessionmaker

POSTGRES_INDEXES_NAMING_CONVENTION = {
    "ix": "%(column_0_label)s_idx",
    "uq": "%(table_name)s_%(column_0_name)s_key",
    "ck": "%(table_name)s_%(constraint_name)s_check",
    "fk": "%(table_name)s_%(column_0_name)s_fkey",
    "pk": "%(table_name)s_pkey",
}
metadata = MetaData(naming_convention=POSTGRES_INDEXES_NAMING_CONVENTION)


Base = declarative_base(metadata=metadata)

settings = get_settings()


def setup_async_sessionmaker() -> tuple[AsyncEngine, async_sessionmaker[AsyncSession]]:
    async_engine = create_async_engine(
        settings.db.async_pg_db_uri, **settings.db.engine_options, echo=settings.db.echo_enabled
    )
    return async_engine, async_sessionmaker(
        async_engine, expire_on_commit=settings.db.expire_on_commit
    )


def setup_sessionmaker() -> Tuple[Engine, sessionmaker[Session]]:
    engine = create_engine(
        settings.db.pg_db_uri,
        **settings.db.engine_options,
    )
    return engine, sessionmaker(
        autocommit=settings.db.auto_commit,
        autoflush=settings.db.auto_flush,
        bind=engine,
    )


# @event.listens_for(sync_engine, "connect")
# def receive_connect(dbapi_connection: DBAPIConnection, connection_record: ConnectionPoolEntry):
#     connection_info = f"New connection {id(dbapi_connection)}"
#     logger.debug(connection_info)


# @event.listens_for(sync_engine, "checkout")
# def receive_checkout(
#     dbapi_connection: DBAPIConnection,
#     connection_record: ConnectionPoolEntry,
#     connection_proxy: PoolProxiedConnection,
# ):
#     logger.debug("Checked in connection %s", id(dbapi_connection))


# @event.listens_for(sync_engine, "checkin")
# def receive_checkin(dbapi_connection: DBAPIConnection, connection_record: ConnectionPoolEntry):
#     logger.debug("Checked in connection %s", id(dbapi_connection))
