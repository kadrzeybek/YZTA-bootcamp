"""Copywriter Agent: görsel prompt + ürün bilgisinden SEO uyumlu pazarlama metni üretir."""
import json

from . import llm_client
from .llm_client import LLMError

SYSTEM_PROMPT = """Sen e-ticaret için SEO uyumlu ürün metinleri yazan kıdemli bir \
pazarlama metin yazarısın. Sana ürün özellikleri ve ürünün görseli için hazırlanmış \
bir görsel üretim promptu verilecek.

Şunları üret (Türkçe):
1. SEO uyumlu, dikkat çekici bir ürün başlığı (en fazla 70 karakter)
2. 150-200 kelimelik, hedef kitleye hitap eden, satış odaklı bir ürün açıklaması
3. 5 adet SEO anahtar kelimesi

SADECE şu JSON formatında yanıt ver, başka hiçbir şey yazma:
{"baslik": "...", "aciklama": "...", "anahtar_kelimeler": ["...", "...", "...", "...", "..."]}"""


def generate_marketing_copy(product: dict, image_prompt: str) -> dict:
    """SEO başlığı, açıklama ve 5 anahtar kelime döndürür.

    Dönüş: {"baslik": str, "aciklama": str, "anahtar_kelimeler": list[str]}
    """
    user_prompt = (
        "Ürün özellikleri:\n"
        f"- Materyal: {product['materyal']}\n"
        f"- Tarz: {product['tarz']}\n"
        f"- Renk: {product['renk']}\n"
        f"- Kategori: {product['kategori']}\n"
        f"- Kullanım amacı: {product['kullanim_amaci']}\n"
        f"- Hedef kitle: {product['hedef_kitle']}\n\n"
        f"Görsel üretim promptu:\n{image_prompt}\n\n"
        "Şimdi JSON çıktısını üret."
    )
    raw = llm_client.chat(SYSTEM_PROMPT, user_prompt, temperature=0.7)
    return _parse_response(raw)


def _parse_response(raw: str) -> dict:
    """LLM yanıtını doğrular; model bazen JSON'u kod bloğuna sarar."""
    text = raw.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.startswith("json"):
            text = text[4:]
        text = text.strip()

    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        raise LLMError("Copywriter yanıtı beklenen JSON formatında değil.") from exc

    for key in ("baslik", "aciklama", "anahtar_kelimeler"):
        if key not in data:
            raise LLMError(f"Copywriter yanıtında '{key}' alanı eksik.")

    if not isinstance(data["anahtar_kelimeler"], list):
        raise LLMError("'anahtar_kelimeler' bir liste olmalı.")

    return {
        "baslik": str(data["baslik"]).strip(),
        "aciklama": str(data["aciklama"]).strip(),
        "anahtar_kelimeler": [str(k).strip() for k in data["anahtar_kelimeler"]][:5],
    }
