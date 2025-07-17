import logging
import logging.config
from pathlib import Path

import yaml

## Following patterns set out here: https://www.dash0.com/guides/logging-in-python
## log record attributes: https://docs.python.org/3/library/logging.html#logrecord-attributes
## TODO: Add queue for file handler for production
from app.core.config.config import settings

CONFIG_TO_USE: str = (
    "config.dev.yml" if settings.app.environment == "development" else "config.prod.yml"
)
CURRENT_DIR = Path(__file__).resolve().parent
CONFIG_PATH = CURRENT_DIR / CONFIG_TO_USE


with open(CONFIG_PATH, "r") as f:
    config = yaml.safe_load(f.read())
    logging.config.dictConfig(config)


logger = logging.getLogger("app")
auth_logger = logging.getLogger("app.auth")

logger.warning("This is a warning.", extra={"user_id": "usr-1234"})
try:
    1 / 0
except ZeroDivisionError as e:
    logger.exception(msg="ho", exc_info=e)
logger.exception("HA")
