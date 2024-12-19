import Layout from '@/components/Layout'
import ClientesTable from '@/components/ClientesTable'

export default function ClientesPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Clientes</h1>
        <ClientesTable />
      </div>
    </Layout>
  )
}

