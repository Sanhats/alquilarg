'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type ReporteData = {
  categoria: string
  cantidad_alquileres: number
  ingresos_totales: number
}

export default function ReportesOverview() {
  const [reporteData, setReporteData] = useState<ReporteData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReporteData()
  }, [])

  async function fetchReporteData() {
    try {
      setIsLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .rpc('get_reporte_alquileres_por_categoria')
      
      if (error) throw error
      
      setReporteData(data || [])
    } catch (e) {
      console.error('Error fetching reporte data:', e)
      setError('No se pudo cargar el reporte. Por favor, intente más tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center">Cargando reporte...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Alquileres por Categoría</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reporteData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="cantidad_alquileres" fill="#8884d8" name="Cantidad de Alquileres" />
            <Bar yAxisId="right" dataKey="ingresos_totales" fill="#82ca9d" name="Ingresos Totales ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Resumen de Datos</h2>
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Categoría</th>
              <th className="py-2 px-4 text-right">Cantidad de Alquileres</th>
              <th className="py-2 px-4 text-right">Ingresos Totales</th>
            </tr>
          </thead>
          <tbody>
            {reporteData.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4">{item.categoria}</td>
                <td className="py-2 px-4 text-right">{item.cantidad_alquileres}</td>
                <td className="py-2 px-4 text-right">${item.ingresos_totales.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

