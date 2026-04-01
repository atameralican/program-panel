import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'

export const dynamic = 'force-static'
export const revalidate = false // sonsuza kadar cache'le hiç değişmeyen veri. 

export async function GET() {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
        .from('time_slots')
        .select(`*`)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || null, {
        headers: {
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    })
}



