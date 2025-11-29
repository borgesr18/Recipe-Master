import { createClient } from '@/lib/supabase/server'
import SubRecipeForm from '@/components/forms/sub-recipe-form'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { addIngredientToSubRecipe, removeIngredientFromSubRecipe } from '@/app/(dashboard)/receitas/[id]/subreceitas/actions'

export default async function EditSubRecipePage({ params }: { params: { id: string, subid: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: subRecipe } = await supabase
        .from('sub_recipes')
        .select('*')
        .eq('id', params.subid)
        .single()

    if (!subRecipe) notFound()

    const { data: ingredients } = await supabase
        .from('ingredients')
        .select('*')
        .eq('company_id', subRecipe.company_id)
        .order('name')

    const { data: subRecipeIngredients } = await supabase
        .from('sub_recipe_ingredients')
        .select('*, ingredients(*)')
        .eq('sub_recipe_id', subRecipe.id)

    return (
        <div className="space-y-8">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Editar Sub-receita</h1>
                </div>
                <div className="rounded-md border bg-white p-6">
                    <SubRecipeForm recipeId={params.id} initialData={subRecipe} isEditing />
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Ingredientes</h2>

                <div className="rounded-md border bg-white p-6">
                    <form action={addIngredientToSubRecipe.bind(null, params.id, params.subid)} className="flex gap-4 items-end mb-6">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Insumo</label>
                            <Select name="ingredient_id" required>
                                <option value="">Selecione...</option>
                                {ingredients?.map((ing) => (
                                    <option key={ing.id} value={ing.id}>{ing.name}</option>
                                ))}
                            </Select>
                        </div>
                        <div className="w-32">
                            <label className="block text-sm font-medium mb-1">Qtd.</label>
                            <Input type="number" step="0.001" name="usage_quantity" required placeholder="0" />
                        </div>
                        <div className="w-32">
                            <label className="block text-sm font-medium mb-1">Unidade</label>
                            <Select name="usage_unit" required defaultValue="g">
                                <option value="g">g</option>
                                <option value="kg">kg</option>
                                <option value="ml">ml</option>
                                <option value="l">l</option>
                                <option value="unit">un</option>
                            </Select>
                        </div>
                        <div className="flex items-center pb-3 gap-2">
                            <input type="checkbox" name="use_correction_factor" id="use_fc" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                            <label htmlFor="use_fc" className="text-sm">Usar FC?</label>
                        </div>
                        <Button type="submit">Adicionar</Button>
                    </form>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ingrediente</TableHead>
                                <TableHead>Qtd. Uso</TableHead>
                                <TableHead>FC Aplicado?</TableHead>
                                <TableHead>Custo</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subRecipeIngredients?.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.ingredients?.name}</TableCell>
                                    <TableCell>{item.usage_quantity} {item.usage_unit}</TableCell>
                                    <TableCell>{item.use_correction_factor ? 'Sim' : 'Não'}</TableCell>
                                    <TableCell>{formatCurrency(item.total_cost || 0)}</TableCell>
                                    <TableCell>
                                        <form action={removeIngredientFromSubRecipe.bind(null, params.id, params.subid, item.id)}>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {subRecipeIngredients?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        Nenhum ingrediente adicionado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
