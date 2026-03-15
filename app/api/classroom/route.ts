import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'

//get
export async function GET(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('classrooms')
    .select(`*, projections(*)`)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data || null)
}

//insert
export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { id, ...body } = await req.json()
  const { data, error } = await supabase
    .from("classrooms")
    .insert(body)
    .select()
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}

//update
export async function PUT(req: Request) {
  const supabase = await createSupabaseServerClient();
  const { id, ...body } = await req.json();
  const { data, error } = await supabase
    .from("classrooms")
    .update(body)
    .eq("id", id)
    .select()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}

//delete
export async function DELETE(req: Request) {
  const supabase = await createSupabaseServerClient()
  const body = await req.json()
  const { id } = body
  const { data, error } = await supabase
    .from('classrooms')
    .delete()
    .eq("id", id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}