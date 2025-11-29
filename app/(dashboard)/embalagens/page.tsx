import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { deletePackaging, createPackaging, updatePackaging } from './actions'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import PackagingForm from '@/components/forms/packaging-form'

export default async function PackagingPage() {
    const supabase = await createClient()
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
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Embalagens</h1>
                    <p className="text-muted-foreground">Gerencie as embalagens usadas nas suas receitas.</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Nova Embalagem
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Nova Embalagem</DialogTitle>
                            <DialogDescription>
                                Adicione uma nova embalagem ao seu estoque.
                            </DialogDescription>
                        </DialogHeader>
                        <PackagingForm action={createPackaging} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                        <tr>
                            <th className="px-4 py-3">Nome</th>
                            <th className="px-4 py-3">Tipo</th>
                            <th className="px-4 py-3">Capacidade</th>
                            <th className="px-4 py-3">Qtd. Pacote</th>
                            <th className="px-4 py-3">Custo Unit.</th>
                            <th className="px-4 py-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {packaging?.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{item.name}</td>
                                <td className="px-4 py-3 capitalize">{item.type}</td>
                                <td className="px-4 py-3">
                                    {item.capacity_grams && `${item.capacity_grams}g `}
                                    {item.capacity_ml && `${item.capacity_ml}ml`}
                                    {!item.capacity_grams && !item.capacity_ml && '-'}
                                </td>
                                <td className="px-4 py-3">{item.quantity_per_package}</td>
                                <td className="px-4 py-3">{formatCurrency(item.cost_per_unit || 0)}</td>
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
                                                    <DialogTitle>Editar Embalagem</DialogTitle>
                                                    <DialogDescription>
                                                        Atualize os dados da embalagem.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <PackagingForm
                                                    action={updatePackaging.bind(null, item.id)}
                                                    defaultValues={item}
                                                />
                                            </DialogContent>
                                        </Dialog>

                                        <form action={deletePackaging.bind(null, item.id)}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {packaging?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                    Nenhuma embalagem cadastrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
