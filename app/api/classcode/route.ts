import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'


export async function GET(req: Request) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('classcodes')
        .select(`*,modules(id,code)`)
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data, { status: 200 })
}

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();
    const { id, ...body } = await req.json();
    const { data, error } = await supabase
        .from('classcodes')
        .insert(body)
        .select('id,full_name')
        .single()
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({message: "Saved!",...data}, { status: 201 })
}


export async function PUT(req:Request){
    const supabase =await createSupabaseServerClient();
    const {id,...body}=await req.json();
    const {data,error}=await supabase
    .from('classcodes')
    .update(body)
    .select()
    .eq('id',id)
    .single()
    if (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
    return NextResponse.json({message:'Updated!',...data},{status:200})   
}

export async function DELETE(req:Request){
    const supabase =await createSupabaseServerClient();
    const {id,...body}=await req.json();
    const {data,error}=await supabase
    .from('classcodes')
    .delete()
    .eq('id',id)
    .single()
    if (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
    return NextResponse.json({message:'Deleted!'},{status:200})   
}