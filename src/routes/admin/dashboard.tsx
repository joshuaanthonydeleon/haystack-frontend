import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState, useEffect } from 'react'
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bot,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  Shield,
  TrendingDown,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { AuthGuard } from '../../components/guards/AuthGuard'
import type { AdminMetrics, VendorPerformanceMetrics, VendorClaim, Vendor } from '../../types/api'
import { VendorCategory, VendorStatus } from '../../types/api'
import { apiService } from '../../services/api'
import { useStartVendorResearch } from '../../queries/vendors'

export const Route = createFileRoute('/admin/dashboard')({
  component: () => (
    <AuthGuard requiredRole="admin">
      <AdminDashboard />
    </AuthGuard>
  ),
})

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null)
  const [performanceData, setPerformanceData] = useState<VendorPerformanceMetrics[]>([])
  const [pendingClaims, setPendingClaims] = useState<VendorClaim[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [vendorFilters, setVendorFilters] = useState<{ status: 'all' | VendorStatus; category: 'all' | VendorCategory }>({
    status: 'all',
    category: 'all'
  })
  const [vendorError, setVendorError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const startResearchMutation = useStartVendorResearch()

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setVendorError(null)

        const [metricsRes, performanceRes, claimsRes, vendorsRes] = await Promise.all([
          apiService.getAdminMetrics(),
          apiService.getVendorPerformanceMetrics(),
          apiService.getVendorClaims(),
          apiService.searchVendors({ limit: 100 })
        ])

        if (metricsRes.success) setMetrics(metricsRes.data)
        if (performanceRes.success) setPerformanceData(performanceRes.data)
        if (claimsRes.success) {
          setPendingClaims(claimsRes.data.filter(claim => claim.status === 'pending'))
        }
        if (vendorsRes.success) {
          setVendors(vendorsRes.data.vendors)
        } else if (vendorsRes.error) {
          setVendorError(vendorsRes.error)
        }
      } catch (error) {
        console.error('Failed to load admin data:', error)
        setVendorError('Failed to load vendors')
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, [])

  const handleClaimAction = async (claimId: string, approved: boolean, reason?: string) => {
    try {
      const result = await apiService.approveVendorClaim(claimId, approved, reason)
      if (result.success) {
        setPendingClaims(prev => prev.filter(claim => claim.id !== claimId))
        alert(`Claim ${approved ? 'approved' : 'rejected'} successfully!`)
      }
    } catch (error) {
      console.error('Failed to process claim:', error)
      alert('Failed to process claim. Please try again.')
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'vendors', label: 'Vendor Management', icon: Building2 },
    { id: 'claims', label: 'Verification Claims', icon: Shield },
    { id: 'analytics', label: 'Performance Analytics', icon: TrendingUp },
    { id: 'activity', label: 'Recent Activity', icon: Activity },
  ]

  const categoryOptions = useMemo(() => {
    const categories = new Set<string>()
    vendors.forEach(vendor => {
      if (vendor.profile?.category) {
        categories.add(vendor.profile.category)
      }
    })
    return Array.from(categories)
  }, [vendors])

  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      const profile = vendor.profile

      if (vendorFilters.status !== 'all') {
        if (!profile || profile.status !== vendorFilters.status) {
          return false
        }
      }

      if (vendorFilters.category !== 'all') {
        if (!profile || profile.category !== vendorFilters.category) {
          return false
        }
      }

      return true
    })
  }, [vendors, vendorFilters])

  const statusStyles: Record<VendorStatus, string> = {
    [VendorStatus.active]: 'bg-green-100 text-green-800',
    [VendorStatus.pending]: 'bg-yellow-100 text-yellow-800',
    [VendorStatus.rejected]: 'bg-gray-100 text-gray-700',
    [VendorStatus.suspended]: 'bg-red-100 text-red-800',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.totalVendors.toLocaleString()}</p>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+{metrics?.monthlyGrowth.vendors}%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Banks</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.totalBanks.toLocaleString()}</p>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+{metrics?.monthlyGrowth.banks}%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Demo Requests</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.totalDemoRequests.toLocaleString()}</p>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+{metrics?.monthlyGrowth.demoRequests}%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.pendingVerifications}</p>
              <div className="flex items-center text-sm">
                <AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-orange-600">Requires attention</span>
              </div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Categories and Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
          <div className="space-y-4">
            {metrics?.topCategories.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm font-semibold text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{category.category}</p>
                    <p className="text-sm text-gray-600">{category.count} vendors</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm">
                    {category.growth > 0 ? (
                      <>
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-600">+{category.growth}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        <span className="text-red-600">{category.growth}%</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {metrics?.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  {activity.type === 'vendor_signup' && <Building2 className="w-4 h-4 text-blue-600" />}
                  {activity.type === 'demo_request' && <Calendar className="w-4 h-4 text-green-600" />}
                  {activity.type === 'review_submitted' && <FileText className="w-4 h-4 text-purple-600" />}
                  {activity.type === 'verification_pending' && <Shield className="w-4 h-4 text-orange-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setActiveTab('claims')}
          >
            <Shield className="w-4 h-4" />
            Review Claims ({pendingClaims.length})
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            View Reports
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            System Logs
          </Button>
        </div>
      </div>
    </div>
  )

  const renderVendorsTab = () => (
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
          {filteredVendors.length === 0 && !vendorError ? (
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
                {filteredVendors.map((vendor) => {
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

  const renderClaimsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Verification Claims</h2>
        <div className="text-sm text-gray-600">
          {pendingClaims.length} pending reviews
        </div>
      </div>

      <div className="grid gap-6">
        {pendingClaims.map((claim) => (
          <div key={claim.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {claim.firstName} {claim.lastName}
                </h3>
                <p className="text-gray-600">{claim.title}</p>
                <p className="text-sm text-gray-500">{claim.email}</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                  {claim.status}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(claim.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Company Email</p>
                <p className="text-sm text-gray-600">{claim.companyEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Verification Method</p>
                <p className="text-sm text-gray-600">{claim.verificationMethod}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Phone</p>
                <p className="text-sm text-gray-600">{claim.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Vendor ID</p>
                <p className="text-sm text-gray-600">{claim.vendorId}</p>
              </div>
            </div>

            {claim.message && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Additional Message</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  {claim.message}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => handleClaimAction(claim.id, true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const reason = prompt('Reason for rejection (optional):')
                  handleClaimAction(claim.id, false, reason || undefined)
                }}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        ))}

        {pendingClaims.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Claims</h3>
            <p className="text-gray-600">All verification claims have been reviewed.</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Platform Growth</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Growth chart visualization</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
          <div className="space-y-3">
            {performanceData.slice(0, 5).map((vendor, index) => (
              <div key={vendor.vendorId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">{vendor.vendorName}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{vendor.conversionRate}%</p>
                  <p className="text-xs text-gray-600">conversion rate</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">System Health</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">99.9%</div>
            <p className="text-sm text-gray-600">Uptime</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">1.2s</div>
            <p className="text-sm text-gray-600">Avg Response Time</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">145ms</div>
            <p className="text-sm text-gray-600">Database Query Time</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">12.4%</div>
            <p className="text-sm text-gray-600">Error Rate</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderActivityTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">System Activity</h3>
            <div className="flex gap-2">
              <select className="border rounded-md px-3 py-1 text-sm">
                <option value="all">All Activities</option>
                <option value="vendor">Vendor Actions</option>
                <option value="user">User Actions</option>
                <option value="system">System Events</option>
              </select>
              <Button variant="outline" size="sm">Refresh</Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {metrics?.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-600">
                    {activity.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                  <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverviewTab()
      case 'vendors': return renderVendorsTab()
      case 'claims': return renderClaimsTab()
      case 'analytics': return renderAnalyticsTab()
      case 'activity': return renderActivityTab()
      default: return renderOverviewTab()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage vendors, review claims, and monitor platform performance
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="border-b">
            <nav className="flex space-x-8 px-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {tab.id === 'claims' && pendingClaims.length > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                        {pendingClaims.length}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
