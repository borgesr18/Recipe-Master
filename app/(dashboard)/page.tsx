import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ChefHat, Box, DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default async function DashboardPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch counts
    const { count: ingredientsCount } = await supabase
        .from('ingredients')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', (await supabase.from('profiles').select('company_id').eq('id', user.id).single()).data?.company_id)

    const { count: recipesCount } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', (await supabase.from('profiles').select('company_id').eq('id', user.id).single()).data?.company_id)

    const { count: packagingCount } = await supabase
        .from('packaging')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', (await supabase.from('profiles').select('company_id').eq('id', user.id).single()).data?.company_id)

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Ingredients
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{ingredientsCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Recipes
                        </CardTitle>
                        <ChefHat className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{recipesCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Packaging Items
                        </CardTitle>
                        <Box className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{packagingCount || 0}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
