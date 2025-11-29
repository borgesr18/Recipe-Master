'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPrintTemplate(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()

    if (!profile?.company_id) throw new Error('No company associated')

    const name = formData.get('name') as string
    const type = formData.get('type') as string

    const config_json = {
        show_costs: formData.get('show_costs') === 'on',
        show_logo: formData.get('show_logo') === 'on',
        show_preparation: formData.get('show_preparation') === 'on',
        show_ingredients: formData.get('show_ingredients') === 'on',
    }

    const { error } = await supabase.from('print_templates').insert({
        company_id: profile.company_id,
        name,
        type,
        config_json,
    })

    if (error) {
        console.error(error)
        throw new Error('Failed to create template')
    }

    revalidatePath('/templates-impressao')
    redirect('/templates-impressao')
}

export async function deletePrintTemplate(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase.from('print_templates').delete().eq('id', id)

    if (error) {
        throw new Error('Failed to delete template')
    }

    revalidatePath('/templates-impressao')
}
