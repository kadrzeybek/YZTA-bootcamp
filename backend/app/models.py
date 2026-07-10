"""SQLAlchemy ORM modelleri: User ve Product."""
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)

    products: Mapped[list["Product"]] = relationship(
        back_populates="owner", cascade="all, delete-orphan"
    )


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)

    materyal: Mapped[str] = mapped_column(String(255), nullable=False)
    tarz: Mapped[str] = mapped_column(String(255), nullable=False)
    renk: Mapped[str] = mapped_column(String(255), nullable=False)
    kategori: Mapped[str] = mapped_column(String(255), nullable=False)
    kullanim_amaci: Mapped[str] = mapped_column(String(500), nullable=False)
    hedef_kitle: Mapped[str] = mapped_column(String(500), nullable=False)

    uretilen_gorsel_prompt: Mapped[str | None] = mapped_column(Text, nullable=True)
    uretilen_baslik: Mapped[str | None] = mapped_column(String(500), nullable=True)
    uretilen_aciklama: Mapped[str | None] = mapped_column(Text, nullable=True)
    # Anahtar kelimeler virgülle ayrılmış tek string olarak saklanır
    uretilen_anahtar_kelimeler: Mapped[str | None] = mapped_column(Text, nullable=True)

    olusturulma_tarihi: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow
    )

    owner: Mapped[User] = relationship(back_populates="products")
