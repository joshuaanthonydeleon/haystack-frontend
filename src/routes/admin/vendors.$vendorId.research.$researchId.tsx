import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'

import { AuthGuard } from '../../components/guards/AuthGuard'
import { Button } from '../../components/ui/button'
import { useVendorResearchDetail } from '../../queries/vendors'

const VendorResearchDetail = () => {
  const { vendorId, researchId } = Route.useParams()
  const { data, isLoading, error, refetch } = useVendorResearchDetail(vendorId, researchId)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading research details…</p>
        </div>
      </div>
    )
  }

  if (error || !data?.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-lg text-center space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">Research details unavailable</h1>
          <p className="text-gray-600">{error instanceof Error ? error.message : data?.error ?? 'Unable to load this research record.'}</p>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      </div>
    )
  }

  const record = data.data

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Research Detail</h1>
            <p className="text-sm text-gray-600">Vendor #{vendorId} · Research #{researchId}</p>
          </div>
          <Button variant="outline" onClick={() => refetch()}>Refresh</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <dl className="bg-white rounded-lg border p-6 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <dt>Status</dt>
              <dd className="font-semibold capitalize">{record.status.replace('_', ' ')}</dd>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <dt>Requested</dt>
              <dd>{new Date(record.requestedAt).toLocaleString()}</dd>
            </div>
            {record.startedAt && (
              <div className="flex justify-between text-sm text-gray-600">
                <dt>Started</dt>
                <dd>{new Date(record.startedAt).toLocaleString()}</dd>
              </div>
            )}
            {record.completedAt && (
              <div className="flex justify-between text-sm text-gray-600">
                <dt>Completed</dt>
                <dd>{new Date(record.completedAt).toLocaleString()}</dd>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <dt>Model</dt>
              <dd>{record.llmModel ?? '—'}</dd>
            </div>
            {record.discoveredLogoUrl && (
              <div className="text-sm text-gray-600 space-y-1">
                <dt className="font-semibold text-gray-800">Logo URL</dt>
                <dd>
                  <a
                    href={record.discoveredLogoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 break-all"
                  >
                    {record.discoveredLogoUrl}
                  </a>
                </dd>
              </div>
            )}
            {record.errorMessage && (
              <p className="text-sm text-red-600">{record.errorMessage}</p>
            )}
          </dl>

          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Suggested Updates</h2>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-xs overflow-x-auto">
{JSON.stringify(record.deepResearchInsights ?? {}, null, 2)}
            </pre>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Website Snapshot</h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-xs overflow-x-auto">
{JSON.stringify(record.websiteSnapshot ?? {}, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Raw Artifacts</h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-xs overflow-x-auto">
{JSON.stringify(record.rawResearchArtifacts ?? {}, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/admin/vendors/$vendorId/research/$researchId')({
  component: () => (
    <AuthGuard requiredRole="admin">
      <VendorResearchDetail />
    </AuthGuard>
  ),
})

