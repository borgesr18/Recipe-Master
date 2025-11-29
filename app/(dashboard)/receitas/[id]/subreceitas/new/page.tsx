import SubRecipeForm from '@/components/forms/sub-recipe-form'

export default function NewSubRecipePage({ params }: { params: { id: string } }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Nova Sub-receita</h1>
            </div>
            <div className="rounded-md border bg-white p-6">
                <SubRecipeForm recipeId={params.id} />
            </div>
        </div>
    )
}
