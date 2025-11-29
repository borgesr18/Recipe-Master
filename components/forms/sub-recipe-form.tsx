'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { createSubRecipe, updateSubRecipe } from '@/app/(dashboard)/receitas/[id]/subreceitas/actions'

interface SubRecipeFormProps {
    recipeId: string
    initialData?: any
    isEditing?: boolean
}

export default function SubRecipeForm({ recipeId, initialData, isEditing = false }: SubRecipeFormProps) {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        try {
            if (isEditing && initialData) {
                await updateSubRecipe(recipeId, initialData.id, formData)
            } else {
                await createSubRecipe(recipeId, formData)
            }
        } catch (error) {
            console.error(error)
            alert('Error saving sub-recipe')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                        Nome da Sub-receita
                    </label>
                    <div className="mt-2">
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            required
                            defaultValue={initialData?.name}
                            placeholder="Ex: Massa de Chocolate"
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">
                        Tipo
                    </label>
                    <div className="mt-2">
                        <Select
                            name="type"
                            id="type"
                            required
                            defaultValue={initialData?.type || 'dough'}
                        >
                            <option value="dough">Massa</option>
                            <option value="filling">Recheio</option>
                            <option value="frosting">Cobertura</option>
                            <option value="syrup">Calda</option>
                            <option value="decoration">Decoração</option>
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
                            rows={2}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            defaultValue={initialData?.description}
                        />
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="preparation_method" className="block text-sm font-medium leading-6 text-gray-900">
                        Modo de Preparo
                    </label>
                    <div className="mt-2">
                        <textarea
                            id="preparation_method"
                            name="preparation_method"
                            rows={4}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            defaultValue={initialData?.preparation_method}
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
