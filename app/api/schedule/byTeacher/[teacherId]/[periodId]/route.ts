import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'



export async function GET(
  req: Request,
  context: { params: Promise<{ teacherId: string; periodId: string }> }
) {
  const { teacherId, periodId } = await context.params;  
if (!teacherId||teacherId === "undefined" ||teacherId === "null" ) {
    return NextResponse.json([], { status: 200 });
  }
  const supabase = await createSupabaseServerClient();

  const numericClass = Number(teacherId);
  const numericPeriod = Number(periodId);

  const { data, error } = await supabase
    .from("schedule")
    .select("id,time_slot_id,classrooms(id,name),classcodes(id,name)")
    .eq("teacher_id", numericClass)
    .eq("period_id", numericPeriod);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}