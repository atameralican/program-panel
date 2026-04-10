import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'


export async function GET(
  req: Request,
  { params }: { params: Promise<{ programId: string }> }
) {
  const supabase = await createSupabaseServerClient(); 
  const { programId } = await params;
  const numericId = Number(programId);

  const { data, error } = await supabase
    .from('program_time_slot')
    .select(`time_slot_id`)
    .eq("program_id", numericId); 
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 200 })
}   