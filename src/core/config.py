"""Application configuration management."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    database_url: str = "postgresql://sdlc_user:sdlc_password@localhost:5432/ai_sdlc_db"

    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_debug: bool = False

    # Anthropic / Claude API
    anthropic_api_key: str = ""

    # Ollama
    ollama_base_url: str = "http://localhost:11434"

    # OpenAI (optional)
    openai_api_key: str = ""

    # Auth
    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # Logging
    log_level: str = "INFO"
    log_format: str = "json"

    # Features
    enable_local_model_manager: bool = True
    enable_cloud_apis: bool = True

    class Config:
        """Pydantic config."""
        env_file = ".env"
        case_sensitive = False


settings = Settings()
