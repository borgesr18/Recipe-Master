'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'

export default function RecipeSubRecipesTab({ recipe, subRecipes }: { recipe: any, subRecipes: any[] }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Sub-receitas</h2>
                <Button asChild size="sm">
                    <Link href={`/receitas/${recipe.id}/subreceitas/new`}>
                        <Plus className="mr-2 h-4 w-4" /> Adicionar Sub-receita
                    </Link>
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Custo Total</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subRecipes.map((sub) => (
                        <TableRow key={sub.id}>
                            <TableCell className="font-medium">{sub.name}</TableCell>
                            <TableCell className="capitalize">{sub.type}</TableCell>
                            <TableCell>{formatCurrency(sub.total_cost || 0)}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/receitas/${recipe.id}/subreceitas/${sub.id}`}>
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    {/* Delete button would go here */}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {subRecipes.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                Nenhuma sub-receita cadastrada.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
