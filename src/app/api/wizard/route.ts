import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSKU } from '@/lib/sku'
import { generateTitle } from '@/lib/title-generator'
import { calculateSuggestedListingPrice } from '@/lib/pricing'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemTypeCode, details, pricing, notes, references } = body

    if (!itemTypeCode) {
      return NextResponse.json({ error: 'itemTypeCode is required' }, { status: 400 })
    }

    const sku = generateSKU(itemTypeCode)

    const titleData = { itemTypeCode, ...details }
    const suggestedTitle = generateTitle(titleData)

    let suggestedListingPrice: number | undefined
    if (pricing?.marketValue) {
      const calc = calculateSuggestedListingPrice({
        marketValue: parseFloat(pricing.marketValue),
        platformFeePercent: pricing.platformFeePercent ? parseFloat(pricing.platformFeePercent) : undefined,
        paymentFeePercent: pricing.paymentFeePercent ? parseFloat(pricing.paymentFeePercent) : undefined,
        paymentFeeFixed: pricing.paymentFeeFixed ? parseFloat(pricing.paymentFeeFixed) : undefined,
        shippingCost: pricing.shippingCost ? parseFloat(pricing.shippingCost) : undefined,
        promotedPercent: pricing.promotedPercent ? parseFloat(pricing.promotedPercent) : undefined,
        targetNetProceeds: pricing.targetNetProceeds ? parseFloat(pricing.targetNetProceeds) : undefined,
      })
      suggestedListingPrice = calc.suggestedListingPrice
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const itemData: any = {
      sku,
      itemTypeCode,
      suggestedTitle,
      status: 'DRAFT',
      marketValue: pricing?.marketValue ? parseFloat(pricing.marketValue) : undefined,
      listingPrice: pricing?.listingPrice ? parseFloat(pricing.listingPrice) : undefined,
      targetNetProceeds: pricing?.targetNetProceeds ? parseFloat(pricing.targetNetProceeds) : undefined,
      platformFeePercent: pricing?.platformFeePercent ? parseFloat(pricing.platformFeePercent) : undefined,
      paymentFeePercent: pricing?.paymentFeePercent ? parseFloat(pricing.paymentFeePercent) : undefined,
      paymentFeeFixed: pricing?.paymentFeeFixed ? parseFloat(pricing.paymentFeeFixed) : undefined,
      shippingCost: pricing?.shippingCost ? parseFloat(pricing.shippingCost) : undefined,
      promotedPercent: pricing?.promotedPercent ? parseFloat(pricing.promotedPercent) : undefined,
      suggestedListingPrice,
      pricingNotes: pricing?.pricingNotes,
    }

    if (itemTypeCode === 'coin_ngc' && details?.coinNgc) {
      itemData.coinNgc = { create: details.coinNgc }
    } else if (itemTypeCode === 'coin_pcgs' && details?.coinPcgs) {
      itemData.coinPcgs = { create: details.coinPcgs }
    } else if (itemTypeCode === 'coin_us_precious' && details?.coinUngradedUSPrecious) {
      itemData.coinUngradedUSPrecious = { create: details.coinUngradedUSPrecious }
    } else if (itemTypeCode === 'coin_us_non_precious' && details?.coinUngradedUSNonPrecious) {
      itemData.coinUngradedUSNonPrecious = { create: details.coinUngradedUSNonPrecious }
    } else if (itemTypeCode === 'coin_foreign_precious' && details?.coinUngradedForeignPrecious) {
      itemData.coinUngradedForeignPrecious = { create: details.coinUngradedForeignPrecious }
    } else if (itemTypeCode === 'coin_foreign_non_precious' && details?.coinUngradedForeignNonPrecious) {
      itemData.coinUngradedForeignNonPrecious = { create: details.coinUngradedForeignNonPrecious }
    } else if (itemTypeCode === 'paper_currency' && details?.paperCurrency) {
      itemData.paperCurrency = { create: details.paperCurrency }
    } else if (itemTypeCode === 'tcg_single_graded' && details?.tcgSingleGraded) {
      itemData.tcgSingleGraded = { create: details.tcgSingleGraded }
    } else if (itemTypeCode === 'tcg_single_ungraded' && details?.tcgSingleUngraded) {
      itemData.tcgSingleUngraded = { create: details.tcgSingleUngraded }
    } else if (itemTypeCode === 'tcg_sealed_product' && details?.tcgSealedProduct) {
      itemData.tcgSealedProduct = { create: details.tcgSealedProduct }
    } else if (itemTypeCode === 'tcg_sealed_pack' && details?.tcgSealedPack) {
      itemData.tcgSealedPack = { create: details.tcgSealedPack }
    }

    if (notes?.length) {
      itemData.notes = {
        create: notes.map((n: { noteType?: string; body: string; isPublic?: boolean }) => ({
          noteType: n.noteType || 'GENERAL',
          body: n.body,
          isPublic: n.isPublic ?? false,
        })),
      }
    }

    if (references?.length) {
      itemData.references = {
        create: references.map((r: { refType?: string; label?: string; url?: string; value?: string; notes?: string }, idx: number) => ({
          refType: r.refType || 'OTHER',
          label: r.label,
          url: r.url,
          value: r.value,
          notes: r.notes,
          sortOrder: idx,
        })),
      }
    }

    const item = await prisma.inventoryItem.create({ data: itemData })

    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    console.error('POST /api/wizard error:', error)
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}
