"""Test fixture'ları: in-memory SQLite ve TestClient."""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture()
def client():
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def auth_headers(client):
    """Kayıtlı bir kullanıcı için Authorization header'ı döndürür."""
    res = client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "sifre123"},
    )
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


SAMPLE_PRODUCT = {
    "materyal": "seramik",
    "tarz": "minimalist",
    "renk": "mat siyah",
    "kategori": "kahve kupası",
    "kullanim_amaci": "günlük kahve keyfi",
    "hedef_kitle": "genç profesyoneller",
}
