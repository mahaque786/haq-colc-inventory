import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const item = await prisma.inventoryItem.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        references: { orderBy: { sortOrder: 'asc' } },
        notes: { orderBy: { createdAt: 'desc' } },
        coinNgc: true,
        coinPcgs: true,
        coinUngradedUSPrecious: true,
        coinUngradedUSNonPrecious: true,
        coinUngradedForeignPrecious: true,
        coinUngradedForeignNonPrecious: true,
        paperCurrency: true,
        tcgSingleGraded: true,
        tcgSingleUngraded: true,
        tcgSealedProduct: true,
        tcgSealedPack: true,
      },
    })

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('GET /api/items/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const {
      customTitle, status, marketValue, listingPrice, targetNetProceeds,
      platformFeePercent, paymentFeePercent, paymentFeeFixed, shippingCost,
      promotedPercent, suggestedListingPrice, pricingNotes,
      publicTitle, publicDescription, conditionSummary, isPublicReady,
    } = body

    const updateData: Record<string, unknown> = {}
    if (customTitle !== undefined) updateData.customTitle = customTitle || null
    if (status !== undefined) updateData.status = status
    if (marketValue !== undefined) updateData.marketValue = marketValue ? parseFloat(marketValue) : null
    if (listingPrice !== undefined) updateData.listingPrice = listingPrice ? parseFloat(listingPrice) : null
    if (targetNetProceeds !== undefined) updateData.targetNetProceeds = targetNetProceeds ? parseFloat(targetNetProceeds) : null
    if (platformFeePercent !== undefined) updateData.platformFeePercent = platformFeePercent ? parseFloat(platformFeePercent) : null
    if (paymentFeePercent !== undefined) updateData.paymentFeePercent = paymentFeePercent ? parseFloat(paymentFeePercent) : null
    if (paymentFeeFixed !== undefined) updateData.paymentFeeFixed = paymentFeeFixed ? parseFloat(paymentFeeFixed) : null
    if (shippingCost !== undefined) updateData.shippingCost = shippingCost ? parseFloat(shippingCost) : null
    if (promotedPercent !== undefined) updateData.promotedPercent = promotedPercent ? parseFloat(promotedPercent) : null
    if (suggestedListingPrice !== undefined) updateData.suggestedListingPrice = suggestedListingPrice ? parseFloat(suggestedListingPrice) : null
    if (pricingNotes !== undefined) updateData.pricingNotes = pricingNotes || null
    if (publicTitle !== undefined) updateData.publicTitle = publicTitle || null
    if (publicDescription !== undefined) updateData.publicDescription = publicDescription || null
    if (conditionSummary !== undefined) updateData.conditionSummary = conditionSummary || null
    if (isPublicReady !== undefined) updateData.isPublicReady = Boolean(isPublicReady)

    const item = await prisma.inventoryItem.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ item })
  } catch (error) {
    console.error('PATCH /api/items/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await prisma.inventoryItem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/items/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}
