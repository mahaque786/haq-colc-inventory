import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSKU } from '@/lib/sku'
import { generateTitle } from '@/lib/title-generator'
import { calculateSuggestedListingPrice } from '@/lib/pricing'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortDir = (searchParams.get('sortDir') || 'desc') as 'asc' | 'desc'
    const limit = parseInt(searchParams.get('limit') || '100')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}
    if (status) where.status = status
    if (type) where.itemTypeCode = type
    if (search) {
      where.OR = [
        { sku: { contains: search, mode: 'insensitive' } },
        { suggestedTitle: { contains: search, mode: 'insensitive' } },
        { customTitle: { contains: search, mode: 'insensitive' } },
      ]
    }

    const allowedSortFields = ['createdAt', 'updatedAt', 'sku', 'marketValue', 'listingPrice', 'status']
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt'

    const items = await prisma.inventoryItem.findMany({
      where,
      orderBy: { [safeSortBy]: sortDir },
      take: limit,
      select: {
        id: true,
        sku: true,
        itemTypeCode: true,
        suggestedTitle: true,
        customTitle: true,
        status: true,
        marketValue: true,
        listingPrice: true,
        suggestedListingPrice: true,
        isPublicReady: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('GET /api/items error:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemTypeCode, ...rest } = body

    if (!itemTypeCode) {
      return NextResponse.json({ error: 'itemTypeCode is required' }, { status: 400 })
    }

    const sku = generateSKU(itemTypeCode)

    const item = await prisma.inventoryItem.create({
      data: {
        sku,
        itemTypeCode,
        status: 'DRAFT',
        ...rest,
      },
    })

    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    console.error('POST /api/items error:', error)
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}
