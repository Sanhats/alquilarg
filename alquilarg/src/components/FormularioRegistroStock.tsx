'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Item = {
  nombre: string
  categoria: string
  cantidad_total: number
  cantidad_disponible: number
  precio_diario: number
}

export default function FormularioRegistroStock() {
  const [item, setItem] = useState<Item>({
    nombre: '',
    categoria: '',
    cantidad_total: 0,
    cantidad_disponible: 0,
    precio_diario: 0
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setItem(prev => ({
      ...prev,
      [name]: name === 'cantidad_total' || name === 'cantidad_disponible' || name === 'precio_diario'
        ? parseFloat(value)
        : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('items')
      .insert([item])

    if (error) {
      console.error('Error al insertar item:', error)
      alert('Hubo un error al registrar el item. Por favor, intente de nuevo.')
    } else {
      alert('Item registrado con éxito')
      setItem({
        nombre: '',
        categoria: '',
        cantidad_total: 0,
        cantidad_disponible: 0,
        precio_diario: 0
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del Item</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={item.nombre}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
        <select
          id="categoria"
          name="categoria"
          value={item.categoria}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Seleccione una categoría</option>
          <option value="vajilla">Vajilla</option>
          <option value="mantel">Mantel</option>
          <option value="cubierto">Cubierto</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      <div>
        <label htmlFor="cantidad_total" className="block text-sm font-medium text-gray-700">Cantidad Total</label>
        <input
          type="number"
          id="cantidad_total"
          name="cantidad_total"
          value={item.cantidad_total}
          onChange={handleChange}
          required
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="cantidad_disponible" className="block text-sm font-medium text-gray-700">Cantidad Disponible</label>
        <input
          type="number"
          id="cantidad_disponible"
          name="cantidad_disponible"
          value={item.cantidad_disponible}
          onChange={handleChange}
          required
          min="0"
          max={item.cantidad_total}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="precio_diario" className="block text-sm font-medium text-gray-700">Precio Diario</label>
        <input
          type="number"
          id="precio_diario"
          name="precio_diario"
          value={item.precio_diario}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Registrar Item
        </button>
      </div>
    </form>
  )
}

