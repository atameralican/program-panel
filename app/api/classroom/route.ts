import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'

export async function GET(req: Request) {
  const supabase = await createSupabaseServerClient() // ← içeri taşı

  const { data, error } = await supabase
    .from('classrooms')
    .select(`*, projections(*)`)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || null)
}

export async function POST(req:Request) {
    const supabase=await createSupabaseServerClient()
    const body=req.json()

    const {data,error}=await supabase
    .from("classrooms")
    .insert(body)
    .select()
    .single()

    if (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
    
    return NextResponse.json(data,{status:201})
}