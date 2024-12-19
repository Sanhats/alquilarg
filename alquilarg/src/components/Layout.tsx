import React from 'react'
import Link from 'next/link'
import { Home, Box, Users, FileText } from 'lucide-react'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="bg-indigo-700 text-white w-64 flex-shrink-0">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Control de Alquileres</h1>
        </div>
        <nav className="mt-8">
          <Link href="/" className="block py-2 px-4 hover:bg-indigo-600 transition-colors duration-200">
            <Home className="inline-block mr-2" size={20} />
            Dashboard
          </Link>
          <Link href="/inventario" className="block py-2 px-4 hover:bg-indigo-600 transition-colors duration-200">
            <Box className="inline-block mr-2" size={20} />
            Inventario
          </Link>
          <Link href="/clientes" className="block py-2 px-4 hover:bg-indigo-600 transition-colors duration-200">
            <Users className="inline-block mr-2" size={20} />
            Clientes
          </Link>
          <Link href="/reportes" className="block py-2 px-4 hover:bg-indigo-600 transition-colors duration-200">
            <FileText className="inline-block mr-2" size={20} />
            Reportes
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-grow p-8">
        {children}
      </main>
    </div>
  )
}

