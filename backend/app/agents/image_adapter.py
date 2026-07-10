"""Görsel üretim API'leri için adapter katmanı.

Şu an gerçek bir görsel üretim servisi bağlı değil; MockImageGenerator
placeholder döndürür. İleride DALL-E/Midjourney entegrasyonu için
ImageGeneratorAdapter arayüzünü uygulayan yeni bir sınıf yazmak yeterli.
"""
from abc import ABC, abstractmethod


class ImageGeneratorAdapter(ABC):
    @abstractmethod
    def generate(self, prompt: str) -> str:
        """Verilen prompt'tan bir görsel üretir ve URL'ini döndürür."""


class MockImageGenerator(ImageGeneratorAdapter):
    """Gerçek API bağlanana kadar kullanılan sahte üretici."""

    def generate(self, prompt: str) -> str:
        return "https://placehold.co/1024x1024?text=OrkestrAI"


# Örnek gelecek entegrasyonu:
# class DalleImageGenerator(ImageGeneratorAdapter):
#     def generate(self, prompt: str) -> str:
#         response = client.images.generate(model="dall-e-3", prompt=prompt)
#         return response.data[0].url


def get_image_generator() -> ImageGeneratorAdapter:
    return MockImageGenerator()
