"""Pydantic request/response şemaları."""
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ---------- Auth ----------
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    created_at: datetime


# ---------- Product ----------
class ProductCreate(BaseModel):
    materyal: str = Field(min_length=1, max_length=255)
    tarz: str = Field(min_length=1, max_length=255)
    renk: str = Field(min_length=1, max_length=255)
    kategori: str = Field(min_length=1, max_length=255)
    kullanim_amaci: str = Field(min_length=1, max_length=500)
    hedef_kitle: str = Field(min_length=1, max_length=500)


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    materyal: str
    tarz: str
    renk: str
    kategori: str
    kullanim_amaci: str
    hedef_kitle: str
    uretilen_gorsel_prompt: str | None = None
    uretilen_baslik: str | None = None
    uretilen_aciklama: str | None = None
    uretilen_anahtar_kelimeler: str | None = None
    olusturulma_tarihi: datetime


class GenerateResult(BaseModel):
    product: ProductOut
    gorsel_prompt: str
    baslik: str
    aciklama: str
    anahtar_kelimeler: list[str]
