"""OrkestrAI FastAPI uygulaması."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import Base, engine
from .routes import auth, products

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="OrkestrAI API",
    description="E-ticaret için uçtan uca ürün görselleştirme ve pazarlama ağı",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(products.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
