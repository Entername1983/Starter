from app.core.logger.logger import logger
from app.core.setup.setup_app import create_app

logger.info("---------FastAPI application started--------")

app = create_app()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/health")
def health_check():
    logger.info("health check")
    return {"status": "healthy"}
