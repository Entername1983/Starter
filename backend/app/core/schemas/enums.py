from enum import Enum


class AuthProviderEnum(str, Enum):
    google = "google"
    discord = "discord"
    microsoft = "microsoft"
    internal = "internal"
