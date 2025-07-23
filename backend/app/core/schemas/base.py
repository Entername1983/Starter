import datetime as dt

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class BaseConfig(BaseModel):
    """Using this directly for pydantic classes that dont map to an SQLAlchemy model"""

    model_config = ConfigDict(
        populate_by_name=True,
        alias_generator=to_camel,
        from_attributes=True,
        arbitrary_types_allowed=True,
    )


class BaseSchema(BaseConfig):
    """Use this for pydantic classes that map to an SQLAlchemy model which have id, created_at, updated_at"""

    id: int | None
    created_at: dt.datetime | str
    updated_at: dt.datetime | str
