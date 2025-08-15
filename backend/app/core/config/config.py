import os
from typing import Literal

from dotenv import load_dotenv
from pydantic import Field, computed_field
from pydantic_settings import (
    BaseSettings,
    PydanticBaseSettingsSource,
    PyprojectTomlConfigSettingsSource,
    SettingsConfigDict,
    YamlConfigSettingsSource,
)

load_dotenv()

env = os.getenv("ENVIRONMENT", "development")

config = SettingsConfigDict(
    env_file=".env",
    toml_file="pyproject.toml",
    pyproject_toml_table_header=("project",),
    yaml_file=["config.yaml", f"config.{env}.yaml"],
    extra="ignore",
)


class BSettings(BaseSettings):
    model_config = config

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ) -> tuple[PydanticBaseSettingsSource, ...]:
        return (
            dotenv_settings,
            env_settings,
            PyprojectTomlConfigSettingsSource(settings_cls),
            init_settings,
            YamlConfigSettingsSource(settings_cls),
        )


class App(BSettings):
    model_config = config
    name: str
    version: str
    description: str
    debug: bool
    environment: Literal["development", "production"] = "development"
    api_base_url: str
    frontend_url: str = "http://localhost:5173"
    secret_key: str


class Auth(BSettings):
    access_token_expire_minutes: int = 1440
    algorithm: str = "HS256"
    http_only: bool = True
    cookie_max_age: int = 60 * 60 * 24
    cookie_expiration_check: int = Field(
        default=60 * 60 * 24, description="Cookie expiration check interval in seconds"
    )
    same_site: Literal["lax", "strict", "none"] = "lax"
    secure: bool = True
    domain: str = "localhost"
    secret_key: str | None = None
    google_client_id: str
    google_project_id: str
    google_auth_uri: str = "https://accounts.google.com/o/oauth2/auth"
    google_token_uri: str = "https://oauth2.googleapis.com/token"
    google_auth_provider_x509_cert_url: str = "https://www.googleapis.com/oauth2/v1/certs"
    google_client_secret: str
    google_redirect_uris: list[str] = ["http://localhost:8000/user/auth/callback"]
    google_javascript_origins: list[str] = ["http://localhost:8000", "http://localhost:5173"]
    google_auth_scopes: list[str] = [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/drive.metadata.readonly",
        "https://www.googleapis.com/auth/calendar.readonly",
        "openid",
    ]
    google_auth_req_api: str = "https://www.googleapis.com/oauth2/v2/userinfo"

    # google_auth_client_id: str
    # google_auth_secret: str
    # google_auth_callback_redirect_slug: str
    # google_auth_client_secret: str = Field(validation_alias="google_client_secret")
    # google_auth_project_id: str
    # google_auth_provider_x509_cert_url: str
    # google_auth_redirect_uris: list[str]
    # google_auth_auth_uri: str
    # google_auth_token_uri: str
    # google_auth_javascript_origins: str


class Cors(BSettings):
    model_config = SettingsConfigDict(env_prefix="CORS_")
    origins: list[str] = ["http://localhost:5173"]
    allow_credentials: bool = True
    allow_methods: list[str] = ["*"]
    allow_headers: list[str] = ["*"]


class Telemetry(BSettings):
    sentry_dsn: str = "dummy_key"
    traces_sample_rate: float = 1.0
    profiles_sample_rate: float = 0.1
    post_hog_api_key: str = "dummy_key"
    post_hog_host: str = "https://eu.posthog.com"
    monitoring_enabled: bool = False


class Db(BSettings):
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    db_host: str = "postgres"
    db_port: int = 5432
    engine_options: dict[str, int] = {
        "pool_recycle": 299,
        "pool_size": 20,
        "max_overflow": 10,
    }
    expire_on_commit: bool = False
    auto_commit: bool = False
    auto_flush: bool = False
    echo_enabled: bool = False

    @computed_field
    @property
    def async_pg_db_uri(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.db_host}:{self.db_port}/{self.POSTGRES_DB}"

    @computed_field
    @property
    def pg_db_uri(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.db_host}:{self.db_port}/{self.POSTGRES_DB}"


class Redis(BSettings):
    redis_password: str
    redis_host: str = "localhost"
    redis_port: str
    redis_max_connections: int = 20
    redis_socket_connection_timout: int = 10
    redis_socket_timeout: int = 10
    redis_cache_time: int = 86400
    redis_link_cache_time: int = 31536000


class S3(BSettings):
    s3_access_key: str = "default"
    s3_secret_access_key: str = "default"
    s3_default_region: str = "eu-north-1"
    s3_logging_level: str = "ERROR"
    s3_uri: str = "default"
    s3_bucket: str = "default"


class Security(BSettings):
    access_token_cookie_name: str = "access_token"
    jwt_algorithm: str = "HS256"
    token_secret_key: str = "default"


class Email(BSettings):
    SMTP_USERNAME: str
    SMTP_PASSWORD: str
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587


class Settings(BaseSettings):
    app: App = App()  # type: ignore
    auth: Auth = Auth()  # type: ignore
    cors: Cors = Cors()
    telemetry: Telemetry = Telemetry()
    db: Db = Db()  # type: ignore
    redis: Redis = Redis()  # type: ignore
    s3: S3 = S3()
    security: Security = Security()
    email: Email = Email()  # type: ignore
