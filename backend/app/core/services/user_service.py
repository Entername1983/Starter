from app.core.schemas import UserSchema
from app.core.schemas.enums import AuthProviderEnum
from app.models import User, UserSettings
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload


class UserService:
    @staticmethod
    def turn_user_model_to_pydantic_schema(user: User) -> UserSchema:
        if user.auth_provider not in [e.value for e in AuthProviderEnum]:
            raise ValueError(f"Invalid auth provider: {user.auth_provider}")
        auth_provider = AuthProviderEnum(user.auth_provider)
        return UserSchema(
            id=user.id,
            created_at=user.created_at,
            updated_at=user.updated_at,
            email=user.email,
            given_name=user.given_name,
            family_name=user.family_name,
            external_user_id=user.external_user_id,
            auth_provider=auth_provider,
            disabled=user.disabled,
            picture_url=user.picture_url,
            settings=None,
            username=user.username,
        )

    @staticmethod
    async def get_user_by_id(user_id: int, db: AsyncSession) -> User | None:
        result = await db.execute(select(User).filter_by(id=user_id))
        return result.scalars().first()

    @staticmethod
    async def get_user_by_external_id(
        db: AsyncSession, external_user_id: str, auth_provider: AuthProviderEnum
    ) -> User | None:
        print("external_user_id", external_user_id)
        print("auth_provider", auth_provider)
        result = await db.execute(
            select(User)
            .filter_by(external_user_id=external_user_id)
            .filter_by(auth_provider=str(auth_provider))
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
        username: str,
        auth_provider: str,
        given_name: str | None = None,
        family_name: str | None = None,
        external_id: str | None = None,
        password: str | None = None,
    ) -> User:
        new_user = User(
            email=email,
            given_name=given_name,
            family_name=family_name,
            username=username,
            auth_provider=auth_provider,
            external_user_id=external_id,
            password=password,
        )
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
