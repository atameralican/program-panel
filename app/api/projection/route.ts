

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'

export async function GET(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('projections')
    .select(`*`)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || null)
}



export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  // const body = await req.json()
  const { id, ...body } = await req.json();//id null da gelse göndermemesi için
  const { data, error } = await supabase
    .from('projections')
    .insert(body) // Body içinde tablo sütunlarına uygun veri gelmeli
    .select()//kaydedileni dönmesi için
    .single()//tek veri kaydedildiğinden dolayı array içinde değil tek object olarak gönderir. 

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: Request) {
  const supabase = await createSupabaseServerClient()
  // const body = await req.json()
  const body = await req.json()
  const { id } = body
  const { data, error } = await supabase
    .from('projections')
    .delete()
    .eq("id", id)// sadece id göndermek yeterli 

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

export async function PUT(req: Request) {
  const supabase = await createSupabaseServerClient()
  const body = await req.json()
  const { id, ...updateData } = body
  const { data, error } = await supabase
    .from("projections")
    .update(updateData)
    .eq("id", id)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

