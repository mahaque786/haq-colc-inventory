import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const notes = await prisma.itemNote.findMany({
      where: { itemId: params.id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ notes })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { noteType, body: noteBody, isPublic } = body

    if (!noteType || !noteBody) return NextResponse.json({ error: 'noteType and body are required' }, { status: 400 })

    const note = await prisma.itemNote.create({
      data: {
        itemId: params.id,
        noteType,
        body: noteBody,
        isPublic: isPublic ?? false,
      },
    })
    return NextResponse.json({ note }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}
