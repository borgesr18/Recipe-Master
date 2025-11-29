import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { deleteIngredient, createIngredient, updateIngredient } from './actions'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import IngredientForm from '@/components/forms/ingredient-form'

export default async function IngredientsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: ingredients } = await supabase
        .from('ingredients')
        .select('*')
        .eq('company_id', (await supabase.from('profiles').select('company_id').eq('id', user.id).single()).data?.company_id)
        .order('name')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Insumos</h1>
                    <p className="text-muted-foreground">Gerencie os ingredientes usados nas suas receitas.</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Novo Insumo
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Novo Insumo</DialogTitle>
                            <DialogDescription>
                                Adicione um novo ingrediente ao seu estoque.
                            </DialogDescription>
                        </DialogHeader>
                        <IngredientForm action={createIngredient} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                        <tr>
                            <th className="px-4 py-3">Nome</th>
                            <th className="px-4 py-3">Categoria</th>
                            <th className="px-4 py-3">Embalagem</th>
                            <th className="px-4 py-3">Preço</th>
                            <th className="px-4 py-3">Custo Unitário</th>
                            <th className="px-4 py-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {ingredients?.map((ingredient) => (
                            <tr key={ingredient.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{ingredient.name}</td>
                                <td className="px-4 py-3 text-gray-500">{ingredient.category || '-'}</td>
                                <td className="px-4 py-3">
                                    {ingredient.quantity_per_package} {ingredient.purchase_unit}
                                </td>
                                <td className="px-4 py-3">{formatCurrency(ingredient.package_price)}</td>
                                <td className="px-4 py-3 text-gray-500">
                                    {ingredient.cost_per_gram && `${formatCurrency(ingredient.cost_per_gram)}/g`}
                                    {ingredient.cost_per_ml && `${formatCurrency(ingredient.cost_per_ml)}/ml`}
                                    {ingredient.cost_per_unit && `${formatCurrency(ingredient.cost_per_unit)}/un`}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[600px]">
                                                <DialogHeader>
                                                    <DialogTitle>Editar Insumo</DialogTitle>
                                                    <DialogDescription>
                                                        Atualize os dados do ingrediente.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <IngredientForm
                                                    action={updateIngredient.bind(null, ingredient.id)}
                                                    defaultValues={ingredient}
                                                />
                                            </DialogContent>
                                        </Dialog>

                                        <form action={deleteIngredient.bind(null, ingredient.id)}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {ingredients?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                    Nenhum insumo cadastrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
