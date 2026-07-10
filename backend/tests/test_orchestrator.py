"""Orchestrator birim testleri — iki agent'ın doğru sırayla zincirlendiğini doğrular."""
import pytest

from app.agents.llm_client import LLMError
from app.services import orchestrator

PRODUCT = {
    "materyal": "deri",
    "tarz": "vintage",
    "renk": "kahverengi",
    "kategori": "cüzdan",
    "kullanim_amaci": "günlük kullanım",
    "hedef_kitle": "erkekler",
}


def test_pipeline_chains_agents(monkeypatch):
    calls = []

    def fake_designer(product):
        calls.append("designer")
        assert product == PRODUCT
        return "vintage leather wallet prompt"

    def fake_copywriter(product, image_prompt):
        calls.append("copywriter")
        # Copywriter, designer'ın çıktısını girdi olarak almalı
        assert image_prompt == "vintage leather wallet prompt"
        return {
            "baslik": "Vintage Deri Cüzdan",
            "aciklama": "Açıklama",
            "anahtar_kelimeler": ["cüzdan", "deri", "vintage", "erkek", "hediye"],
        }

    monkeypatch.setattr(orchestrator.designer_agent, "generate_image_prompt", fake_designer)
    monkeypatch.setattr(
        orchestrator.copywriter_agent, "generate_marketing_copy", fake_copywriter
    )

    result = orchestrator.run_pipeline(PRODUCT)

    assert calls == ["designer", "copywriter"]
    assert result["gorsel_prompt"] == "vintage leather wallet prompt"
    assert result["baslik"] == "Vintage Deri Cüzdan"
    assert len(result["anahtar_kelimeler"]) == 5


def test_pipeline_propagates_llm_error(monkeypatch):
    def failing_designer(product):
        raise LLMError("API kotası doldu")

    monkeypatch.setattr(
        orchestrator.designer_agent, "generate_image_prompt", failing_designer
    )

    with pytest.raises(LLMError):
        orchestrator.run_pipeline(PRODUCT)
