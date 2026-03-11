import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // This endpoint returns a storage path for Firebase Storage uploads.
    // The client uploads directly to Firebase Storage using the returned path.

    const body = await request.json()
    const { itemId, slotKey, fileName } = body

    if (!itemId || !fileName) {
      return NextResponse.json({ error: 'itemId and fileName are required' }, { status: 400 })
    }

    const storagePath = `inventory/${itemId}/${slotKey || 'misc'}/${Date.now()}-${fileName}`

    return NextResponse.json({ storagePath })
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
