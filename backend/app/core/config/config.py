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


class GeneralSettings(BSettings):
    app_domain: str = Field(
        description="The app domain that will be used to construct other properties, e.g google.com"
    )
    api_domain: str = Field(
        description="The API domain that will be used to construct other properties, this may be the same or different from the APP_DOMAIN"
    )
    environment: Literal["development", "production"] = "development"

    @computed_field
    @property
    def protocol(self) -> str:
        return "https://" if self.environment == "production" else "http://"


class App(GeneralSettings):
    name: str
    version: str
    description: str
    debug: bool
    secret_key: str

    @computed_field
    @property
    def frontend_url(self) -> str:
        return f"{self.protocol}{self.app_domain}"

    def api_base_url(self) -> str:
        return f"{self.protocol}{self.api_domain}"


class Auth(GeneralSettings):
    access_token_expire_minutes: int = 1440
    algorithm: str = "HS256"
    http_only: bool = True
    cookie_max_age: int = 60 * 60 * 24
    cookie_expiration_check: int = Field(
        default=60 * 60 * 24, description="Cookie expiration check interval in seconds"
    )
    same_site: Literal["lax", "strict", "none"] = "lax"
    secure: bool = True
    google_client_id: str
    google_project_id: str
    google_auth_uri: str = "https://accounts.google.com/o/oauth2/auth"
    google_token_uri: str = "https://oauth2.googleapis.com/token"
    google_auth_provider_x509_cert_url: str = "https://www.googleapis.com/oauth2/v1/certs"
    google_client_secret: str
    google_auth_scopes: list[str] = [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",
    ]
    google_auth_req_api: str = "https://www.googleapis.com/oauth2/v2/userinfo"

    @computed_field
    @property
    def google_redirect_uris(self) -> list[str]:
        return [
            f"{self.protocol}{self.api_domain}/user/auth/callback"
            if self.environment == "development"
            else f"{self.protocol}{self.api_domain}/api/user/auth/callback"
        ]

    @computed_field
    @property
    def google_javascript_origins(self) -> list[str]:
        js_origins = []
        js_origin = f"{self.protocol}{self.app_domain}"
        js_origins.append(js_origin)
        return js_origins

    @computed_field
    @property
    def allowed_hosts(self) -> list[str]:
        return [
            f".{self.app_domain}",
            f"{self.app_domain}",
            f"*.{self.app_domain}",
            f".{self.api_domain}",
            f"{self.api_domain}",
            f"*.{self.api_domain}",
            "localhost",
        ]

    @computed_field
    @property
    def domain(self) -> str:
        return self.app_domain.split(":")[0]


class Cors(GeneralSettings):
    model_config = SettingsConfigDict(env_prefix="CORS_")
    allow_credentials: bool = True
    allow_methods: list[str] = ["*"]
    allow_headers: list[str] = ["*"]

    @computed_field
    @property
    def origins(self) -> list[str]:
        cors_origins = []
        cors_origin = f"{self.protocol}{self.app_domain}"
        cors_origins.append(cors_origin)
        return cors_origins


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
    db_port: int = 5433
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

    @computed_field
    @property
    def pg_db_local_uri(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@localhost:{self.db_port}/{self.POSTGRES_DB}"


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
    cors: Cors = Cors()  # type: ignore
    telemetry: Telemetry = Telemetry()  # type: ignore
    db: Db = Db()  # type: ignore
    redis: Redis = Redis()  # type: ignore
    s3: S3 = S3()  # type: ignore
    security: Security = Security()  # type: ignore
    email: Email = Email()  # type: ignore
