type TitleParts = {
  itemTypeCode: string
  coinNgc?: { year?: string | null; mint?: string | null; denomination?: string | null; authorityCountry?: string | null; grade?: string | null }
  coinPcgs?: { year?: string | null; mint?: string | null; denomination?: string | null; authorityCountry?: string | null; grade?: string | null }
  coinUngradedUSPrecious?: { year?: string | null; mint?: string | null; denomination?: string | null; metalType?: string | null }
  coinUngradedUSNonPrecious?: { year?: string | null; mint?: string | null; denomination?: string | null }
  coinUngradedForeignPrecious?: { year?: string | null; mint?: string | null; denomination?: string | null; authorityCountry?: string | null; metalType?: string | null }
  coinUngradedForeignNonPrecious?: { year?: string | null; mint?: string | null; denomination?: string | null; authorityCountry?: string | null }
  paperCurrency?: { country?: string | null; denomination?: string | null; yearOrSeries?: string | null }
  tcgSingleGraded?: { brand?: string | null; setName?: string | null; cardName?: string | null; cardNumber?: string | null; grade?: string | null; gradingCompany?: string | null }
  tcgSingleUngraded?: { brand?: string | null; setName?: string | null; cardName?: string | null; cardNumber?: string | null }
  tcgSealedProduct?: { brand?: string | null; setName?: string | null; productName?: string | null; productType?: string | null; releaseYear?: string | null }
  tcgSealedPack?: { brand?: string | null; setName?: string | null; productName?: string | null; releaseYear?: string | null }
}

function parts(...segments: (string | null | undefined)[]): string {
  return segments.filter(Boolean).join(' ')
}

export function generateTitle(data: TitleParts): string {
  const t = data.itemTypeCode
  if (t === 'coin_ngc' && data.coinNgc) {
    const c = data.coinNgc
    return parts(c.year, c.mint ? `(${c.mint})` : null, c.denomination, c.authorityCountry, 'NGC', c.grade) || 'NGC Graded Coin'
  }
  if (t === 'coin_pcgs' && data.coinPcgs) {
    const c = data.coinPcgs
    return parts(c.year, c.mint ? `(${c.mint})` : null, c.denomination, c.authorityCountry, 'PCGS', c.grade) || 'PCGS Graded Coin'
  }
  if (t === 'coin_us_precious' && data.coinUngradedUSPrecious) {
    const c = data.coinUngradedUSPrecious
    return parts(c.year, c.mint ? `(${c.mint})` : null, c.denomination, c.metalType, 'US Coin') || 'US Precious Metal Coin'
  }
  if (t === 'coin_us_non_precious' && data.coinUngradedUSNonPrecious) {
    const c = data.coinUngradedUSNonPrecious
    return parts(c.year, c.mint ? `(${c.mint})` : null, c.denomination, 'US Coin') || 'US Coin'
  }
  if (t === 'coin_foreign_precious' && data.coinUngradedForeignPrecious) {
    const c = data.coinUngradedForeignPrecious
    return parts(c.year, c.mint ? `(${c.mint})` : null, c.denomination, c.authorityCountry, c.metalType) || 'Foreign Precious Metal Coin'
  }
  if (t === 'coin_foreign_non_precious' && data.coinUngradedForeignNonPrecious) {
    const c = data.coinUngradedForeignNonPrecious
    return parts(c.year, c.mint ? `(${c.mint})` : null, c.denomination, c.authorityCountry) || 'Foreign Coin'
  }
  if (t === 'paper_currency' && data.paperCurrency) {
    const c = data.paperCurrency
    return parts(c.country, c.denomination, c.yearOrSeries) || 'Paper Currency'
  }
  if (t === 'tcg_single_graded' && data.tcgSingleGraded) {
    const c = data.tcgSingleGraded
    return parts(c.brand, c.setName, c.cardName, c.cardNumber ? `#${c.cardNumber}` : null, c.gradingCompany, c.grade) || 'Graded TCG Card'
  }
  if (t === 'tcg_single_ungraded' && data.tcgSingleUngraded) {
    const c = data.tcgSingleUngraded
    return parts(c.brand, c.setName, c.cardName, c.cardNumber ? `#${c.cardNumber}` : null) || 'Ungraded TCG Card'
  }
  if (t === 'tcg_sealed_product' && data.tcgSealedProduct) {
    const c = data.tcgSealedProduct
    return parts(c.brand, c.setName, c.productName, c.productType, c.releaseYear) || 'Sealed TCG Product'
  }
  if (t === 'tcg_sealed_pack' && data.tcgSealedPack) {
    const c = data.tcgSealedPack
    return parts(c.brand, c.setName, c.productName, 'Pack', c.releaseYear) || 'Sealed TCG Pack'
  }
  return 'New Item'
}
