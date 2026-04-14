import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();
    const body = await req.json(); // direkt array geliyor, destructure etme
    
    const { data, error } = await supabase
        .from('schedule')
        .insert(body)       // array'i direkt geçebilirsin
        .select()           // .single() kaldırıldı
    
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
        { message: `${data.length} kayıt eklendi!`, data }, 
        { status: 201 }
    )
}