import RecipeForm from '@/components/forms/recipe-form'

export default function NewRecipePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Nova Receita</h1>
            </div>
            <div className="rounded-md border bg-white p-6">
                <RecipeForm />
            </div>
        </div>
    )
}
