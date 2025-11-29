'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { createIngredient, updateIngredient } from '@/app/(dashboard)/insumos/actions'
import { formatCurrency } from '@/lib/utils'

interface IngredientFormProps {
    initialData?: any
    isEditing?: boolean
}

export default function IngredientForm({ initialData, isEditing = false }: IngredientFormProps) {
    const [loading, setLoading] = useState(false)
    const [calculatedCost, setCalculatedCost] = useState<string | null>(null)

    // State for calculation preview
    const [unit, setUnit] = useState(initialData?.purchase_unit || 'kg')
    const [qty, setQty] = useState(initialData?.quantity_per_package || '')
    const [price, setPrice] = useState(initialData?.package_price || '')

    useEffect(() => {
        if (unit && qty && price) {
            const q = parseFloat(qty)
            const p = parseFloat(price)
            if (!isNaN(q) && !isNaN(p) && q > 0) {
                let cost = 0
                let unitLabel = ''
                if (unit === 'kg') {
                    cost = p / (q * 1000)
                    unitLabel = '/g'
                } else if (unit === 'g') {
                    cost = p / q
                    unitLabel = '/g'
                } else if (unit === 'l') {
                    cost = p / (q * 1000)
                    unitLabel = '/ml'
                } else if (unit === 'ml') {
                    cost = p / q
                    unitLabel = '/ml'
                } else if (unit === 'unit') {
                    cost = p / q
                    unitLabel = '/un'
                }
                setCalculatedCost(`${formatCurrency(cost)} ${unitLabel}`)
            } else {
                setCalculatedCost(null)
            }
        } else {
            setCalculatedCost(null)
        }
    }, [unit, qty, price])

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        try {
            if (isEditing && initialData) {
                await updateIngredient(initialData.id, formData)
            } else {
                await createIngredient(formData)
            }
        } catch (error) {
            console.error(error)
            alert('Error saving ingredient')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6 max-w-2xl">
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
                            placeholder="Ex: Farinha de Trigo"
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                        Categoria
                    </label>
                    <div className="mt-2">
                        <Input
                            type="text"
                            name="category"
                            id="category"
                            defaultValue={initialData?.category}
                            placeholder="Ex: Secos"
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="purchase_unit" className="block text-sm font-medium leading-6 text-gray-900">
                        Unidade de Compra
                    </label>
                    <div className="mt-2">
                        <Select
                            name="purchase_unit"
                            id="purchase_unit"
                            required
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                        >
                            <option value="kg">Quilograma (kg)</option>
                            <option value="g">Grama (g)</option>
                            <option value="l">Litro (l)</option>
                            <option value="ml">Mililitro (ml)</option>
                            <option value="unit">Unidade (un)</option>
                        </Select>
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="quantity_per_package" className="block text-sm font-medium leading-6 text-gray-900">
                        Qtd. Embalagem
                    </label>
                    <div className="mt-2">
                        <Input
                            type="number"
                            step="0.001"
                            name="quantity_per_package"
                            id="quantity_per_package"
                            required
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            placeholder="Ex: 1"
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="package_price" className="block text-sm font-medium leading-6 text-gray-900">
                        Preço Embalagem (R$)
                    </label>
                    <div className="mt-2">
                        <Input
                            type="number"
                            step="0.01"
                            name="package_price"
                            id="package_price"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Ex: 5.50"
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="correction_factor" className="block text-sm font-medium leading-6 text-gray-900">
                        Fator de Correção
                    </label>
                    <div className="mt-2">
                        <Input
                            type="number"
                            step="0.01"
                            name="correction_factor"
                            id="correction_factor"
                            defaultValue={initialData?.correction_factor || 1.0}
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Peso Bruto / Peso Líquido</p>
                </div>
            </div>

            {calculatedCost && (
                <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Custo Calculado</h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <p>{calculatedCost}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-end gap-x-6">
                <Button type="button" variant="ghost" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    )
}
