from app.core.logger.logger import logger
from fastapi import FastAPI

app = FastAPI(swagger_ui_parameters={"syntaxHighlight": {"theme": "obsidian"}})


logger.info("---------FastAPI application started--------")


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/health")
def health_check():
    logger.info("health check")
    return {"status": "healthy"}
