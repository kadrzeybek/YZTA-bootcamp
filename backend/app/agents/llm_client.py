"""OpenAI çağrıları için ortak istemci katmanı.

Tüm agent'lar LLM'e buradan erişir; böylece model/sağlayıcı değişikliği
tek noktadan yapılır ve testlerde kolayca mock'lanır.
"""
from openai import OpenAI, OpenAIError

from ..config import settings


class LLMError(Exception):
    """LLM çağrısı başarısız olduğunda fırlatılır; route katmanı bunu
    kullanıcı dostu bir HTTP hatasına çevirir."""


_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        if not settings.OPENAI_API_KEY:
            raise LLMError(
                "OPENAI_API_KEY tanımlı değil. Lütfen ortam değişkenini ayarlayın."
            )
        _client = OpenAI(api_key=settings.OPENAI_API_KEY)
    return _client


def chat(system_prompt: str, user_prompt: str, temperature: float = 0.7) -> str:
    """Tek turluk bir chat.completions çağrısı yapar ve metni döndürür."""
    try:
        response = _get_client().chat.completions.create(
            model=settings.OPENAI_MODEL,
            temperature=temperature,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )
        content = response.choices[0].message.content
        if not content:
            raise LLMError("LLM boş yanıt döndürdü.")
        return content.strip()
    except OpenAIError as exc:
        raise LLMError(f"LLM çağrısı başarısız oldu: {exc}") from exc
