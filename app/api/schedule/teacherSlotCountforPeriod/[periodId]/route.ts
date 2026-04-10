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
  .rpc('get_teacher_lesson_counts', { p_period_id: numericId });

    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 200 })
}   
    
/**
 RPC sql kodu
CREATE OR REPLACE FUNCTION get_teacher_lesson_counts(p_period_id integer)
RETURNS TABLE(teacher_id integer, lesson_count bigint) AS $$
  SELECT teacher_id, COUNT(*) as lesson_count
  FROM schedule
  WHERE period_id = p_period_id
  GROUP BY teacher_id;
$$ LANGUAGE sql;
 */