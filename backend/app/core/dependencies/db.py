from typing import Annotated, AsyncGenerator, Generator

from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from sqlalchemy.orm import Session, sessionmaker


def get_async_sessionmaker(request: Request) -> async_sessionmaker[AsyncSession]:
    return request.app.state.async_session_maker


def get_sync_sessionmaker(request: Request) -> sessionmaker[Session]:
    return request.app.state.session_maker


# def get_async_engine(request: Request) -> AsyncEngine:
#     return request.app.state.async_engine


# def get_engine(request: Request) -> Engine:
#     return request.app.state.sync_engine


async def get_db_async(
    maker: async_sessionmaker[AsyncSession] = Depends(get_async_sessionmaker),
) -> AsyncGenerator[AsyncSession, None]:
    async with maker() as session:
        yield session


def get_db(
    maker: sessionmaker[Session] = Depends(get_sync_sessionmaker),
) -> Generator[Session, None, None]:
    db = maker()
    try:
        yield db
    finally:
        db.close()


GetDbAsync = Annotated[AsyncSession, Depends(get_db_async)]
GetDb = Annotated[Session, Depends(get_db)]
