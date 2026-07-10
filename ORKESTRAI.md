# OrkestrAI 🎭

**E-Ticaret İçin Uçtan Uca Ürün Görselleştirme ve Pazarlama Ağı**

OrkestrAI, e-ticaret satıcısının girdiği temel ürün bilgisinden (materyal, tarz, renk, kategori, kullanım amacı, hedef kitle) yola çıkarak iki yapay zeka ajanını bir orkestrasyon akışıyla zincirler:

1. **Designer Agent** 🎨 — Ürün bilgisini Midjourney/DALL-E tarzı görsel üretim modellerine verilebilecek, prompt-engineering standartlarına uygun, detaylı İngilizce bir görsel üretim promptuna dönüştürür.
2. **Copywriter Agent** ✍️ — Görsel prompt + ürün bilgisinden SEO uyumlu ürün başlığı, 150–200 kelimelik satış odaklı açıklama ve 5 anahtar kelime üretir.

## Mimari

```
frontend (React + TS + Vite + Tailwind + Framer Motion)
   │  fetch + JWT Bearer
   ▼
backend (FastAPI)
   ├── routes/        → REST API uçları (auth + products)
   ├── auth/          → bcrypt şifre hash + JWT üretimi/doğrulama
   ├── services/
   │     ├── orchestrator.py      → iki ajanı sırayla zincirler
   │     └── product_service.py   → ürün iş mantığı
   ├── agents/
   │     ├── llm_client.py        → ortak OpenAI katmanı (tek noktadan model değişimi)
   │     ├── designer_agent.py    → görsel prompt üretimi
   │     ├── copywriter_agent.py  → SEO metin üretimi (JSON çıktı)
   │     └── image_adapter.py     → görsel üretim API'leri için adapter (şimdilik mock)
   └── SQLite (lokal) / PostgreSQL (Railway) — SQLAlchemy ORM
```

### API Uçları

| Metot | Yol | Açıklama |
|---|---|---|
| POST | `/api/auth/register` | Kayıt (email + şifre) → JWT |
| POST | `/api/auth/login` | Giriş → JWT |
| GET | `/api/auth/me` | Oturum sahibi kullanıcı 🔒 |
| POST | `/api/products` | Yeni ürün girdisi oluştur 🔒 |
| GET | `/api/products` | Kullanıcının ürünlerini listele 🔒 |
| GET | `/api/products/{id}` | Ürün + üretilen içerikler 🔒 |
| POST | `/api/products/{id}/generate` | Orchestrator'ı çalıştır, sonucu kaydet 🔒 |

🔒 = `Authorization: Bearer <token>` gerektirir. Her kullanıcı yalnızca kendi ürünlerini görür.

## Kurulum

### Gereksinimler

- Python 3.10+ (3.11+ önerilir)
- Node.js 20+
- Bir OpenAI API anahtarı

### 1) Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Ortam değişkenleri (bkz. kökteki .env.example)
export OPENAI_API_KEY="sk-..."
export JWT_SECRET="$(openssl rand -hex 32)"

uvicorn app.main:app --reload --port 8000
```

- API dokümantasyonu: http://localhost:8000/docs
- `DATABASE_URL` verilmezse lokalde otomatik olarak `backend/orkestrai.db` (SQLite) kullanılır.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

- Uygulama: http://localhost:5173
- Backend farklı bir adresteyse `frontend/.env` içine `VITE_API_URL=...` yazın.

### Testler

```bash
cd backend
.venv/bin/python -m pytest tests/ -v
```

LLM çağrıları testlerde mock'lanır; test çalıştırmak için API anahtarı gerekmez.

## Ortam Değişkenleri

Tam liste için [.env.example](.env.example) dosyasına bakın:

| Değişken | Nerede | Açıklama |
|---|---|---|
| `OPENAI_API_KEY` | backend | OpenAI API anahtarı (zorunlu) |
| `OPENAI_MODEL` | backend | Varsayılan `gpt-4o-mini`; `gpt-4o` yapılabilir |
| `JWT_SECRET` | backend | JWT imzalama anahtarı (production'da zorunlu, rastgele üretin) |
| `JWT_EXPIRE_MINUTES` | backend | Token ömrü (varsayılan 1440 = 24 saat) |
| `DATABASE_URL` | backend | Boşsa SQLite; Railway'de PostgreSQL URL'i |
| `CORS_ORIGINS` | backend | İzinli frontend origin'leri (virgülle ayrılmış) |
| `VITE_API_URL` | frontend | Backend API adresi |

## Güvenlik Notu (Token Saklama)

Frontend, JWT'yi basitlik için `localStorage`'da saklar. Production'da XSS'e karşı daha güvenli yaklaşım, backend'in token'ı `httpOnly` + `Secure` bir cookie olarak set etmesidir; bu durumda `CORS` ayarlarında `allow_credentials` zaten açık olduğundan yalnızca login/register yanıtlarında `Set-Cookie` kullanmak ve frontend'de `Authorization` header'ı yerine `credentials: 'include'` kullanmak yeterlidir.

## Railway'e Deploy

Proje iki ayrı Railway servisi olarak deploy edilir: **backend** ve **frontend**. Backend için hem Nixpacks (`railway.json` + `Procfile`) hem de `Dockerfile` hazırdır.

### 1) Proje ve PostgreSQL

1. [railway.app](https://railway.app) üzerinde yeni bir proje oluşturun.
2. **New → Database → PostgreSQL** ekleyin. Railway `DATABASE_URL` değişkenini otomatik üretir.

### 2) Backend servisi

1. **New → GitHub Repo** ile bu repoyu seçin.
2. Servis ayarlarında **Root Directory**'yi `backend` yapın.
3. **Variables** sekmesinden şu değişkenleri girin:
   - `OPENAI_API_KEY` → OpenAI anahtarınız
   - `JWT_SECRET` → `openssl rand -hex 32` çıktısı gibi rastgele bir değer
   - `DATABASE_URL` → **Add Reference** ile PostgreSQL servisinin `DATABASE_URL`'ine bağlayın (kod `postgres://` önekini otomatik düzeltir)
   - `CORS_ORIGINS` → frontend'in Railway domain'i (örn. `https://orkestrai-frontend.up.railway.app`) — frontend deploy edildikten sonra ekleyin/güncelleyin
4. **Settings → Networking → Generate Domain** ile backend'e public bir domain verin.
5. Deploy sonrası `https://<backend-domain>/api/health` → `{"status":"ok"}` dönmelidir.

### 3) Frontend servisi

1. Aynı repoyu ikinci bir servis olarak ekleyin, **Root Directory**'yi `frontend` yapın.
2. **Variables** sekmesine şunu girin (build sırasında gömülür):
   - `VITE_API_URL` → backend'in public URL'i (örn. `https://orkestrai-backend.up.railway.app`)
3. Build komutu `npm run build`, start komutu `npm run start`'tır (`frontend/railway.json` bunları tanımlar; `start`, `vite preview`'ı `$PORT` üzerinden ayağa kaldırır).
4. **Generate Domain** ile frontend'e domain verin.
5. Backend'in `CORS_ORIGINS` değişkenine bu domain'i ekleyip backend'i yeniden deploy edin.

### 4) Doğrulama

1. Frontend domain'ini açın → kayıt olun → ürün oluşturun → üretilen prompt ve metni görün.
2. Sorun olursa Railway'in **Deployments → Logs** sekmesinden hata mesajlarına bakın (LLM hataları API'de 502 + açıklayıcı mesaj olarak döner).

## Kapsam Notları

- Görsel üretim API'sine canlı bağlantı yoktur; `agents/image_adapter.py` içindeki adapter arayüzü sayesinde ileride DALL-E/Midjourney entegrasyonu tek sınıf ekleyerek yapılabilir.
- Tek kullanıcı rolü vardır; ödeme/e-ticaret entegrasyonu ve sosyal giriş kapsam dışıdır.
