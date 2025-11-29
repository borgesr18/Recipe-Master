import PackagingForm from '@/components/forms/packaging-form'

export default function NewPackagingPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Nova Embalagem</h1>
            </div>
            <div className="rounded-md border bg-white p-6">
                <PackagingForm />
            </div>
        </div>
    )
}
