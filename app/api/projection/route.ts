import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'
/**GET */
export async function GET(req: Request) {
  const { data, error } = await supabaseAdmin
    .from('projections')
    .select('*')


  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || null, {
  })
}