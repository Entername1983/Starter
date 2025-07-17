from typing import Annotated, AsyncGenerator, Generator

from app.core.setup.setup_db import async_session, session
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session


async def get_db_async() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as a_session:
        try:
            yield a_session
        finally:
            await a_session.close()


def get_db() -> Generator[Session, None, None]:
    db = session()
    try:
        yield db
    finally:
        db.close()


GetDb = Annotated[AsyncSession, Depends(get_db_async)]
GetSyncDb = Annotated[Session, Depends(get_db)]
