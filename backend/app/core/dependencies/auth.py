from functools import lru_cache
from typing import Annotated

from app.core.auth.google_auth import GoogleAuth
from fastapi import Depends, Request


@lru_cache
def get_google_auth(request: Request) -> GoogleAuth:
    return request.app.state.google_auth


GetGoogleAuth = Annotated[GoogleAuth, Depends(get_google_auth)]
