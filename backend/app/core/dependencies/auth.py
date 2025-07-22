from functools import lru_cache
from typing import Annotated

from fastapi import Depends, Request

from app.core.auth.google import GoogleAuth


@lru_cache
def get_google_auth(request: Request) -> GoogleAuth:
    return request.app.state.google_auth


GetGoogleAuth = Annotated[GoogleAuth, Depends(get_google_auth)]
