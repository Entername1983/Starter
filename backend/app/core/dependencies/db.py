from typing import Annotated, AsyncGenerator, Generator

from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from sqlalchemy.orm import Session, sessionmaker


def get_async_sessionmaker(request: Request) -> async_sessionmaker[AsyncSession]:
    return request.app.state.async_session_maker


def get_sync_sessionmaker(request: Request) -> sessionmaker[Session]:
    return request.app.state.session_maker


async def get_db_async(
    maker: async_sessionmaker[AsyncSession] = Depends(get_async_sessionmaker),
) -> AsyncGenerator[AsyncSession, None]:
    async with maker() as async_session:
        yield async_session


def get_db(
    maker: sessionmaker[Session] = Depends(get_sync_sessionmaker),
) -> Generator[Session, None, None]:
    with maker() as session:
        yield session


GetDbAsync = Annotated[AsyncSession, Depends(get_db_async)]
GetDb = Annotated[Session, Depends(get_db)]
