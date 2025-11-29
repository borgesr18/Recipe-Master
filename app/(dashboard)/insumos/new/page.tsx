import IngredientForm from '@/components/forms/ingredient-form'

export default function NewIngredientPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Novo Insumo</h1>
            </div>
            <div className="rounded-md border bg-white p-6">
                <IngredientForm />
            </div>
        </div>
    )
}
