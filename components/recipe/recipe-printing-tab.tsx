'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Printer } from 'lucide-react'
import Link from 'next/link'

export default function RecipePrintingTab({ recipe }: { recipe: any }) {
    const [targetWeight, setTargetWeight] = useState(recipe.base_weight_grams)

    return (
        <div className="space-y-6">
            <div className="max-w-xs">
                <label className="block text-sm font-medium mb-1">Peso Desejado (g)</label>
                <Input
                    type="number"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                    Peso base: {recipe.base_weight_grams}g
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-500">
                    Selecione o modelo de impressão desejado.
                </p>

                <div className="flex flex-wrap gap-4">
                    <Button asChild>
                        <Link href={`/impressao/receita/${recipe.id}?tipo=technical_sheet&peso_desejado_gramas=${targetWeight}`} target="_blank">
                            <Printer className="mr-2 h-4 w-4" /> Ficha Técnica Completa
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={`/impressao/receita/${recipe.id}?tipo=production&peso_desejado_gramas=${targetWeight}`} target="_blank">
                            <Printer className="mr-2 h-4 w-4" /> Ficha de Produção
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={`/impressao/receita/${recipe.id}?tipo=summary&peso_desejado_gramas=${targetWeight}`} target="_blank">
                            <Printer className="mr-2 h-4 w-4" /> Ficha Resumida
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
