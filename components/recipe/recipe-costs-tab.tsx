'use client'

import { formatCurrency } from '@/lib/utils'

export default function RecipeCostsTab({ recipe, subRecipes }: { recipe: any, subRecipes: any[] }) {
    const totalCost = subRecipes.reduce((acc, sub) => acc + (sub.total_cost || 0), 0)
    const costPerKg = totalCost / (recipe.base_weight_grams / 1000)
    const costPerPortion = totalCost / recipe.yield_portions

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border p-4 bg-gray-50">
                    <div className="text-sm font-medium text-gray-500">Custo Total</div>
                    <div className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(totalCost)}</div>
                </div>
                <div className="rounded-lg border p-4 bg-gray-50">
                    <div className="text-sm font-medium text-gray-500">Custo por Kg</div>
                    <div className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(costPerKg)}</div>
                </div>
                <div className="rounded-lg border p-4 bg-gray-50">
                    <div className="text-sm font-medium text-gray-500">Custo por Porção</div>
                    <div className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(costPerPortion)}</div>
                </div>
                <div className="rounded-lg border p-4 bg-gray-50">
                    <div className="text-sm font-medium text-gray-500">Preço Sugerido</div>
                    <div className="mt-1 text-2xl font-bold text-indigo-600">{formatCurrency(recipe.suggested_sale_price || 0)}</div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-4">Detalhamento por Sub-receita</h3>
                <ul className="divide-y divide-gray-200 border rounded-md">
                    {subRecipes.map((sub) => (
                        <li key={sub.id} className="flex items-center justify-between py-3 px-4">
                            <span className="text-sm font-medium text-gray-900">{sub.name}</span>
                            <span className="text-sm text-gray-500">{formatCurrency(sub.total_cost || 0)}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
