'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { createPrintTemplate } from '@/app/(dashboard)/templates-impressao/actions'

export default function NewPrintTemplatePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Novo Modelo de Impressão</h1>
            </div>
            <div className="rounded-md border bg-white p-6">
                <form action={createPrintTemplate} className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                Nome do Modelo
                            </label>
                            <div className="mt-2">
                                <Input type="text" name="name" id="name" required placeholder="Ex: Ficha Completa Padrão" />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">
                                Tipo
                            </label>
                            <div className="mt-2">
                                <Select name="type" id="type" required>
                                    <option value="technical_sheet">Ficha Técnica</option>
                                    <option value="production">Produção</option>
                                    <option value="summary">Resumida</option>
                                    <option value="label">Etiqueta</option>
                                </Select>
                            </div>
                        </div>

                        <div className="sm:col-span-6 space-y-2">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="show_costs" id="show_costs" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" defaultChecked />
                                <label htmlFor="show_costs" className="text-sm">Mostrar Custos</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="show_preparation" id="show_preparation" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" defaultChecked />
                                <label htmlFor="show_preparation" className="text-sm">Mostrar Modo de Preparo</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="show_ingredients" id="show_ingredients" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" defaultChecked />
                                <label htmlFor="show_ingredients" className="text-sm">Mostrar Ingredientes</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="show_logo" id="show_logo" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" defaultChecked />
                                <label htmlFor="show_logo" className="text-sm">Mostrar Logo</label>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-x-6">
                        <Button type="button" variant="ghost" onClick={() => window.history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Save
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
