import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'



export async function GET(
  req: Request,
  context: { params: Promise<{ classroomId: string; periodId: string }> }
) {
  const { classroomId, periodId } = await context.params;  
if (!classroomId||classroomId === "undefined" ||classroomId === "null" ) {
    return NextResponse.json([], { status: 200 });
  }
  const supabase = await createSupabaseServerClient();

  const numericClass = Number(classroomId);
  const numericPeriod = Number(periodId);

  const { data, error } = await supabase
    .from("schedule")
    .select("id,time_slot_id")
    .eq("classroom_id", numericClass)
    .eq("period_id", numericPeriod);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}