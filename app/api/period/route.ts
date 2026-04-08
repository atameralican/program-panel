import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'


export async function GET(req: Request) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('period')
        .select(`*,term(*)`)
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data, { status: 200 })
}