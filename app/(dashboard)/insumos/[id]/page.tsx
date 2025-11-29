import { createClient } from '@/lib/supabase/server'
import IngredientForm from '@/components/forms/ingredient-form'
import { notFound } from 'next/navigation'

export default async function EditIngredientPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: ingredient } = await supabase
        .from('ingredients')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!ingredient) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Editar Insumo</h1>
            </div>
            <div className="rounded-md border bg-white p-6">
                <IngredientForm initialData={ingredient} isEditing />
            </div>
        </div>
    )
}
