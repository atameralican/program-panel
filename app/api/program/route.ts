import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'

//INSERT
export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient()
    const { timeSlots, ...body } = await req.json();

    // Temel Validasyonlar ----START----
    if (!timeSlots || timeSlots.length === 0) {
        return NextResponse.json({ error: "Seçilen saat sayısı geçersiz!" }, { status: 400 })
    }

    if (!body.name || !body.code || !body?.max_limit || body.max_limit < 1) {
        return NextResponse.json({ error: "Gerekli alanlar eksik!" }, { status: 400 })
    }
    
    // 1. program kaydetme
    const { data: progData, error } = await supabase
        .from('programs')
        .insert(body) // Body içinde tablo sütunlarına uygun veri gelmeli
        .select()//kaydedileni dönmesi için
        .single()//tek veri kaydedildiğinden dolayı array içinde değil tek object olarak gönderir. 
    if (error) {
        return NextResponse.json({ error: `Program kaydedilemedi: ${error.message}` }, { status: 500 })
    }

    // 2. TimeSlots kaydetme
    const timeSlotRows = timeSlots.map((timeSlotId: number) => ({
        program_id: progData.id,
        time_slot_id: timeSlotId,
    }))
    const { data, error: timeSlotsError } = await supabase
        .from('program_time_slot')
        .insert(timeSlotRows)
        .select()
    if (timeSlotsError) {
        return NextResponse.json({ error: `Saatler kaydedilemedi: ${timeSlotsError.message}` }, { status: 500 })
    }

    //Kayıt sonrası dönülen MESSAGE
    return NextResponse.json({ message: "Kayıt Başarılı" }, { status: 201 })

}

/**
 * İlk başta programı kaydediyoruz program kaydedilip hata vermez ise oluşan id ile time slotları kaydediyoruz. 
 */