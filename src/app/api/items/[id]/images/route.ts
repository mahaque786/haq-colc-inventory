import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const images = await prisma.itemImage.findMany({
      where: { itemId: id },
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json({ images })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { slotKey, label, storageUrl, storagePath, isPrimary, sortOrder, visibility, caption } = body

    const image = await prisma.itemImage.create({
      data: {
        itemId: id,
        slotKey,
        label,
        storageUrl,
        storagePath,
        isPrimary: isPrimary ?? false,
        sortOrder: sortOrder ?? 0,
        visibility: visibility ?? 'BOTH',
        caption,
      },
    })
    return NextResponse.json({ image }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create image' }, { status: 500 })
  }
}
