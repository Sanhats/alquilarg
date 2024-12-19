'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Edit, Trash2 } from 'lucide-react'

type Item = {
  id: number
  nombre: string
  categoria: string
  cantidad_total: number
  cantidad_disponible: number
  precio_diario: number
}

export default function InventarioTable() {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    try {
      setIsLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('nombre', { ascending: true })
      
      if (error) throw error
      
      setItems(data || [])
    } catch (e) {
      console.error('Error fetching items:', e)
      setError('No se pudieron cargar los items. Por favor, intente más tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center">Cargando inventario...</div>
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
            <th className="py-2 px-4 text-left">Categoría</th>
            <th className="py-2 px-4 text-right">Cantidad Total</th>
            <th className="py-2 px-4 text-right">Cantidad Disponible</th>
            <th className="py-2 px-4 text-right">Precio Diario</th>
            <th className="py-2 px-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{item.nombre}</td>
              <td className="py-2 px-4">{item.categoria}</td>
              <td className="py-2 px-4 text-right">{item.cantidad_total}</td>
              <td className="py-2 px-4 text-right">{item.cantidad_disponible}</td>
              <td className="py-2 px-4 text-right">${item.precio_diario.toFixed(2)}</td>
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

