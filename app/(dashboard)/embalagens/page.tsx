import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { deletePackaging } from './actions'

export default async function PackagingPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()

    const { data: packaging } = await supabase
        .from('packaging')
        .select('*')
        .eq('company_id', profile?.company_id)
        .order('name')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Embalagens</h1>
                <Button asChild>
                    <Link href="/embalagens/new">
                        <Plus className="mr-2 h-4 w-4" /> Nova Embalagem
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Capacidade</TableHead>
                            <TableHead>Qtd. Pacote</TableHead>
                            <TableHead>Custo Unit.</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {packaging?.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="capitalize">{item.type}</TableCell>
                                <TableCell>
                                    {item.capacity_grams && `${item.capacity_grams}g `}
                                    {item.capacity_ml && `${item.capacity_ml}ml`}
                                    {!item.capacity_grams && !item.capacity_ml && '-'}
                                </TableCell>
                                <TableCell>{item.quantity_per_package}</TableCell>
                                <TableCell>{formatCurrency(item.cost_per_unit || 0)}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/embalagens/${item.id}`}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <form action={deletePackaging.bind(null, item.id)}>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {packaging?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    Nenhuma embalagem cadastrada.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
