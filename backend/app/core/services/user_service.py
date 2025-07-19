from app.models import User, UserSettings
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload


class UserService:
    @staticmethod
    async def get_user_by_id(user_id: int, db: AsyncSession) -> User | None:
        result = await db.execute(select(User).filter_by(id=user_id))
        return result.scalars().first()

    async def get_user_settings_by_user_id(self, user_id: int, db: AsyncSession):
        result = await db.execute(select(UserSettings).filter_by(user_id=user_id))
        return result.scalars().first()

    async def get_user_with_settings_by_id(self, user_id: int, db: AsyncSession) -> User | None:
        result = await db.execute(
            select(User).filter_by(id=user_id).options(selectinload(User.settings))
        )
        return result.scalars().first()
