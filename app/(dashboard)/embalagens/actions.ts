'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPackaging(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()

    if (!profile?.company_id) throw new Error('No company associated')

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const capacity_grams = formData.get('capacity_grams') ? parseFloat(formData.get('capacity_grams') as string) : null
    const capacity_ml = formData.get('capacity_ml') ? parseFloat(formData.get('capacity_ml') as string) : null
    const package_price = parseFloat(formData.get('package_price') as string)
    const quantity_per_package = parseFloat(formData.get('quantity_per_package') as string)

    const cost_per_unit = package_price / quantity_per_package
    let cost_per_gram = null

    // Optional: calculate cost per gram if capacity is provided (e.g. for packaging that is part of the weight?)
    // Usually packaging cost is per unit. The prompt says "custo por grama, quando aplicável".
    // Maybe for things like plastic wrap? But for now let's stick to unit.

    const { error } = await supabase.from('packaging').insert({
        company_id: profile.company_id,
        name,
        type,
        capacity_grams,
        capacity_ml,
        package_price,
        quantity_per_package,
        cost_per_unit,
        cost_per_gram,
    })

    if (error) {
        console.error(error)
        throw new Error('Failed to create packaging')
    }

    revalidatePath('/embalagens')
    redirect('/embalagens')
}

export async function updatePackaging(id: string, formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()

    if (!profile?.company_id) throw new Error('No company associated')

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const capacity_grams = formData.get('capacity_grams') ? parseFloat(formData.get('capacity_grams') as string) : null
    const capacity_ml = formData.get('capacity_ml') ? parseFloat(formData.get('capacity_ml') as string) : null
    const package_price = parseFloat(formData.get('package_price') as string)
    const quantity_per_package = parseFloat(formData.get('quantity_per_package') as string)

    const cost_per_unit = package_price / quantity_per_package

    const { error } = await supabase.from('packaging').update({
        name,
        type,
        capacity_grams,
        capacity_ml,
        package_price,
        quantity_per_package,
        cost_per_unit,
        updated_at: new Date().toISOString(),
    }).eq('id', id).eq('company_id', profile.company_id)

    if (error) {
        console.error(error)
        throw new Error('Failed to update packaging')
    }

    revalidatePath('/embalagens')
    redirect('/embalagens')
}

export async function deletePackaging(id: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase.from('packaging').delete().eq('id', id)

    if (error) {
        throw new Error('Failed to delete packaging')
    }

    revalidatePath('/embalagens')
}
