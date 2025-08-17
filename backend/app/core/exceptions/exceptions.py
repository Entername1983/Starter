from http.client import HTTPException


class HTTPExceptionWithCookies(HTTPException):
    def __init__(self, status_code: int, detail: str, cookies_to_delete: list = []):
        super().__init__(status_code, detail)
        self.cookies_to_delete = cookies_to_delete or []
