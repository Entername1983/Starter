import json
from pathlib import Path

import google_auth_oauthlib.flow
from pydantic import BaseModel

# Required, call the from_client_secrets_file method to retrieve the client ID from a
# client_secret.json file. The client ID (from that file) and access scopes are required. (You can
# also use the from_client_config method, which passes the client configuration as it originally
# appeared in a client secrets file but doesn't access the file itself.)
CURRENT_DIR = Path(__file__).resolve().parent.parent.parent.parent

print(CURRENT_DIR)
FILENAME = "google_auth_secret_file.json"
GOOGLE_SECRET_FILE = CURRENT_DIR / "secrets" / FILENAME


class GoogleAuthClientConfig(BaseModel):
    client_id: str
    project_id: str
    auth_provider_x509_cert_url: str
    client_secret: str
    redirect_uris: list[str]
    auth_uri: str
    token_uri: str
    javascript_origins: list[str]


class GoogleAuthWebClientConfig(BaseModel):
    web: GoogleAuthClientConfig


GOOGLE_AUTH_SCOPES = [
    "https://www.googleapis.com/auth/drive.metadata.readonly",
    "https://www.googleapis.com/auth/calendar.readonly",
]


## TODO: consolidate where config + secrets are loaded from
def get_google_auth_url() -> str:
    ## Scopes listed here: https://developers.google.com/identity/protocols/oauth2/scopes
    with open(GOOGLE_SECRET_FILE, "r") as f:
        config = json.loads(f.read())
        GoogleAuthWebClientConfig.model_validate(config)
    flow = google_auth_oauthlib.flow.Flow.from_client_config(  # type: ignore
        config,
        scopes=GOOGLE_AUTH_SCOPES,
    )
    flow.redirect_uri = "http://localhost:8000/auth/callback"

    auth_url, _ = flow.authorization_url(  # type:ignore
        access_type="offline", included_granted_scopes="true", prompt="consent"
    )
    if not isinstance(auth_url, str):
        raise Exception("Missing google auth url")
    return auth_url


# # Required, indicate where the API server will redirect the user after the user completes
# # the authorization flow. The redirect URI is required. The value must exactly
# # match one of the authorized redirect URIs for the OAuth 2.0 client, which you
# # configured in the API Console. If this value doesn't match an authorized URI,
# # you will get a 'redirect_uri_mismatch' error.
# flow.redirect_uri = settings.auth

# # Generate URL for request to Google's OAuth 2.0 server.
# # Use kwargs to set optional request parameters.
# authorization_url, state = flow.authorization_url(
#     # Recommended, enable offline access so that you can refresh an access token without
#     # re-prompting the user for permission. Recommended for web server apps.
#     access_type='offline',
#     # Optional, enable incremental authorization. Recommended as a best practice.
#     include_granted_scopes='true',
#     # Optional, if your application knows which user is trying to authenticate, it can use this
#     # parameter to provide a hint to the Google Authentication Server.
#     login_hint='hint@example.com',
#     # Optional, set prompt to 'consent' will prompt the user for consent
#     prompt='consent')
