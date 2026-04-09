import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'


export async function GET(
  req: Request,
  { params }: { params: Promise<{ periodId: string }> }
) {
  const supabase = await createSupabaseServerClient(); 
  const { periodId } = await params;
  const numericId = Number(periodId);

  const { data, error } = await supabase
    .from('schedule')
    .select(`*`)
    .eq("period_id", numericId); 
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 200 })
}   