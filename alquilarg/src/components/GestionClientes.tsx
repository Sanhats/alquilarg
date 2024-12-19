'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Cliente = {
  id: number
  nombre: string
  contacto: string
}

export default function GestionClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [nombre, setNombre] = useState('')
  const [contacto, setContacto] = useState('')

  useEffect(() => {
    fetchClientes()
  }, [])

  async function fetchClientes() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nombre', { ascending: true })
    
    if (error) {
      console.error('Error fetching clientes:', error)
    } else {
      setClientes(data || [])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { data, error } = await supabase
      .from('clientes')
      .insert([{ nombre, contacto }])
    
    if (error) {
      console.error('Error adding cliente:', error)
      alert('Error al agregar cliente. Por favor, intente de nuevo.')
    } else {
      alert('Cliente agregado exitosamente')
      setNombre('')
      setContacto('')
      fetchClientes()
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Agregar Nuevo Cliente</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="contacto" className="block text-sm font-medium text-gray-700">Contacto</label>
            <input
              type="text"
              id="contacto"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Agregar Cliente
          </button>
        </form>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Lista de Clientes</h3>
        {clientes.length === 0 ? (
          <p className="text-gray-500">No hay clientes registrados.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {clientes.map((cliente) => (
              <li key={cliente.id} className="py-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{cliente.nombre}</p>
                    <p className="text-sm text-gray-500">{cliente.contacto}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

