'use client'

import { useEffect } from 'react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <html>
            <body>
                <div className="flex min-h-screen flex-col items-center justify-center gap-4">
                    <h2 className="text-2xl font-bold">Algo deu errado!</h2>
                    <button
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        onClick={() => reset()}
                    >
                        Tentar novamente
                    </button>
                </div>
            </body>
        </html>
    )
}
