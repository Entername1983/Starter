from app.core.dependencies.db import GetDbAsync
from app.core.dependencies.redis import GetRedisAsync
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import text

router = APIRouter(
    prefix="/utils",
    tags=["utils"],
)


class HealthResponse(BaseModel):
    status: str


##TODO: Need better exceptions here
@router.get("/health", response_model=HealthResponse)
async def health_check(db: GetDbAsync, r_client: GetRedisAsync):
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Did not connect to db: {e!s}")
    try:
        pong = await r_client.ping()
        if not pong:
            raise RuntimeError("redis did not pong")
    except Exception:
        raise ConnectionError("redis did not pong")

    return {"status": "healthy"}
