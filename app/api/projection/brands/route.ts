

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'

export async function GET(req: Request) {
  const supabase = await createSupabaseServerClient() // ← içeri taşı

  const { data, error } = await supabase
    .from('projections')
    .select('*')
    .eq('active', true)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || null)
}