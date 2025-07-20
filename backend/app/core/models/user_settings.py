from typing import TYPE_CHECKING

from app.core.models.base import BaseModel
from sqlalchemy import Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.schema import UniqueConstraint

if TYPE_CHECKING:
    from app.core.models.user import User


class UserSettings(BaseModel):
    __tablename__ = "user_settings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    user: Mapped["User"] = relationship(
        back_populates="settings", uselist=False, cascade="all, delete-orphan"
    )
    notifications_enabled: Mapped[bool] = mapped_column(Boolean, default=True)

    __table_args__ = (UniqueConstraint("user_id"),)
