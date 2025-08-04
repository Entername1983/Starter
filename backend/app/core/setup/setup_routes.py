from app.core.api.user import router as user_router
from app.core.api.utils import router as util_router
from fastapi import FastAPI


def setup_routes(app: FastAPI) -> None:
    app.include_router(user_router)
    app.include_router(util_router)
