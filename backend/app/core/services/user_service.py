from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.app.models import User


class UserService:
    @staticmethod
    async def get_user_by_id(user_id: int, db: AsyncSession) -> User | None:
        result = await db.execute(select(User).filter_by(id=user_id))
        return result.scalars().first()
