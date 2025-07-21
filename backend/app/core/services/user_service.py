from app.core.auth.google_auth import AuthProvider
from app.models import User, UserSettings
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload


class UserService:
    @staticmethod
    async def get_user_by_id(user_id: int, db: AsyncSession) -> User | None:
        result = await db.execute(select(User).filter_by(id=user_id))
        return result.scalars().first()

    @staticmethod
    async def get_user_by_external_id(
        db: AsyncSession, external_user_id: int, auth_provider: AuthProvider
    ) -> User | None:
        result = await db.execute(
            select(User)
            .filter_by(external_user_id=external_user_id)
            .filter_by(auth_provider=auth_provider)
        )
        return result.scalars().first()

    @staticmethod
    async def get_user_settings_by_user_id(user_id: int, db: AsyncSession) -> UserSettings | None:
        result = await db.execute(select(UserSettings).filter_by(user_id=user_id))
        return result.scalars().first()

    @staticmethod
    async def get_user_with_settings_by_id(user_id: int, db: AsyncSession) -> User | None:
        result = await db.execute(
            select(User).filter_by(id=user_id).options(selectinload(User.settings))
        )
        return result.scalars().first()

    @staticmethod
    async def create_user(
        db: AsyncSession,
        email: str,
        first_name: str,
        last_name: str,
        username: str,
    ) -> User:
        new_user = User(email=email, first_name=first_name, last_name=last_name, username=username)
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return new_user

    @staticmethod
    async def update_user(user: User, db: AsyncSession) -> User:
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user
