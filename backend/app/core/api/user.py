from app.dependencies import CurrentUser, GetDbAsync
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/user",
    tags=["user"],
)


class BaseSchema(BaseModel):
    id: int
    created_at: str
    updated_at: str


class UserSchema(BaseSchema):
    email: str
    first_name: str
    last_name: str
    username: str
    external_id: str | None
    external_id_type: str | None
    disabled: bool


class UserDataResponse(BaseModel):
    status: str
    loggedIn: bool
    user: UserSchema
    message: str | None


@router.get("/auth/status/", response_model=UserDataResponse, tags=["user"])
async def check_user_status(user: CurrentUser, db: GetDbAsync):
    return UserDataResponse(
        status="success", loggedIn=True, user=UserSchema(**user.dict()), message=None
    )
