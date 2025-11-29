'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { createPackaging, updatePackaging } from '@/app/(dashboard)/embalagens/actions'

interface PackagingFormProps {
    initialData?: any
    isEditing?: boolean
    onSuccess?: () => void
}

export default function PackagingForm({ initialData, isEditing = false, onSuccess }: PackagingFormProps) {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        try {
            if (isEditing && initialData) {
                await updatePackaging(initialData.id, formData)
            } else {
                await createPackaging(formData)
            }
            if (onSuccess) {
                onSuccess()
            }
        } catch (error) {
            console.error(error)
            alert('Error saving packaging')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                        Nome
                    </label>
                    <div className="mt-2">
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            required
                            defaultValue={initialData?.name}
                            placeholder="Ex: Pote Plástico 500ml"
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">
                        Tipo
                    </label>
                    <div className="mt-2">
                        <select
                            name="type"
                            id="type"
                            required
                            defaultValue={initialData?.type || 'pote'}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="pote">Pote</option>
                            <option value="bandeja">Bandeja</option>
                            <option value="marmita">Marmita</option>
                            <option value="saco">Saco</option>
                            <option value="caixa">Caixa</option>
                            <option value="outro">Outro</option>
                        </select>
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="capacity_grams" className="block text-sm font-medium leading-6 text-gray-900">
                        Capacidade (g)
                    </label>
                    <div className="mt-2">
                        <Input
                            type="number"
                            step="0.01"
                            name="capacity_grams"
                            id="capacity_grams"
                            defaultValue={initialData?.capacity_grams}
                            placeholder="Opcional"
                        />
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="capacity_ml" className="block text-sm font-medium leading-6 text-gray-900">
                        Capacidade (ml)
                    </label>
                    <div className="mt-2">
                        <Input
                            type="number"
                            step="0.01"
                            name="capacity_ml"
                            id="capacity_ml"
                            defaultValue={initialData?.capacity_ml}
                            placeholder="Opcional"
                        />
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="quantity_per_package" className="block text-sm font-medium leading-6 text-gray-900">
                        Qtd. no Pacote
                    </label>
                    <div className="mt-2">
                        <Input
                            type="number"
                            step="1"
                            name="quantity_per_package"
                            id="quantity_per_package"
                            required
                            defaultValue={initialData?.quantity_per_package}
                            placeholder="Ex: 100"
                        />
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="package_price" className="block text-sm font-medium leading-6 text-gray-900">
                        Preço do Pacote (R$)
                    </label>
                    <div className="mt-2">
                        <Input
                            type="number"
                            step="0.01"
                            name="package_price"
                            id="package_price"
                            required
                            defaultValue={initialData?.package_price}
                            placeholder="Ex: 50.00"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-x-6">
                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                    {loading ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>
        </form>
    )
}
