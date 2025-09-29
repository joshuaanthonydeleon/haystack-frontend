import { Link } from '@tanstack/react-router'
import { Bot, Building2 } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import type { Vendor } from '../../../types/api'
import { VendorCategory, VendorStatus } from '../../../types/api'
import { useStartVendorResearch } from '../../../queries/vendors'

interface VendorsTabProps {
  vendors: Vendor[]
  vendorFilters: { status: 'all' | VendorStatus; category: 'all' | VendorCategory }
  setVendorFilters: React.Dispatch<React.SetStateAction<{ status: 'all' | VendorStatus; category: 'all' | VendorCategory }>>
  categoryOptions: string[]
  vendorError: string | null
}

export const VendorsTab = ({ 
  vendors, 
  vendorFilters, 
  setVendorFilters, 
  categoryOptions, 
  vendorError 
}: VendorsTabProps) => {
  const startResearchMutation = useStartVendorResearch()

  const statusStyles: Record<VendorStatus, string> = {
    [VendorStatus.active]: 'bg-green-100 text-green-800',
    [VendorStatus.pending]: 'bg-yellow-100 text-yellow-800',
    [VendorStatus.rejected]: 'bg-gray-100 text-gray-700',
    [VendorStatus.suspended]: 'bg-red-100 text-red-800',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Vendor Management</h2>
        <div className="flex gap-2">
          <Button variant="outline">Filter</Button>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h3 className="text-lg font-semibold">All Vendors</h3>
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                className="border rounded-md px-3 py-1 text-sm"
                value={vendorFilters.status}
                onChange={(event) =>
                  setVendorFilters((prev) => ({
                    ...prev,
                    status: event.target.value as 'all' | VendorStatus,
                  }))
                }
              >
                <option value="all">All Status</option>
                {Object.values(VendorStatus).map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <select
                className="border rounded-md px-3 py-1 text-sm"
                value={vendorFilters.category}
                onChange={(event) =>
                  setVendorFilters((prev) => ({
                    ...prev,
                    category: event.target.value as 'all' | VendorCategory,
                  }))
                }
              >
                <option value="all">All Categories</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {vendorError && (
          <div className="px-6 py-3 bg-red-50 text-sm text-red-700 border-b">
            {vendorError}
          </div>
        )}

        <div className="overflow-x-auto">
          {vendors.length === 0 && !vendorError ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>No vendors match the selected filters.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metrics
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendors.map((vendor) => {
                  const profile = vendor.profile
                  const status = profile?.status
                  const statusLabel = status
                    ? status.charAt(0).toUpperCase() + status.slice(1)
                    : 'Unknown'
                  const statusClass = status ? statusStyles[status] : 'bg-gray-100 text-gray-700'
                  const lastActivity = profile?.lastActivityAt || vendor.updatedAt || vendor.createdAt

                  return (
                    <tr key={vendor.id}>
                      <td className="px-6 py-4 whitespace-normal">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">{vendor.companyName}</p>
                            {vendor.website && (
                              <a
                                href={vendor.website.startsWith('http') ? vendor.website : `https://${vendor.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 break-all"
                              >
                                {vendor.website}
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {profile?.category || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          <p>
                            Rating: {profile?.rating ? profile.rating.toFixed(1) : 'N/A'}
                          </p>
                          <p>Compatibility: {profile?.compatibility ?? 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {lastActivity ? new Date(lastActivity).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-wrap gap-2">
                          <Button asChild size="sm" variant="outline">
                            <Link to="/vendors/$vendorId" params={{ vendorId: String(vendor.id) }}>
                              View
                            </Link>
                          </Button>
                          <Button asChild size="sm" variant="outline">
                            <Link to="/admin/vendors/$vendorId/edit" params={{ vendorId: String(vendor.id) }}>
                              Edit
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            className="bg-purple-600 text-white hover:bg-purple-700"
                            disabled={startResearchMutation.isPending}
                            onClick={() => {
                              startResearchMutation.mutate(String(vendor.id), {
                                onSuccess: (response) => {
                                  if (response.success) {
                                    alert('AI research queued successfully. Review results in the research history panel.')
                                  } else if (response.error) {
                                    alert(`Unable to queue research: ${response.error}`)
                                  }
                                },
                                onError: (error) => {
                                  console.error('Failed to queue research', error)
                                  alert('Unable to queue research right now. Check the console for details.')
                                },
                              })
                            }}
                          >
                            <Bot className="w-4 h-4 mr-1" />
                            AI Research
                          </Button>
                          <Button asChild size="sm" variant="outline">
                            <Link to="/admin/vendors/$vendorId/research" params={{ vendorId: String(vendor.id) }}>
                              History
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
