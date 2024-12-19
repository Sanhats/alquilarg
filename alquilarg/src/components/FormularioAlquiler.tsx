'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, UserPlus } from 'lucide-react'
import FormularioCliente from './FormularioCliente'

type Cliente = {
  id: number
  nombre: string
}

type Item = {
  id: number
  nombre: string
  categoria: string
  cantidad_disponible: number
  precio_diario: number
}

type ItemAlquiler = {
  item_id: number
  cantidad: number
}

export default function FormularioAlquiler() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [selectedCliente, setSelectedCliente] = useState('')
  const [itemsAlquiler, setItemsAlquiler] = useState<ItemAlquiler[]>([{ item_id: 0, cantidad: 1 }])
  const [fechaAlquiler, setFechaAlquiler] = useState('')
  const [fechaDevolucion, setFechaDevolucion] = useState('')
  const [precioTotal, setPrecioTotal] = useState(0)
  const [mostrarFormularioCliente, setMostrarFormularioCliente] = useState(false)
  const [dialogoClienteAbierto, setDialogoClienteAbierto] = useState(false)

  useEffect(() => {
    fetchClientes()
    fetchItems()
  }, [])

  useEffect(() => {
    calcularPrecioTotal()
  }, [itemsAlquiler, fechaAlquiler, fechaDevolucion])

  async function fetchClientes() {
    const { data, error } = await supabase
      .from('clientes')
      .select('id, nombre')
    if (error) console.error('Error fetching clientes:', error)
    else setClientes(data || [])
  }

  async function fetchItems() {
    const { data, error } = await supabase
      .from('items')
      .select('id, nombre, categoria, cantidad_disponible, precio_diario')
    if (error) console.error('Error fetching items:', error)
    else setItems(data || [])
  }

  function calcularPrecioTotal() {
    if (fechaAlquiler && fechaDevolucion) {
      const dias = Math.ceil((new Date(fechaDevolucion).getTime() - new Date(fechaAlquiler).getTime()) / (1000 * 3600 * 24))
      const total = itemsAlquiler.reduce((sum, itemAlquiler) => {
        const item = items.find(i => i.id === itemAlquiler.item_id)
        return sum + (item ? item.precio_diario * itemAlquiler.cantidad * dias : 0)
      }, 0)
      setPrecioTotal(total)
    }
  }

  const handleItemChange = (index: number, field: keyof ItemAlquiler, value: number) => {
    const newItemsAlquiler = [...itemsAlquiler]
    newItemsAlquiler[index][field] = value
    setItemsAlquiler(newItemsAlquiler)
  }

  const addItem = () => {
    setItemsAlquiler([...itemsAlquiler, { item_id: 0, cantidad: 1 }])
  }

  const removeItem = (index: number) => {
    const newItemsAlquiler = itemsAlquiler.filter((_, i) => i !== index)
    setItemsAlquiler(newItemsAlquiler)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const alquiler = {
      cliente_id: parseInt(selectedCliente),
      fecha_alquiler: fechaAlquiler,
      fecha_devolucion: fechaDevolucion,
      precio_total: precioTotal,
      items: itemsAlquiler
    }
    const { data, error } = await supabase
      .from('alquileres')
      .insert([alquiler])
    if (error) {
      console.error('Error inserting alquiler:', error)
      alert('Hubo un error al registrar el alquiler. Por favor, intente de nuevo.')
    } else {
      alert('Alquiler registrado con éxito')
      // Resetear el formulario
      setSelectedCliente('')
      setItemsAlquiler([{ item_id: 0, cantidad: 1 }])
      setFechaAlquiler('')
      setFechaDevolucion('')
      setPrecioTotal(0)
    }
  }

  const handleClienteCreated = (nuevoCliente: Cliente) => {
    setClientes([...clientes, nuevoCliente])
    setSelectedCliente(nuevoCliente.id.toString())
    setDialogoClienteAbierto(false)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cliente" className="block text-sm font-medium text-gray-700">Cliente</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <select
              id="cliente"
              value={selectedCliente}
              onChange={(e) => setSelectedCliente(e.target.value)}
              className="flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setDialogoClienteAbierto(true)}
              className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
            >
              <UserPlus className="w-4 h-4" />
              <span className="ml-2">Nuevo Cliente</span>
            </button>
          </div>
        </div>

        {itemsAlquiler.map((itemAlquiler, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-grow">
              <label htmlFor={`item-${index}`} className="block text-sm font-medium text-gray-700">Artículo</label>
              <select
                id={`item-${index}`}
                value={itemAlquiler.item_id}
                onChange={(e) => handleItemChange(index, 'item_id', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              >
                <option value="">Seleccione un artículo</option>
                {items.map(item => (
                  <option key={item.id} value={item.id}>{item.nombre} - Disponibles: {item.cantidad_disponible}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`cantidad-${index}`} className="block text-sm font-medium text-gray-700">Cantidad</label>
              <input
                type="number"
                id={`cantidad-${index}`}
                value={itemAlquiler.cantidad}
                onChange={(e) => handleItemChange(index, 'cantidad', parseInt(e.target.value))}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="mt-6 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="mt-2 flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus size={18} className="mr-2" />
          Agregar Artículo
        </button>

        <div>
          <label htmlFor="fechaAlquiler" className="block text-sm font-medium text-gray-700">Fecha de Alquiler</label>
          <input
            type="date"
            id="fechaAlquiler"
            value={fechaAlquiler}
            onChange={(e) => setFechaAlquiler(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="fechaDevolucion" className="block text-sm font-medium text-gray-700">Fecha de Devolución</label>
          <input
            type="date"
            id="fechaDevolucion"
            value={fechaDevolucion}
            onChange={(e) => setFechaDevolucion(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <p className="text-lg font-semibold">Precio Total: ${precioTotal.toFixed(2)}</p>
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Registrar Alquiler
          </button>
        </div>
      </form>

      {dialogoClienteAbierto && (
  <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex">
    <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
      <button
        className="absolute top-0 right-0 p-4"
        onClick={() => setDialogoClienteAbierto(false)}
      >
        &times;
      </button>
      <h2 className="text-lg font-semibold mb-4">Crear Nuevo Cliente</h2>
      <FormularioCliente
        onClienteCreated={handleClienteCreated}
        onCancel={() => setDialogoClienteAbierto(false)}
      />
    </div>
  </div>
)}
    </div>
  )
}

