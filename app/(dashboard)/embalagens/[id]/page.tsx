import { createClient } from '@/lib/supabase/server'
import PackagingForm from '@/components/forms/packaging-form'
import { notFound } from 'next/navigation'

export default async function EditPackagingPage({ params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: packaging } = await supabase
        .from('packaging')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!packaging) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Editar Embalagem</h1>
            </div>
            <div className="rounded-md border bg-white p-6">
                <PackagingForm initialData={packaging} isEditing />
            </div>
        </div>
    )
}
