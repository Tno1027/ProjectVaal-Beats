// src/app/api/beats/[id]/play/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient()

  await supabase.rpc('increment_play_count', { beat_id: params.id })
    .catch(() => {
      // Fallback if RPC not set up yet
      supabase
        .from('beats')
        .select('play_count')
        .eq('id', params.id)
        .single()
        .then(({ data }) => {
          if (data) {
            supabase
              .from('beats')
              .update({ play_count: data.play_count + 1 })
              .eq('id', params.id)
          }
        })
    })

  return NextResponse.json({ ok: true })
}
