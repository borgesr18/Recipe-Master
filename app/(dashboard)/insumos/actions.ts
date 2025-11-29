'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createIngredient(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()

    if (!profile?.company_id) {
        throw new Error('No company associated')
    }

    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const purchase_unit = formData.get('purchase_unit') as string
    const quantity_per_package = parseFloat(formData.get('quantity_per_package') as string)
    const package_price = parseFloat(formData.get('package_price') as string)
    const correction_factor = parseFloat(formData.get('correction_factor') as string) || 1.0

    // Calculate costs
    let cost_per_gram = null
    let cost_per_ml = null
    let cost_per_unit = null

    if (purchase_unit === 'kg') {
        cost_per_gram = package_price / (quantity_per_package * 1000)
    } else if (purchase_unit === 'g') {
        cost_per_gram = package_price / quantity_per_package
    } else if (purchase_unit === 'l') {
        cost_per_ml = package_price / (quantity_per_package * 1000)
    } else if (purchase_unit === 'ml') {
        cost_per_ml = package_price / quantity_per_package
    } else if (purchase_unit === 'unit') {
        cost_per_unit = package_price / quantity_per_package
    }

    const { data: ingredient, error } = await supabase.from('ingredients').insert({
        company_id: profile.company_id,
        name,
        category,
        purchase_unit: purchase_unit as any,
        quantity_per_package,
        package_price,
        cost_per_gram,
        cost_per_ml,
        cost_per_unit,
        correction_factor,
    }).select().single()

    if (error) {
        console.error(error)
        throw new Error('Failed to create ingredient')
    }

    // Add price history
    await supabase.from('ingredient_price_history').insert({
        company_id: profile.company_id,
        ingredient_id: ingredient.id,
        new_price: package_price,
        user_id: user.id
    })

    revalidatePath('/insumos')
    redirect('/insumos')
}

export async function updateIngredient(id: string, formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()

    if (!profile?.company_id) {
        throw new Error('No company associated')
    }

    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const purchase_unit = formData.get('purchase_unit') as string
    const quantity_per_package = parseFloat(formData.get('quantity_per_package') as string)
    const package_price = parseFloat(formData.get('package_price') as string)
    const correction_factor = parseFloat(formData.get('correction_factor') as string) || 1.0

    // Calculate costs
    let cost_per_gram = null
    let cost_per_ml = null
    let cost_per_unit = null

    if (purchase_unit === 'kg') {
        cost_per_gram = package_price / (quantity_per_package * 1000)
    } else if (purchase_unit === 'g') {
        cost_per_gram = package_price / quantity_per_package
    } else if (purchase_unit === 'l') {
        cost_per_ml = package_price / (quantity_per_package * 1000)
    } else if (purchase_unit === 'ml') {
        cost_per_ml = package_price / quantity_per_package
    } else if (purchase_unit === 'unit') {
        cost_per_unit = package_price / quantity_per_package
    }

    // Check old price for history
    const { data: oldIngredient } = await supabase.from('ingredients').select('package_price').eq('id', id).single()

    const { error } = await supabase.from('ingredients').update({
        name,
        category,
        purchase_unit: purchase_unit as any,
        quantity_per_package,
        package_price,
        cost_per_gram,
        cost_per_ml,
        cost_per_unit,
        correction_factor,
        updated_at: new Date().toISOString(),
    }).eq('id', id).eq('company_id', profile.company_id)

    if (error) {
        console.error(error)
        throw new Error('Failed to update ingredient')
    }

    if (oldIngredient && oldIngredient.package_price !== package_price) {
        await supabase.from('ingredient_price_history').insert({
            company_id: profile.company_id,
            ingredient_id: id,
            old_price: oldIngredient.package_price,
            new_price: package_price,
            user_id: user.id
        })
    }

    revalidatePath('/insumos')
    redirect('/insumos')
}

export async function deleteIngredient(id: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase.from('ingredients').delete().eq('id', id)

    if (error) {
        throw new Error('Failed to delete ingredient')
    }

    revalidatePath('/insumos')
}
