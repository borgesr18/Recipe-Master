import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { deleteRecipe } from './actions'

export default async function RecipesPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()

    const { data: recipes } = await supabase
        .from('recipes')
        .select('*')
        .eq('company_id', profile?.company_id)
        .order('name')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Receitas</h1>
                <Button asChild>
                    <Link href="/receitas/new">
                        <Plus className="mr-2 h-4 w-4" /> Nova Receita
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Peso Base</TableHead>
                            <TableHead>Custo Total</TableHead>
                            <TableHead>Preço Sugerido</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recipes?.map((recipe) => (
                            <TableRow key={recipe.id}>
                                <TableCell className="font-medium">{recipe.name}</TableCell>
                                <TableCell>{recipe.category}</TableCell>
                                <TableCell>{recipe.base_weight_grams}g</TableCell>
                                <TableCell>{formatCurrency(recipe.total_cost || 0)}</TableCell>
                                <TableCell>{formatCurrency(recipe.suggested_sale_price || 0)}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/receitas/${recipe.id}`}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <form action={deleteRecipe.bind(null, recipe.id)}>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {recipes?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    Nenhuma receita cadastrada.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
