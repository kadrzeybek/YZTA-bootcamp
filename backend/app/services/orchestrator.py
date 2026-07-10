"""Orchestrator: designer ve copywriter agent'larını sırayla çalıştırır.

Akış: ürün bilgisi -> designer_agent (görsel prompt) -> copywriter_agent
(görsel prompt + ürün bilgisi ile SEO metni) -> birleşik sonuç.
"""
from ..agents import copywriter_agent, designer_agent


def run_pipeline(product: dict) -> dict:
    """İki agent'ı zincirleyip birleşik sonucu döndürür.

    product: materyal, tarz, renk, kategori, kullanim_amaci, hedef_kitle
    Dönüş: {"gorsel_prompt", "baslik", "aciklama", "anahtar_kelimeler"}
    LLM hatalarında llm_client.LLMError fırlatılır.
    """
    gorsel_prompt = designer_agent.generate_image_prompt(product)
    copy = copywriter_agent.generate_marketing_copy(product, gorsel_prompt)

    return {
        "gorsel_prompt": gorsel_prompt,
        "baslik": copy["baslik"],
        "aciklama": copy["aciklama"],
        "anahtar_kelimeler": copy["anahtar_kelimeler"],
    }
