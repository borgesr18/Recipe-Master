import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RecipeGeneralTab from '@/components/recipe/recipe-general-tab'
import RecipeSubRecipesTab from '@/components/recipe/recipe-subrecipes-tab'
import RecipeCostsTab from '@/components/recipe/recipe-costs-tab'
import RecipePrintingTab from '@/components/recipe/recipe-printing-tab'

export default async function RecipeDetailPage({ params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: recipe } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!recipe) {
        notFound()
    }

    // Fetch sub-recipes
    const { data: subRecipes } = await supabase
        .from('sub_recipes')
        .select('*, sub_recipe_ingredients(*, ingredients(*))')
        .eq('recipe_id', recipe.id)
        .order('created_at')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{recipe.name}</h1>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">Dados Gerais</TabsTrigger>
                    <TabsTrigger value="subrecipes">Sub-receitas</TabsTrigger>
                    <TabsTrigger value="costs">Custos</TabsTrigger>
                    <TabsTrigger value="printing">Impressão</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4">
                    <div className="rounded-md border bg-white p-6">
                        <RecipeGeneralTab recipe={recipe} />
                    </div>
                </TabsContent>
                <TabsContent value="subrecipes" className="space-y-4">
                    <div className="rounded-md border bg-white p-6">
                        <RecipeSubRecipesTab recipe={recipe} subRecipes={subRecipes || []} />
                    </div>
                </TabsContent>
                <TabsContent value="costs" className="space-y-4">
                    <div className="rounded-md border bg-white p-6">
                        <RecipeCostsTab recipe={recipe} subRecipes={subRecipes || []} />
                    </div>
                </TabsContent>
                <TabsContent value="printing" className="space-y-4">
                    <div className="rounded-md border bg-white p-6">
                        <RecipePrintingTab recipe={recipe} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
