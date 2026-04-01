import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'


export async function GET(req: Request) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('modules')
        .select(`*,programs(name)`)
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data, { status: 200 })

}


export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();
    const { id, ...body } = await req.json();
    const { data, error } = await supabase
        .from('modules')
        .insert(body)
        .single()
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({message: "Saved!"}, { status: 201 })
}



//UPDATE 
export async function PUT(req: Request) {
  const supabase = await createSupabaseServerClient()
    const { id, ...body } = await req.json();

  const { data, error } = await supabase
    .from("modules")
    .update(body)
    .eq("id", id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({message: "Updated!"}, { status: 201 })
}

//DELETE
export async function DELETE(req: Request) {
  const supabase = await createSupabaseServerClient()
  // const body = await req.json()
  const { id, ...body } = await req.json();
  const { data, error } = await supabase
    .from('modules')
    .delete()
    .eq("id", id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({message: "Deleted!"}, { status: 201 })
}
