## Using some of the best practices outlined here: https://github.com/zhanymkanov/fastapi-best-practices

import logging

from app.core.setup.setup_app import create_app

logger = logging.getLogger("app")
logger.info("---------FastAPI application started--------")

app = create_app()


@app.get("/")
def read_root():
    return {"Hello": "World"}
