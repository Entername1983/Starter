from app.core.dependencies.db import GetDbAsync
from app.core.dependencies.redis import RedisAsyncDep
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import text

router = APIRouter(
    prefix="/utils",
    tags=["utils"],
)


class HealthResponse(BaseModel):
    status: str


@router.get("/health", response_model=HealthResponse)
async def health_check(db: GetDbAsync, r_client: RedisAsyncDep):
    try:
        await db.execute(text("SELECT 1"))
        pong = await r_client.ping()
        if not pong:
            raise RuntimeError("redis did not pong")
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"unhealthy: {e!s}")
    return {"status": "healthy"}
