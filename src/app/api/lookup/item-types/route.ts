import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const itemTypes = await prisma.itemType.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json({ itemTypes })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch item types' }, { status: 500 })
  }
}
