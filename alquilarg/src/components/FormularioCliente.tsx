'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Cliente = {
  nombre: string
  email: string
  telefono: string
}

type FormularioClienteProps = {
  onClienteCreated: (cliente: Cliente & { id: number }) => void
  onCancel: () => void
}

export default function FormularioCliente({ onClienteCreated, onCancel }: FormularioClienteProps) {
  const [cliente, setCliente] = useState<Cliente>({
    nombre: '',
    email: '',
    telefono: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null) // Limpiar error previo
    const { name, value } = e.target
    setCliente(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validaciones básicas
      if (!cliente.nombre.trim()) {
        throw new Error('El nombre es requerido')
      }
      if (!cliente.email.trim()) {
        throw new Error('El email es requerido')
      }
      if (!cliente.telefono.trim()) {
        throw new Error('El teléfono es requerido')
      }

      const { data, error: supabaseError } = await supabase
        .from('clientes')
        .insert([{
          nombre: cliente.nombre.trim(),
          email: cliente.email.trim().toLowerCase(),
          telefono: cliente.telefono.trim()
        }])
        .select()
        .single()

      if (supabaseError) {
        throw supabaseError
      }

      if (data) {
        onClienteCreated(data as Cliente & { id: number })
        // Limpiar el formulario
        setCliente({
          nombre: '',
          email: '',
          telefono: ''
        })
      }
    } catch (err) {
      console.error('Error al crear el cliente:', err)
      setError(err instanceof Error ? err.message : 'Error al crear el cliente')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={cliente.nombre}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={cliente.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
            Teléfono
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={cliente.telefono}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Creando...' : 'Crear Cliente'}
          </button>
        </div>
      </form>
    </div>
  )
}

