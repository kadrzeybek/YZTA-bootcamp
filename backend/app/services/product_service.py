"""Ürün iş mantığı — route katmanından ayrı tutulur."""
from sqlalchemy.orm import Session

from ..models import Product
from ..schemas import ProductCreate
from . import orchestrator


def create_product(db: Session, user_id: int, payload: ProductCreate) -> Product:
    product = Product(user_id=user_id, **payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def get_product(db: Session, user_id: int, product_id: int) -> Product | None:
    return (
        db.query(Product)
        .filter(Product.id == product_id, Product.user_id == user_id)
        .first()
    )


def list_products(db: Session, user_id: int) -> list[Product]:
    return (
        db.query(Product)
        .filter(Product.user_id == user_id)
        .order_by(Product.olusturulma_tarihi.desc())
        .all()
    )


def generate_for_product(db: Session, product: Product) -> dict:
    """Orchestrator'ı çalıştırır ve sonucu ürüne kaydeder."""
    product_info = {
        "materyal": product.materyal,
        "tarz": product.tarz,
        "renk": product.renk,
        "kategori": product.kategori,
        "kullanim_amaci": product.kullanim_amaci,
        "hedef_kitle": product.hedef_kitle,
    }
    result = orchestrator.run_pipeline(product_info)

    product.uretilen_gorsel_prompt = result["gorsel_prompt"]
    product.uretilen_baslik = result["baslik"]
    product.uretilen_aciklama = result["aciklama"]
    product.uretilen_anahtar_kelimeler = ", ".join(result["anahtar_kelimeler"])
    db.commit()
    db.refresh(product)

    return result
