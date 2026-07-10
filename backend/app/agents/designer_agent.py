"""Designer Agent: ürün bilgisinden görsel üretim promptu oluşturur."""
from . import llm_client

SYSTEM_PROMPT = """You are a senior prompt engineer specialized in product photography \
and e-commerce visuals for image generation models (Midjourney, DALL-E, Stable Diffusion).

Given product attributes, write ONE detailed English image-generation prompt that:
- Describes the product precisely (material, style, color, category)
- Specifies a professional e-commerce photography setup: composition, camera angle, \
lens, lighting (e.g. softbox, golden hour), background/scene that fits the target audience
- Includes mood and styling keywords appropriate for the use case and audience
- Ends with quality tags such as: ultra detailed, 8k, professional product photography, \
sharp focus, high dynamic range

Return ONLY the prompt text. No explanations, no quotes, no markdown."""


def generate_image_prompt(product: dict) -> str:
    """Ürün özelliklerinden İngilizce, detaylı bir görsel üretim promptu üretir.

    product: materyal, tarz, renk, kategori, kullanim_amaci, hedef_kitle
    """
    user_prompt = (
        "Product attributes:\n"
        f"- Material: {product['materyal']}\n"
        f"- Style: {product['tarz']}\n"
        f"- Color: {product['renk']}\n"
        f"- Category: {product['kategori']}\n"
        f"- Intended use: {product['kullanim_amaci']}\n"
        f"- Target audience: {product['hedef_kitle']}\n\n"
        "Write the image generation prompt now."
    )
    return llm_client.chat(SYSTEM_PROMPT, user_prompt, temperature=0.8)
