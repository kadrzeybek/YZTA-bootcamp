"""API entegrasyon testleri: auth akışı ve ürün endpoint'leri."""
from app.services import orchestrator
from tests.conftest import SAMPLE_PRODUCT


# ---------- Auth ----------
def test_register_and_login(client):
    res = client.post(
        "/api/auth/register", json={"email": "a@b.com", "password": "sifre123"}
    )
    assert res.status_code == 201
    assert "access_token" in res.json()

    res = client.post(
        "/api/auth/login", json={"email": "a@b.com", "password": "sifre123"}
    )
    assert res.status_code == 200


def test_register_duplicate_email(client):
    client.post("/api/auth/register", json={"email": "a@b.com", "password": "sifre123"})
    res = client.post(
        "/api/auth/register", json={"email": "a@b.com", "password": "sifre456"}
    )
    assert res.status_code == 409


def test_login_wrong_password(client):
    client.post("/api/auth/register", json={"email": "a@b.com", "password": "sifre123"})
    res = client.post("/api/auth/login", json={"email": "a@b.com", "password": "yanlis"})
    assert res.status_code == 401


def test_protected_route_requires_token(client):
    assert client.get("/api/products").status_code == 401
    assert client.get("/api/products", headers={"Authorization": "Bearer bozuk"}).status_code == 401


# ---------- Products ----------
def test_create_and_get_product(client, auth_headers):
    res = client.post("/api/products", json=SAMPLE_PRODUCT, headers=auth_headers)
    assert res.status_code == 201
    product_id = res.json()["id"]

    res = client.get(f"/api/products/{product_id}", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["materyal"] == "seramik"

    res = client.get("/api/products", headers=auth_headers)
    assert len(res.json()) == 1


def test_user_cannot_see_others_products(client, auth_headers):
    res = client.post("/api/products", json=SAMPLE_PRODUCT, headers=auth_headers)
    product_id = res.json()["id"]

    res = client.post(
        "/api/auth/register", json={"email": "digeri@b.com", "password": "sifre123"}
    )
    other_headers = {"Authorization": f"Bearer {res.json()['access_token']}"}

    assert client.get(f"/api/products/{product_id}", headers=other_headers).status_code == 404
    assert client.get("/api/products", headers=other_headers).json() == []


def test_generate_saves_results(client, auth_headers, monkeypatch):
    fake_result = {
        "gorsel_prompt": "a beautiful mug prompt",
        "baslik": "Şık Seramik Kupa",
        "aciklama": "Uzun açıklama",
        "anahtar_kelimeler": ["kupa", "seramik", "kahve", "hediye", "minimalist"],
    }
    monkeypatch.setattr(orchestrator, "run_pipeline", lambda product: fake_result)

    res = client.post("/api/products", json=SAMPLE_PRODUCT, headers=auth_headers)
    product_id = res.json()["id"]

    res = client.post(f"/api/products/{product_id}/generate", headers=auth_headers)
    assert res.status_code == 200
    body = res.json()
    assert body["gorsel_prompt"] == fake_result["gorsel_prompt"]
    assert body["product"]["uretilen_baslik"] == "Şık Seramik Kupa"

    # Sonuçlar kalıcı olarak kaydedilmiş olmalı
    res = client.get(f"/api/products/{product_id}", headers=auth_headers)
    assert res.json()["uretilen_anahtar_kelimeler"].startswith("kupa,")


def test_generate_llm_failure_returns_502(client, auth_headers, monkeypatch):
    from app.agents.llm_client import LLMError

    def failing_pipeline(product):
        raise LLMError("OPENAI_API_KEY tanımlı değil.")

    monkeypatch.setattr(orchestrator, "run_pipeline", failing_pipeline)

    res = client.post("/api/products", json=SAMPLE_PRODUCT, headers=auth_headers)
    product_id = res.json()["id"]

    res = client.post(f"/api/products/{product_id}/generate", headers=auth_headers)
    assert res.status_code == 502
    assert "İçerik üretimi başarısız" in res.json()["detail"]
