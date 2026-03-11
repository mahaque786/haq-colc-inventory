import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const references = await prisma.itemReference.findMany({
      where: { itemId: params.id },
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json({ references })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch references' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { refType, label, url, value, notes, sortOrder } = body

    if (!refType) return NextResponse.json({ error: 'refType is required' }, { status: 400 })

    const reference = await prisma.itemReference.create({
      data: {
        itemId: params.id,
        refType,
        label,
        url,
        value,
        notes,
        sortOrder: sortOrder ?? 0,
      },
    })
    return NextResponse.json({ reference }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create reference' }, { status: 500 })
  }
}
