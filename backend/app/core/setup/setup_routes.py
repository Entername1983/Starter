from app.core.api.user import router as user_router
from fastapi import FastAPI


def setup_routes(app: FastAPI) -> None:
    app.include_router(user_router)
