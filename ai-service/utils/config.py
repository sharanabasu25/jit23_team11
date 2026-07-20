import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Application configurations.
    Loads values from environment variables and fallback defaults.
    """
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ENV: str = "development"
    APP_NAME: str = "Smart Public Grievance Management System - AI Service"
    API_VERSION: str = "1.0"
    YOLO_CONFIDENCE_THRESHOLD: float = 0.50
    YOLO_MODEL_PATH: str = os.path.normpath(
        os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "best.pt")
    )


    # Use dotenv configuration to load variables from file
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

# Instantiate settings to be imported where needed
settings = Settings()
