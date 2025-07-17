from app.core.models.base import BaseModel
from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column


class User(BaseModel):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String, nullable=False)
    last_name: Mapped[str] = mapped_column(String, nullable=False)
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    external_id: Mapped[str] = mapped_column(String, unique=True, nullable=True)
    external_id_type: Mapped[str] = mapped_column(String, nullable=True)
    disabled: Mapped[bool] = mapped_column(Boolean, default=False)
