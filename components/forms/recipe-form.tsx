'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { createRecipe, updateRecipe } from '@/app/(dashboard)/receitas/actions'

interface RecipeFormProps {
    initialData?: any
    isEditing?: boolean
}

export default function RecipeForm({ initialData, isEditing = false }: RecipeFormProps) {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        try {
            if (isEditing && initialData) {
                await updateRecipe(initialData.id, formData)
            } else {
                await createRecipe(formData)
            }
        } catch (error) {
            console.error(error)
            alert('Error saving recipe')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                        Nome da Receita
                    </label>
                    <div className="mt-2">
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            required
                            defaultValue={initialData?.name}
                            placeholder="Ex: Bolo de Chocolate 1kg"
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
                            placeholder="Ex: Bolos"
                        />
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="cake_type" className="block text-sm font-medium leading-6 text-gray-900">
                        Tipo de Bolo
                    </label>
                    <div className="mt-2">
                        <Input
                            type="text"
                            name="cake_type"
                            id="cake_type"
                            defaultValue={initialData?.cake_type}
                            placeholder="Ex: Bolo de Festa"
                        />
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="difficulty_level" className="block text-sm font-medium leading-6 text-gray-900">
                        Nível de Dificuldade
                    </label>
                    <div className="mt-2">
                        <Select
                            name="difficulty_level"
                            id="difficulty_level"
                            defaultValue={initialData?.difficulty_level || 'basic'}
                        >
                            <option value="basic">Básico</option>
                            <option value="intermediate">Intermediário</option>
                            <option value="advanced">Avançado</option>
                        </Select>
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                        Descrição
                    </label>
                    <div className="mt-2">
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            defaultValue={initialData?.description}
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="base_weight_grams" className="block text-sm font-medium leading-6 text-gray-900">
                        Peso Base (g)
                    </label>
                    <div className="mt-2">
                        <Input
                            type="number"
                            step="1"
                            name="base_weight_grams"
                            id="base_weight_grams"
                            required
                            defaultValue={initialData?.base_weight_grams}
                            placeholder="Ex: 1000"
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="yield_portions" className="block text-sm font-medium leading-6 text-gray-900">
                        Rendimento (fatias)
                    </label>
                    <div className="mt-2">
                        <Input
                            type="number"
                            step="1"
                            name="yield_portions"
                            id="yield_portions"
                            required
                            defaultValue={initialData?.yield_portions}
                            placeholder="Ex: 12"
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="oven_time_min" className="block text-sm font-medium leading-6 text-gray-900">
                        Tempo Forno (min)
                    </label>
                    <div className="mt-2">
                        <Input
                            type="number"
                            step="1"
                            name="oven_time_min"
                            id="oven_time_min"
                            defaultValue={initialData?.oven_time_min}
                            placeholder="Ex: 45"
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="oven_temp_c" className="block text-sm font-medium leading-6 text-gray-900">
                        Temp. Forno (°C)
                    </label>
                    <div className="mt-2">
                        <Input
                            type="number"
                            step="1"
                            name="oven_temp_c"
                            id="oven_temp_c"
                            defaultValue={initialData?.oven_temp_c}
                            placeholder="Ex: 180"
                        />
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="general_preparation_method" className="block text-sm font-medium leading-6 text-gray-900">
                        Modo de Preparo Geral
                    </label>
                    <div className="mt-2">
                        <textarea
                            id="general_preparation_method"
                            name="general_preparation_method"
                            rows={4}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            defaultValue={initialData?.general_preparation_method}
                        />
                    </div>
                </div>
            </div>

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
