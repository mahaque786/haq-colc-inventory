import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const sealedProductTypes = await prisma.sealedProductType.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json({ sealedProductTypes })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sealed product types' }, { status: 500 })
  }
}
