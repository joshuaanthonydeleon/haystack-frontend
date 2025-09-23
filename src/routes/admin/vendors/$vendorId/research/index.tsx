import { Link, createFileRoute } from '@tanstack/react-router'
import { Fragment, useMemo } from 'react'
import { AlertCircle, ArrowLeft, Bot, Loader2, RefreshCw } from 'lucide-react'

import { AuthGuard } from '@/components/guards/AuthGuard'
import { Button } from '@/components/ui/button'
import { useStartVendorResearch, useVendor, useVendorResearchHistory } from '@/queries/vendors'
import { VendorResearchStatus, ApiResponse, VendorResearchRecord } from '@/types/api'

const statusStyles: Record<VendorResearchStatus, { label: string; className: string }> = {
  [VendorResearchStatus.pending]: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  [VendorResearchStatus.in_progress]: {
    label: 'In Progress',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  [VendorResearchStatus.completed]: {
    label: 'Completed',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  [VendorResearchStatus.failed]: {
    label: 'Failed',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
}

const formatDateTime = (value?: string) => {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString()
  } catch (error) {
    console.error('Failed to format date', error)
    return value
  }
}

const VendorResearchOverview = () => {
  const { vendorId } = Route.useParams()
  const { data: vendorResponse } = useVendor(vendorId)
  const {
    data: researchResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useVendorResearchHistory(vendorId)
  const startResearch = useStartVendorResearch()

  const vendor = vendorResponse?.success ? vendorResponse.data : undefined
  const vendorName = vendor?.companyName ?? `Vendor ${vendorId}`

  const records = researchResponse?.success ? researchResponse.data : []

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      const left = new Date(a.requestedAt).getTime()
      const right = new Date(b.requestedAt).getTime()
      return right - left
    })
  }, [records])

  const totalRuns = sortedRecords.length
  const activeRuns = sortedRecords.filter((record) =>
    record.status === VendorResearchStatus.pending || record.status === VendorResearchStatus.in_progress,
  ).length
  const completedRuns = sortedRecords.filter((record) => record.status === VendorResearchStatus.completed).length
  const failedRuns = sortedRecords.filter((record) => record.status === VendorResearchStatus.failed).length

  const apiErrorMessage = researchResponse && !researchResponse.success ? researchResponse.error : null
  const loadError = error instanceof Error ? error.message : apiErrorMessage

  const handleStartResearch = () => {
    startResearch.mutate(vendorId, {
      onSuccess: (result: ApiResponse<VendorResearchRecord>) => {
        if (result.success) {
          alert('AI research has been queued. Refresh to watch its progress.')
        } else if (result.error) {
          alert(`Unable to queue research: ${result.error}`)
        }
      },
      onError: (err: Error) => {
        console.error('Failed to start vendor research', err)
        alert('Unable to queue research right now. Please try again later.')
      },
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Loading research history…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin/vendors/$vendorId/edit" params={{ vendorId }}>
                  <ArrowLeft className="w-4 h-4" />
                  Back to vendor
                </Link>
              </Button>
              <span>AI Research</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Research Overview</h1>
              <p className="text-sm text-gray-600">{vendorName}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching && !isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={startResearch.isPending}
              onClick={handleStartResearch}
            >
              {startResearch.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
              Queue new research
            </Button>
          </div>
        </div>

        {loadError && (
          <div className="flex items-center gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">Unable to load research history</p>
              <p className="text-xs">{loadError}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-500">Total runs</p>
            <p className="text-2xl font-semibold text-gray-900">{totalRuns}</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-semibold text-gray-900">{activeRuns}</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-semibold text-gray-900">{completedRuns}</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-500">Failed</p>
            <p className="text-2xl font-semibold text-gray-900">{failedRuns}</p>
          </div>
        </div>

        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3 bg-gray-50">
            <p className="text-sm text-gray-600">
              Tracking {totalRuns} research run{totalRuns === 1 ? '' : 's'} for vendor #{vendorId}
            </p>
            {sortedRecords[0] && (
              <p className="text-xs text-gray-500">
                Last updated {formatDateTime(sortedRecords[0].updatedAt)}
              </p>
            )}
          </div>

          {sortedRecords.length === 0 ? (
            <div className="px-6 py-12 text-center space-y-3 text-gray-600">
              <p className="font-medium text-gray-900">No research runs yet</p>
              <p className="text-sm">Queue AI research to see a timeline of activity for this vendor.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                    <th className="px-4 py-3">Run</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Requested</th>
                    <th className="px-4 py-3">Started</th>
                    <th className="px-4 py-3">Completed</th>
                    <th className="px-4 py-3">Model</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                  {sortedRecords.map((record) => {
                    const status = statusStyles[record.status]

                    return (
                      <Fragment key={record.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-900">#{record.id}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">{formatDateTime(record.requestedAt)}</td>
                          <td className="px-4 py-3">{formatDateTime(record.startedAt)}</td>
                          <td className="px-4 py-3">{formatDateTime(record.completedAt)}</td>
                          <td className="px-4 py-3">{record.llmModel ?? '—'}</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <Button asChild size="sm" variant="outline">
                                <Link
                                  to="/admin/vendors/$vendorId/research/$researchId/details"
                                  params={{ vendorId, researchId: String(record.id) }}
                                >
                                  View details
                                </Link>
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {record.errorMessage && (
                          <tr className="bg-red-50/60">
                            <td colSpan={7} className="px-4 py-3 text-sm text-red-700">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 mt-0.5" />
                                <div>
                                  <p className="font-semibold">Run reported an error</p>
                                  <p className="text-xs text-red-600">{record.errorMessage}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/admin/vendors/$vendorId/research/')({
  component: () => (
    <AuthGuard requiredRole="admin">
      <VendorResearchOverview />
    </AuthGuard>
  ),
})
