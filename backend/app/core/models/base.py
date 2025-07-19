import datetime as dt

from app.core.setup.setup_db import Base
from sqlalchemy import DateTime, Integer
from sqlalchemy.orm import Mapped, mapped_column


class BaseModel(Base):
    __abstract__ = True

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    created_at: Mapped[dt.datetime] = mapped_column(
        DateTime, default=lambda: dt.datetime.now(), nullable=False
    )
    updated_at: Mapped[dt.datetime] = mapped_column(
        DateTime, default=lambda: dt.datetime.now(), nullable=False
    )
