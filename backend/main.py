## Using some of the best practices outlined here: https://github.com/zhanymkanov/fastapi-best-practices

import logging
import time

from pydantic import BaseModel

from app.core.setup.setup_app import create_app

logger = logging.getLogger("app")
logger.info("---------FastAPI application started--------")

app = create_app()


@app.get("/")
def read_root():
    return {"Hello": "World"}


class HealthResponse(BaseModel):
    status: str


@app.get("/health", response_model=HealthResponse)
def health_check():
    time.sleep(30)
    logger.info("health check")
    return {"status": "healthy"}
