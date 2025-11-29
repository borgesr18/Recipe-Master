'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createSubRecipe(recipeId: string, formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()

    if (!profile?.company_id) throw new Error('No company associated')

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const description = formData.get('description') as string
    const preparation_method = formData.get('preparation_method') as string

    const { data: subRecipe, error } = await supabase.from('sub_recipes').insert({
        company_id: profile.company_id,
        recipe_id: recipeId,
        name,
        type,
        description,
        preparation_method,
    }).select().single()

    if (error) {
        console.error(error)
        throw new Error('Failed to create sub-recipe')
    }

    revalidatePath(`/receitas/${recipeId}`)
    redirect(`/receitas/${recipeId}/subreceitas/${subRecipe.id}`)
}

export async function updateSubRecipe(recipeId: string, subRecipeId: string, formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()

    if (!profile?.company_id) throw new Error('No company associated')

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const description = formData.get('description') as string
    const preparation_method = formData.get('preparation_method') as string

    const { error } = await supabase.from('sub_recipes').update({
        name,
        type,
        description,
        preparation_method,
        updated_at: new Date().toISOString(),
    }).eq('id', subRecipeId).eq('company_id', profile.company_id)

    if (error) {
        console.error(error)
        throw new Error('Failed to update sub-recipe')
    }

    revalidatePath(`/receitas/${recipeId}`)
    revalidatePath(`/receitas/${recipeId}/subreceitas/${subRecipeId}`)
}

export async function addIngredientToSubRecipe(recipeId: string, subRecipeId: string, formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()

    if (!profile?.company_id) throw new Error('No company associated')

    const ingredient_id = formData.get('ingredient_id') as string
    const usage_quantity = parseFloat(formData.get('usage_quantity') as string)
    const usage_unit = formData.get('usage_unit') as string
    const use_correction_factor = formData.get('use_correction_factor') === 'on'

    // Calculate cost
    const { data: ingredient } = await supabase.from('ingredients').select('*').eq('id', ingredient_id).single()

    if (!ingredient) throw new Error('Ingredient not found')

    let quantity_to_cost = usage_quantity

    // Apply correction factor if needed
    if (use_correction_factor) {
        quantity_to_cost = usage_quantity * ingredient.correction_factor
    }

    let total_cost = 0

    // Normalize to gram/ml/unit cost
    if (usage_unit === 'kg') {
        total_cost = quantity_to_cost * 1000 * (ingredient.cost_per_gram || 0)
    } else if (usage_unit === 'g') {
        total_cost = quantity_to_cost * (ingredient.cost_per_gram || 0)
    } else if (usage_unit === 'l') {
        total_cost = quantity_to_cost * 1000 * (ingredient.cost_per_ml || 0)
    } else if (usage_unit === 'ml') {
        total_cost = quantity_to_cost * (ingredient.cost_per_ml || 0)
    } else if (usage_unit === 'unit') {
        total_cost = quantity_to_cost * (ingredient.cost_per_unit || 0)
    }

    const { error } = await supabase.from('sub_recipe_ingredients').insert({
        company_id: profile.company_id,
        sub_recipe_id: subRecipeId,
        ingredient_id,
        usage_quantity,
        usage_unit,
        use_correction_factor,
        total_cost,
    })

    if (error) {
        console.error(error)
        throw new Error('Failed to add ingredient')
    }

    // Update sub-recipe total cost
    await updateSubRecipeCost(subRecipeId, profile.company_id)
    // Update recipe total cost
    await updateRecipeCost(recipeId, profile.company_id)

    revalidatePath(`/receitas/${recipeId}/subreceitas/${subRecipeId}`)
}

export async function removeIngredientFromSubRecipe(recipeId: string, subRecipeId: string, id: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')
    const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()

    await supabase.from('sub_recipe_ingredients').delete().eq('id', id)

    // Update costs
    await updateSubRecipeCost(subRecipeId, profile?.company_id)
    await updateRecipeCost(recipeId, profile?.company_id)

    revalidatePath(`/receitas/${recipeId}/subreceitas/${subRecipeId}`)
}

async function updateSubRecipeCost(subRecipeId: string, companyId: string) {
    const supabase = createClient()

    const { data: ingredients } = await supabase
        .from('sub_recipe_ingredients')
        .select('total_cost')
        .eq('sub_recipe_id', subRecipeId)

    const total = ingredients?.reduce((acc, curr) => acc + (curr.total_cost || 0), 0) || 0

    await supabase
        .from('sub_recipes')
        .update({ total_cost: total })
        .eq('id', subRecipeId)
}

async function updateRecipeCost(recipeId: string, companyId: string) {
    const supabase = createClient()

    const { data: subRecipes } = await supabase
        .from('sub_recipes')
        .select('total_cost')
        .eq('recipe_id', recipeId)

    const total = subRecipes?.reduce((acc, curr) => acc + (curr.total_cost || 0), 0) || 0

    // Also get packaging cost if any (not implemented yet fully but placeholder)

    await supabase
        .from('recipes')
        .update({ total_cost: total }) // Simplified, should include packaging
        .eq('id', recipeId)
}
