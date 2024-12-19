import Layout from '@/components/Layout'
import InventarioTable from '@/components/InventarioTable'

export default function InventarioPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Inventario</h1>
        <InventarioTable />
      </div>
    </Layout>
  )
}

