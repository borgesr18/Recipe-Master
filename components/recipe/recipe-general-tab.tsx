'use client'

import RecipeForm from '@/components/forms/recipe-form'

export default function RecipeGeneralTab({ recipe }: { recipe: any }) {
    return <RecipeForm initialData={recipe} isEditing />
}
