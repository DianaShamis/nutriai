from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyUrl
from typing import List
from pydantic import Field

class Settings(BaseSettings):
    ENV: str = "dev"

    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    DATABASE_URL: AnyUrl = "postgresql+asyncpg://postgres:postgres@localhost:5432/nutriai"
    REDIS_URL: AnyUrl = "redis://localhost:6380/0"

    AI_BASE_URL: str = "https://example.com"

    JWT_SECRET_KEY: str = Field(default="ShamisShamisShamisDianaDianaDiana")
    JWT_ALGORITHM: str = Field(default="HS256")
    JWT_EXPIRE_MINUTES: int = Field(default=60)

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()