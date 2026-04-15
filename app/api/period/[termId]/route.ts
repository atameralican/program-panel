import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'


export async function GET(
  req: Request,
  { params }: { params: Promise<{ termId: string }> }
) {
  const supabase = await createSupabaseServerClient(); 
  const { termId } = await params;
  const numericId = Number(termId);

  const { data, error } = await supabase
    .from('period')
    .select(`id,name`)
    .eq("term_id", numericId); 
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 200 })
}   