import logging
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from pathlib import Path

from alembic import context

# from logging.config import fileConfig
from app.core.dependencies.settings import get_settings
from app.models import Base
from sqlalchemy import engine_from_config, pool

ini_path = Path(context.config.config_file_name)

# project_root is its parent directory
project_root = ini_path.resolve().parent
sys.path.insert(0, project_root)

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
# Using pyproject.toml for configuration
# https://alembic.sqlalchemy.org/en/latest/tutorial.html#using-pep-621
config = context.config
settings = get_settings()
# Interpret the config file for Python logging.
# This line sets up loggers basically.
# if config.config_file_name is not None:
#     fileConfig(config.config_file_name)


logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)-5.5s [%(name)s] %(message)s",
)

config.set_main_option("sqlalchemy.url", settings.db.pg_db_uri)  # Or via env vars
# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = Base.metadata
print(f"TARGET_METADATA{target_metadata}")
print(">>> ENV: sys.path[0] =", sys.path[0])
print(">>> ENV: Base module:", Base.__module__)
print(">>> ENV: Base file:", Base.__dict__.get("__file__", "(built-in)"))
print(">>> ENV: tables keys:", list(Base.metadata.tables.keys()))
# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
