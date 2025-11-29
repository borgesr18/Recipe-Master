'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createRecipe(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()

    if (!profile?.company_id) throw new Error('No company associated')

    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const cake_type = formData.get('cake_type') as string
    const description = formData.get('description') as string
    const base_weight_grams = parseFloat(formData.get('base_weight_grams') as string)
    const yield_portions = parseInt(formData.get('yield_portions') as string)
    const oven_time_min = parseInt(formData.get('oven_time_min') as string)
    const oven_temp_c = parseInt(formData.get('oven_temp_c') as string)
    const difficulty_level = formData.get('difficulty_level') as string
    const general_preparation_method = formData.get('general_preparation_method') as string

    const { data: recipe, error } = await supabase.from('recipes').insert({
        company_id: profile.company_id,
        name,
        category,
        cake_type,
        description,
        base_weight_grams,
        yield_portions,
        oven_time_min,
        oven_temp_c,
        difficulty_level,
        general_preparation_method,
    }).select().single()

    if (error) {
        console.error(error)
        throw new Error('Failed to create recipe')
    }

    revalidatePath('/receitas')
    redirect(`/receitas/${recipe.id}`)
}

export async function updateRecipe(id: string, formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()

    if (!profile?.company_id) throw new Error('No company associated')

    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const cake_type = formData.get('cake_type') as string
    const description = formData.get('description') as string
    const base_weight_grams = parseFloat(formData.get('base_weight_grams') as string)
    const yield_portions = parseInt(formData.get('yield_portions') as string)
    const oven_time_min = parseInt(formData.get('oven_time_min') as string)
    const oven_temp_c = parseInt(formData.get('oven_temp_c') as string)
    const difficulty_level = formData.get('difficulty_level') as string
    const general_preparation_method = formData.get('general_preparation_method') as string

    const { error } = await supabase.from('recipes').update({
        name,
        category,
        cake_type,
        description,
        base_weight_grams,
        yield_portions,
        oven_time_min,
        oven_temp_c,
        difficulty_level,
        general_preparation_method,
        updated_at: new Date().toISOString(),
    }).eq('id', id).eq('company_id', profile.company_id)

    if (error) {
        console.error(error)
        throw new Error('Failed to update recipe')
    }

    revalidatePath('/receitas')
    revalidatePath(`/receitas/${id}`)
}

export async function deleteRecipe(id: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase.from('recipes').delete().eq('id', id)

    if (error) {
        throw new Error('Failed to delete recipe')
    }

    revalidatePath('/receitas')
}
