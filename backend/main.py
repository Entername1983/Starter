## Using some of the best practices outlined here: https://github.com/zhanymkanov/fastapi-best-practices

import logging

from app.core.setup.setup_app import create_app

logger = logging.getLogger("app")
logger.info("---------FastAPI application started--------")

app = create_app()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/health")
def health_check():
    logger.info("health check")
    return {"status": "healthy"}
