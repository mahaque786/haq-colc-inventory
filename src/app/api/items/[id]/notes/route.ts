import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const notes = await prisma.itemNote.findMany({
      where: { itemId: id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ notes })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { noteType, body: noteBody, isPublic } = body

    if (!noteType || !noteBody) return NextResponse.json({ error: 'noteType and body are required' }, { status: 400 })

    const note = await prisma.itemNote.create({
      data: {
        itemId: id,
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
