const prefixMap: Record<string, string> = {
  coin_ngc: 'CNG',
  coin_pcgs: 'CPG',
  coin_us_precious: 'CUP',
  coin_us_non_precious: 'CUN',
  coin_foreign_precious: 'CFP',
  coin_foreign_non_precious: 'CFN',
  paper_currency: 'PCY',
  tcg_single_graded: 'TSG',
  tcg_single_ungraded: 'TSU',
  tcg_sealed_product: 'TSP',
  tcg_sealed_pack: 'TPK',
}

export function generateSKU(itemTypeCode: string): string {
  const prefix = prefixMap[itemTypeCode] ?? 'ITM'
  const timestamp = Date.now().toString(36).toUpperCase()
  const randomBytes = crypto.getRandomValues(new Uint8Array(4))
  const random = Array.from(randomBytes, (b) => b.toString(36)).join('').toUpperCase().substring(0, 6)
  return `${prefix}-${timestamp}-${random}`
}
