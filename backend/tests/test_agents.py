"""designer_agent ve copywriter_agent birim testleri (LLM mock'lanır)."""
import json

import pytest

from app.agents import copywriter_agent, designer_agent
from app.agents.llm_client import LLMError

PRODUCT = {
    "materyal": "seramik",
    "tarz": "minimalist",
    "renk": "mat siyah",
    "kategori": "kahve kupası",
    "kullanim_amaci": "günlük kahve keyfi",
    "hedef_kitle": "genç profesyoneller",
}


def test_designer_agent_returns_prompt(monkeypatch):
    captured = {}

    def fake_chat(system_prompt, user_prompt, temperature=0.7):
        captured["system"] = system_prompt
        captured["user"] = user_prompt
        return "A minimalist matte black ceramic coffee mug, studio lighting, 8k"

    monkeypatch.setattr(designer_agent.llm_client, "chat", fake_chat)

    prompt = designer_agent.generate_image_prompt(PRODUCT)

    assert "ceramic" in prompt
    # Tüm ürün özellikleri LLM'e iletilmiş olmalı
    assert "seramik" in captured["user"]
    assert "genç profesyoneller" in captured["user"]


def test_copywriter_agent_parses_json(monkeypatch):
    response = {
        "baslik": "Minimalist Mat Siyah Seramik Kupa",
        "aciklama": "Harika bir kupa. " * 30,
        "anahtar_kelimeler": ["kupa", "seramik", "siyah kupa", "kahve", "minimalist"],
    }
    monkeypatch.setattr(
        copywriter_agent.llm_client, "chat", lambda *a, **k: json.dumps(response)
    )

    result = copywriter_agent.generate_marketing_copy(PRODUCT, "image prompt")

    assert result["baslik"] == response["baslik"]
    assert len(result["anahtar_kelimeler"]) == 5


def test_copywriter_agent_strips_code_fences(monkeypatch):
    raw = '```json\n{"baslik": "B", "aciklama": "A", "anahtar_kelimeler": ["k1"]}\n```'
    monkeypatch.setattr(copywriter_agent.llm_client, "chat", lambda *a, **k: raw)

    result = copywriter_agent.generate_marketing_copy(PRODUCT, "prompt")

    assert result["baslik"] == "B"


def test_copywriter_agent_invalid_json_raises(monkeypatch):
    monkeypatch.setattr(
        copywriter_agent.llm_client, "chat", lambda *a, **k: "bu json değil"
    )

    with pytest.raises(LLMError):
        copywriter_agent.generate_marketing_copy(PRODUCT, "prompt")


def test_copywriter_agent_missing_field_raises(monkeypatch):
    monkeypatch.setattr(
        copywriter_agent.llm_client, "chat", lambda *a, **k: '{"baslik": "B"}'
    )

    with pytest.raises(LLMError):
        copywriter_agent.generate_marketing_copy(PRODUCT, "prompt")
