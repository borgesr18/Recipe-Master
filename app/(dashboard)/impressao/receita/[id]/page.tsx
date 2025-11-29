import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'

export default async function PrintRecipePage({ params, searchParams }: { params: { id: string }, searchParams: { tipo: string, template?: string, peso_desejado_gramas?: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: recipe } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!recipe) notFound()

    const { data: subRecipes } = await supabase
        .from('sub_recipes')
        .select('*, sub_recipe_ingredients(*, ingredients(*))')
        .eq('recipe_id', recipe.id)
        .order('created_at')

    const { data: profile } = await supabase.from('profiles').select('*, companies(*)').eq('id', user.id).single()

    const tipo = searchParams.tipo || 'technical_sheet'
    const targetWeight = searchParams.peso_desejado_gramas ? parseFloat(searchParams.peso_desejado_gramas) : recipe.base_weight_grams
    const scaleFactor = targetWeight / recipe.base_weight_grams

    // In a real scenario, fetch template config based on searchParams.template
    // For now, default to showing everything unless it's 'production' (hide costs)

    const showCosts = tipo === 'technical_sheet'
    const showPreparation = tipo !== 'label'
    const showIngredients = true

    return (
        <div className="bg-white p-8 min-h-screen print:p-0">
            <div className="max-w-4xl mx-auto space-y-8 print:w-full print:max-w-none">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{profile?.companies?.name}</h1>
                        <div className="mt-2 text-sm text-gray-500">
                            {tipo === 'technical_sheet' && 'Ficha Técnica'}
                            {tipo === 'production' && 'Ficha de Produção'}
                            {tipo === 'summary' && 'Ficha Resumida'}
                            {tipo === 'label' && 'Etiqueta'}
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-gray-900">{recipe.name}</h2>
                        <p className="text-gray-500">{recipe.category}</p>
                    </div>
                </div>

                {/* General Info */}
                <div className="grid grid-cols-3 gap-6 text-sm">
                    <div>
                        <span className="block font-medium text-gray-500">Peso Base</span>
                        <span className="block mt-1">{recipe.base_weight_grams}g</span>
                    </div>
                    <div>
                        <span className="block font-medium text-gray-500">Peso Desejado</span>
                        <span className="block mt-1 font-bold">{targetWeight}g (x{scaleFactor.toFixed(2)})</span>
                    </div>
                    <div>
                        <span className="block font-medium text-gray-500">Rendimento Estimado</span>
                        <span className="block mt-1">{Math.round(recipe.yield_portions * scaleFactor)} fatias</span>
                    </div>
                    {showCosts && (
                        <div>
                            <span className="block font-medium text-gray-500">Custo Total (Escalado)</span>
                            <span className="block mt-1 font-bold">{formatCurrency((recipe.total_cost || 0) * scaleFactor)}</span>
                        </div>
                    )}
                </div>

                {/* Sub-recipes & Ingredients */}
                {showIngredients && subRecipes?.map((sub) => (
                    <div key={sub.id} className="space-y-4">
                        <h3 className="text-lg font-bold border-b pb-2">{sub.name} <span className="text-sm font-normal text-gray-500">({sub.type})</span></h3>

                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2">Ingrediente</th>
                                    <th className="py-2">Qtd. Base</th>
                                    <th className="py-2 font-bold">Qtd. Final</th>
                                    {showCosts && <th className="py-2 text-right">Custo</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {sub.sub_recipe_ingredients?.map((item: any) => (
                                    <tr key={item.id} className="border-b border-gray-100">
                                        <td className="py-2">{item.ingredients?.name}</td>
                                        <td className="py-2 text-gray-500">{item.usage_quantity} {item.usage_unit}</td>
                                        <td className="py-2 font-bold">{(item.usage_quantity * scaleFactor).toFixed(2)} {item.usage_unit}</td>
                                        {showCosts && <td className="py-2 text-right">{formatCurrency((item.total_cost || 0) * scaleFactor)}</td>}
                                    </tr>
                                ))}
                            </tbody>
                            {showCosts && (
                                <tfoot>
                                    <tr>
                                        <td colSpan={3} className="py-2 font-bold text-right">Subtotal</td>
                                        <td className="py-2 font-bold text-right">{formatCurrency((sub.total_cost || 0) * scaleFactor)}</td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>

                        {showPreparation && sub.preparation_method && (
                            <div className="bg-gray-50 p-4 rounded-md text-sm">
                                <span className="block font-bold mb-2">Modo de Preparo:</span>
                                <p className="whitespace-pre-wrap">{sub.preparation_method}</p>
                            </div>
                        )}
                    </div>
                ))}

                {/* General Preparation */}
                {showPreparation && recipe.general_preparation_method && (
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold border-b pb-2">Montagem / Finalização</h3>
                        <p className="text-sm whitespace-pre-wrap">{recipe.general_preparation_method}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="border-t pt-6 text-center text-xs text-gray-400">
                    Gerado por Culinary SaaS em {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    )
}
