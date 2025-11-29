import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, ChefHat, Printer, Settings, LogOut } from 'lucide-react'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch user profile and company
    const { data: profile } = await supabase
        .from('profiles')
        .select('*, companies(*)')
        .eq('id', user.id)
        .single()

    if (!profile) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4">
                <div className="text-lg font-semibold">Perfil não encontrado.</div>
                <p className="text-gray-500">Houve um erro ao carregar seus dados.</p>
                <form action="/auth/signout" method="post">
                    <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
                        Sair e tentar novamente
                    </button>
                </form>
            </div>
        )
    }

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Insumos', href: '/insumos', icon: Package },
        { name: 'Embalagens', href: '/embalagens', icon: Package }, // Using Package for now, maybe Box
        { name: 'Receitas', href: '/receitas', icon: ChefHat },
        { name: 'Modelos de Impressão', href: '/templates-impressao', icon: Printer },
    ]

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-gray-200">
                    <div className="flex h-16 shrink-0 items-center">
                        <span className="text-xl font-bold text-indigo-600">Culinary SaaS</span>
                    </div>
                    <div className="text-xs font-semibold leading-6 text-gray-400">
                        {profile.companies?.name}
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                            >
                                                <item.icon
                                                    className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                                                    aria-hidden="true"
                                                />
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li className="mt-auto">
                                <form action="/auth/signout" method="post">
                                    <button
                                        type="submit"
                                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 w-full"
                                    >
                                        <LogOut
                                            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                                            aria-hidden="true"
                                        />
                                        Sign out
                                    </button>
                                </form>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <main className="pl-72 py-10">
                <div className="px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
