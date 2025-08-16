from app.core.schemas import UserSchema
from app.core.schemas.base import BaseConfig


class RegistrationResponse(BaseConfig):
    redirect_url: str = "/"
    user: UserSchema


class ConfirmEmailResponse(BaseConfig):
    confirmed: bool
