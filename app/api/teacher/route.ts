import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'


export async function GET(req: Request) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('teachers')
        .select(`*,classcodes(id,full_name)`)
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data, { status: 200 })
}


export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();
    const { id, ...body } = await req.json();
    const { data, error } = await supabase
        .from('teachers')
        .insert(body)
        .select()
        .single()
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({message: "Saved!",...data}, { status: 201 })
}



//UPDATE 
export async function PUT(req: Request) {
  const supabase = await createSupabaseServerClient()
    const { id, ...body } = await req.json();

  const { data, error } = await supabase
    .from("teachers")
    .update(body)
    .eq("id", id)
    .select()
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({message: "Updated!", ...data}, { status: 200 })
}

//DELETE
export async function DELETE(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { id, ...body } = await req.json();
  const { data, error } = await supabase
    .from('teachers')
    .delete()
    .eq("id", id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({message: "Deleted!"}, { status: 201 })
}
