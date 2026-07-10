"""Uygulama yapılandırması — tüm ayarlar ortam değişkenlerinden okunur."""
import os


class Settings:
    # OpenAI
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    # JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", "dev-secret-change-me")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))

    # Veritabanı: production'da Railway PostgreSQL, lokalde SQLite fallback
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./orkestrai.db")

    # CORS: virgülle ayrılmış origin listesi
    CORS_ORIGINS: list[str] = [
        o.strip()
        for o in os.getenv(
            "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
        ).split(",")
        if o.strip()
    ]


settings = Settings()
