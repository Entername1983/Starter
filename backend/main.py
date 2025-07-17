from typing import Union

from app.core.logger.logger import logger
from fastapi import FastAPI

app = FastAPI()


logger.info("---------FastAPI application started--------")


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.get("/health")
def health_check():
    logger.info("health check")
    return {"status": "healthy"}
