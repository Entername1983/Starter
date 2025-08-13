from typing import TYPE_CHECKING

from app.core.models.base import BaseModel
from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from app.core.models.user_settings import UserSettings


class User(BaseModel):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    given_name: Mapped[str] = mapped_column(String, nullable=True)
    family_name: Mapped[str] = mapped_column(String, nullable=True)
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    external_user_id: Mapped[str] = mapped_column(String, unique=True, nullable=True)
    auth_provider: Mapped[str] = mapped_column(String, nullable=True)
    disabled: Mapped[bool] = mapped_column(Boolean, default=False)
    settings: Mapped["UserSettings"] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    picture_url: Mapped[str] = mapped_column(String, nullable=True)
    password: Mapped[str] = mapped_column(String, nullable=True)
    email_confirmed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
