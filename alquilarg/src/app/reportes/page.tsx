import Layout from '@/components/Layout'
import ReportesOverview from '@/components/ReportesOverview'

export default function ReportesPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Reportes</h1>
        <ReportesOverview />
      </div>
    </Layout>
  )
}

