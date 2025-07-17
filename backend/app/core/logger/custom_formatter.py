import traceback
from logging import LogRecord
from typing import Any

from pythonjsonlogger import jsonlogger

## Based on a formatter from https://www.dash0.com/guides/logging-in-python


class StructuredExceptionJsonFormatter(jsonlogger.JsonFormatter):
    def add_fields(
        self, log_record: dict[str, Any], record: LogRecord, message_dict: dict[str, Any]
    ):
        log_record["level"] = record.levelname
        log_record["time"] = self.formatTime(record, self.datefmt)
        log_record["name"] = record.name
        super().add_fields(log_record, record, message_dict)

        if record.exc_info:
            exc_type, exc_value, exc_traceback = record.exc_info
            log_record["exception"] = {
                "exc_type": exc_type.__name__ if exc_type is not None else "None",
                "exc_value": str(exc_value),
                "traceback": traceback.format_exception(exc_type, exc_value, exc_traceback),
            }

            log_record.pop("exc_info", None)
            log_record.pop("exc_text", None)
