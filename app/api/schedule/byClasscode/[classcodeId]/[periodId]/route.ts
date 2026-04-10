import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'



export async function GET(
  req: Request,
  context: { params: Promise<{ classcodeId: string; periodId: string }> }
) {
  const { classcodeId, periodId } = await context.params;  

  const supabase = await createSupabaseServerClient();

  const numericClass = Number(classcodeId);
  const numericPeriod = Number(periodId);

  const { data, error } = await supabase
    .from("schedule")
    .select("id,time_slot_id,teachers(id,name),classrooms(id,name)")
    .eq("classcode_id", numericClass)
    .eq("period_id", numericPeriod);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}