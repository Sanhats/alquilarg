'use client'

import React from 'react'
import { supabase } from '@/lib/supabase'
import { Calendar, User, Package } from 'lucide-react'

type Alquiler = {
  id: number
  cliente: string
  fecha_alquiler: string
  fecha_devolucion: string
  item: string
  cantidad: number
}

export default function AlquileresActivos() {
  const [alquileres, setAlquileres] = React.useState<Alquiler[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchAlquileres() {
      try {
        setIsLoading(true)
        setError(null)
        
        const { data, error } = await supabase
          .from('alquileres')
          .select(`
            id,
            clientes(nombre),
            fecha_alquiler,
            fecha_devolucion,
            items(nombre),
            cantidad
          `)
          .order('fecha_devolucion', { ascending: true })
          .limit(5)
        
        if (error) {
          throw error
        }
        
        setAlquileres(data?.map(a => ({
          id: a.id,
          cliente: a.clientes.nombre,
          fecha_alquiler: a.fecha_alquiler,
          fecha_devolucion: a.fecha_devolucion,
          item: a.items.nombre,
          cantidad: a.cantidad
        })) || [])
      } catch (e) {
        console.error('Error fetching alquileres:', e)
        setError('No se pudieron cargar los alquileres. Por favor, intente más tarde.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlquileres()
  }, [])

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded"></div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 flex items-center">
        <Calendar className="mr-2" />
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {alquileres.length === 0 ? (
        <p className="text-gray-500 italic">No hay alquileres activos.</p>
      ) : (
        alquileres.map((alquiler) => (
          <div key={alquiler.id} className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center text-gray-700">
              <User className="mr-2" size={16} />
              <span className="font-semibold">{alquiler.cliente}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Package className="mr-2" size={16} />
              <span>{alquiler.item} (x{alquiler.cantidad})</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="mr-2" size={16} />
              <span>
                {new Date(alquiler.fecha_alquiler).toLocaleDateString()} - {new Date(alquiler.fecha_devolucion).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

