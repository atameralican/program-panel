import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'


export async function GET(req: Request) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('teachers')
        .select(`*,selectionnable_classcode_by_teacher(*)`)
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data, { status: 200 })
}


export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();
    const { id, classcode_id,selectionnable_classcode_by_teacher,...body } = await req.json();
    const { data, error } = await supabase
        .from('teachers')
        .insert(body)
        .select()
        .single()
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (classcode_id) {
        const {  error: classcodeError } = await supabase
            .from('selectionnable_classcode_by_teacher')
            .insert({teacher_id:data.id,classcode_id:classcode_id})
            .single()
        if (classcodeError) {
            return NextResponse.json({ error: `Classcode kaydedilemedi: ${classcodeError.message}` }, { status: 500 })
        }
    }
    return NextResponse.json({message: "Saved!"}, { status: 201 })
}



//UPDATE 
export async function PUT(req: Request) {
  const supabase = await createSupabaseServerClient()
    const { id, classcode_id,selectionnable_classcode_by_teacher,...body } = await req.json();

  const { data, error } = await supabase
    .from("teachers")
    .update(body)
    .eq("id", id)
    .select()
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
   if (classcode_id) {
    // Önce o öğretmene ait tüm kayıtları siliyoruz (Duplicate önlemek için)
    await supabase
      .from('selectionnable_classcode_by_teacher')
      .delete()
      .eq('teacher_id', id);

    // Yeni olanı ekliyoruz
    const { error: classcodeError } = await supabase
      .from('selectionnable_classcode_by_teacher')
      .insert({ 
          teacher_id: id, 
          classcode_id: classcode_id 
      })

    if (classcodeError) {
        return NextResponse.json({ error: `Classcode kaydedilemedi: ${classcodeError.message}` }, { status: 500 })
    }
  }

  return NextResponse.json({message: "Updated!", data: data}, { status: 200 })
}

//DELETE
export async function DELETE(req: Request) {
  const supabase = await createSupabaseServerClient()
  // const body = await req.json()
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
