import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const pricingPlatforms = await prisma.pricingPlatform.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json({ pricingPlatforms })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pricing platforms' }, { status: 500 })
  }
}
