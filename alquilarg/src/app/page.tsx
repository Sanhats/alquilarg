import Layout from '@/components/Layout'
import InventarioResumen from '@/components/InventarioResumen'
import AlquileresActivos from '@/components/AlquileresActivos'
import FormularioRegistroStock from '@/components/FormularioRegistroStock'
import FormularioAlquiler from '@/components/FormularioAlquiler'

export default function Home() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-indigo-600 text-white py-3 px-4">
              <h2 className="text-xl font-semibold">Resumen del Inventario</h2>
            </div>
            <div className="p-4">
              <InventarioResumen />
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-indigo-600 text-white py-3 px-4">
              <h2 className="text-xl font-semibold">Alquileres Activos</h2>
            </div>
            <div className="p-4">
              <AlquileresActivos />
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-indigo-600 text-white py-3 px-4">
              <h2 className="text-xl font-semibold">Registro de Stock</h2>
            </div>
            <div className="p-4">
              <FormularioRegistroStock />
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-indigo-600 text-white py-3 px-4">
              <h2 className="text-xl font-semibold">Nuevo Alquiler</h2>
            </div>
            <div className="p-4">
              <FormularioAlquiler />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

