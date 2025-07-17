import logging
import logging.config
from pathlib import Path

import yaml

## Following patterns set out here: https://www.dash0.com/guides/logging-in-python
## log record attributes: https://docs.python.org/3/library/logging.html#logrecord-attributes
## TODO: Add queue for file handler for production
from app.core.dependencies.settings import get_settings

settings = get_settings()

CONFIG_TO_USE: str = (
    "config.dev.yml" if settings.app.environment == "development" else "config.prod.yml"
)
CURRENT_DIR = Path(__file__).resolve().parent
CONFIG_PATH = CURRENT_DIR / CONFIG_TO_USE


with open(CONFIG_PATH, "r") as f:
    config = yaml.safe_load(f.read())
    logging.config.dictConfig(config)


logger = logging.getLogger("app")
