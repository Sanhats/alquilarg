'use client'

import React from 'react'
import { supabase } from '@/lib/supabase'
import { Box } from 'lucide-react'

type Item = {
  id: number
  nombre: string
  categoria: string
  cantidad_disponible: number
}

export default function InventarioResumen() {
  const [items, setItems] = React.useState<Item[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchItems() {
      try {
        setIsLoading(true)
        setError(null)
        
        const { data, error } = await supabase
          .from('items')
          .select('id, nombre, categoria, cantidad_disponible')
        
        if (error) {
          throw error
        }
        
        setItems(data || [])
      } catch (e) {
        console.error('Error fetching items:', e)
        setError('No se pudieron cargar los items. Por favor, intente más tarde.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [])

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 bg-gray-200 rounded"></div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 flex items-center">
        <Box className="mr-2" />
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <p className="text-gray-500 italic">No hay items en el inventario.</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
            <div>
              <span className="font-semibold">{item.nombre}</span>
              <span className="text-gray-500 text-sm ml-2">({item.categoria})</span>
            </div>
            <span className="bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full text-sm">
              {item.cantidad_disponible} disponibles
            </span>
          </div>
        ))
      )}
    </div>
  )
}

