// src/app/api/download/[token]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params
  const supabase = createAdminClient()

  // Look up the download token
  const { data: dlToken, error } = await supabase
    .from('download_tokens')
    .select(`
      *,
      order_items (
        beat_id,
        license_tier,
        beat_title
      )
    `)
    .eq('token', token)
    .single()

  if (error || !dlToken) {
    return NextResponse.json({ error: 'Invalid download link' }, { status: 404 })
  }

  // Check expiry
  if (new Date(dlToken.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Download link has expired' }, { status: 410 })
  }

  // Check max downloads
  if (dlToken.download_count >= dlToken.max_downloads) {
    return NextResponse.json({ error: 'Download limit reached' }, { status: 403 })
  }

  // Get file from secure storage
  const orderItem = dlToken.order_items
  const storagePath = `${orderItem.beat_id}/${orderItem.license_tier}`

  const { data: files } = await supabase.storage
    .from('beat-files')
    .list(storagePath)

  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'Files not found' }, { status: 404 })
  }

  // Generate signed URL (1 hour expiry)
  const { data: signedUrl } = await supabase.storage
    .from('beat-files')
    .createSignedUrl(`${storagePath}/${files[0].name}`, 3600)

  if (!signedUrl) {
    return NextResponse.json({ error: 'Could not generate download link' }, { status: 500 })
  }

  // Increment download count
  await supabase
    .from('download_tokens')
    .update({ download_count: dlToken.download_count + 1 })
    .eq('id', dlToken.id)

  // Redirect to signed URL
  return NextResponse.redirect(signedUrl.signedUrl)
}
