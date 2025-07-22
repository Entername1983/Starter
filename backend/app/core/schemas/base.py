import datetime as dt

from pydantic.main import BaseModel


class BaseSchema(BaseModel):
    id: int | None
    created_at: dt.datetime | str
    updated_at: dt.datetime | str
