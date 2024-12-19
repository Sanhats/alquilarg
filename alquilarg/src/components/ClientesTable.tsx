'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Edit, Trash2 } from 'lucide-react'

type Cliente = {
  id: number
  nombre: string
  email: string
  telefono: string
}

export default function ClientesTable() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClientes()
  }, [])

  async function fetchClientes() {
    try {
      setIsLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nombre', { ascending: true })
      
      if (error) throw error
      
      setClientes(data || [])
    } catch (e) {
      console.error('Error fetching clientes:', e)
      setError('No se pudieron cargar los clientes. Por favor, intente más tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center">Cargando clientes...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left">Nombre</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Teléfono</th>
            <th className="py-2 px-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{cliente.nombre}</td>
              <td className="py-2 px-4">{cliente.email}</td>
              <td className="py-2 px-4">{cliente.telefono}</td>
              <td className="py-2 px-4 text-center">
                <button className="text-blue-500 hover:text-blue-700 mr-2">
                  <Edit size={18} />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

