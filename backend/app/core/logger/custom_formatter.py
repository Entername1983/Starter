import sys
import traceback
from logging import LogRecord
from typing import Any

from pythonjsonlogger import jsonlogger
from uvicorn.logging import DefaultFormatter

## Based on a formatter from https://www.dash0.com/guides/logging-in-python


class StructuredExceptionJsonFormatterWithColors(jsonlogger.JsonFormatter):
    def __init__(self, *args: Any, use_colors: bool = False, **kwargs: Any):
        """
        :param use_colors: if True, fill in `color_message` so downstream tools
                           can choose to render ANSI escapes.
        """
        super().__init__(*args, **kwargs)  # type: ignore
        self.use_colors = use_colors
        self._color_fmt = DefaultFormatter(fmt="%(levelprefix)s%(message)s", use_colors=use_colors)

    def add_fields(self, log_record, record, message_dict):  # type: ignore
        super().add_fields(log_record, record, message_dict)

        if record.exc_info:
            exc_type, exc_value, exc_tb = record.exc_info
            log_record["exception"] = {
                "exc_type": exc_type.__name__ if exc_type is not None else "No exc_type provided",
                "exc_value": str(exc_value),
                "traceback": traceback.format_exception(exc_type, exc_value, exc_tb),
            }
            log_record.pop("exc_info", None)
            log_record.pop("exc_text", None)

        if self.use_colors:
            log_record["color_message"] = self._color_fmt.format(record)

    def format(self, record: LogRecord):
        # first let the JSON formatter build the dict (and include extras)
        output = super().format(record)

        # then, if we want colors, just tack on one more field
        if self.use_colors and sys.stdout.isatty():
            color_msg = self._color_fmt.format(record)
            # here you could return json.dumps({ **json.loads(output), "color_message": color_msg })
            # or simply prepend/append it however you like
            return f"{color_msg}\n{output}"

        return output


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
