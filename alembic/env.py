from __future__ import annotations

from logging.config import fileConfig
from alembic import context
from sqlalchemy import engine_from_config, pool

from core.config import settings
from db.base import Base
import models.user

# Alembic Config object (читает alembic.ini)
config = context.config

# Настройка логирования alembic
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ВАЖНО: это metadata твоих моделей.
# Когда ты добавишь модели (шаг 9), Alembic начнёт их видеть.
target_metadata = Base.metadata


def get_sync_url() -> str:
    """
    В приложении ты используешь async:
      postgresql+asyncpg://...
    Но Alembic проще и стабильнее запускать синхронно:
      postgresql+psycopg://...
    """
    return str(settings.DATABASE_URL).replace(
        "postgresql+asyncpg://", "postgresql+psycopg://"
    )


def run_migrations_offline() -> None:
    """Миграции в offline режиме (без реального подключения)."""
    url = get_sync_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,  # чтобы изменения типов колонок тоже отслеживались
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Миграции в online режиме (с подключением к БД)."""
    configuration = config.get_section(config.config_ini_section) or {}
    configuration["sqlalchemy.url"] = get_sync_url()

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        future=True,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()