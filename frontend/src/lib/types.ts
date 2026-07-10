export interface User {
  id: number
  email: string
  created_at: string
}

export interface Product {
  id: number
  materyal: string
  tarz: string
  renk: string
  kategori: string
  kullanim_amaci: string
  hedef_kitle: string
  uretilen_gorsel_prompt: string | null
  uretilen_baslik: string | null
  uretilen_aciklama: string | null
  uretilen_anahtar_kelimeler: string | null
  olusturulma_tarihi: string
}

export interface ProductInput {
  materyal: string
  tarz: string
  renk: string
  kategori: string
  kullanim_amaci: string
  hedef_kitle: string
}

export interface GenerateResult {
  product: Product
  gorsel_prompt: string
  baslik: string
  aciklama: string
  anahtar_kelimeler: string[]
}
