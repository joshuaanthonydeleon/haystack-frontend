import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState, useEffect } from 'react'
import { z } from 'zod'
import {
  Activity,
  BarChart3,
  Building2,
  FileText,
  Shield,
  TrendingUp,
} from 'lucide-react'
import { AuthGuard } from '../../components/guards/AuthGuard'
import {
  OverviewTab,
  VendorsTab,
  VerificationRequestsTab,
  ClaimsTab,
  AnalyticsTab,
  ActivityTab,
} from './components'
import type { AdminMetrics, VendorPerformanceMetrics, Vendor, VendorClaim } from '../../types/api'
import { VendorCategory, VendorStatus } from '../../types/api'
import { apiService } from '../../services/api'

const adminDashboardSearchSchema = z.object({
  tab: z.string().optional().default('overview'),
})

export const Route = createFileRoute('/admin/dashboard')({
  component: () => (
    <AuthGuard requiredRole="admin">
      <AdminDashboard />
    </AuthGuard>
  ),
  validateSearch: adminDashboardSearchSchema,
})

const AdminDashboard = () => {
  const { tab } = Route.useSearch()
  const navigate = Route.useNavigate()
  const [activeTab, setActiveTab] = useState(tab)
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null)
  const [performanceData, setPerformanceData] = useState<VendorPerformanceMetrics[]>([])
  const [pendingVerifications, setPendingVerifications] = useState<Vendor[]>([])
  const [pendingClaims, setPendingClaims] = useState<VendorClaim[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [vendorFilters, setVendorFilters] = useState<{ status: 'all' | VendorStatus; category: 'all' | VendorCategory }>({
    status: 'all',
    category: 'all'
  })
  const [vendorError, setVendorError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Sync activeTab with URL search params
  useEffect(() => {
    setActiveTab(tab)
  }, [tab])

  // Function to handle tab changes and update URL
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
    navigate({ search: { tab: newTab } })
  }

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setVendorError(null)

        const [metricsRes, performanceRes, verificationRequestsRes, claimsRes] = await Promise.all([
          apiService.getAdminMetrics(),
          apiService.getVendorPerformanceMetrics(),
          apiService.getVendorVerificationRequests(),
          apiService.getVendorClaims()
        ])

        if (metricsRes.success) setMetrics(metricsRes.data)
        if (performanceRes.success) setPerformanceData(performanceRes.data)
        if (verificationRequestsRes.success) setPendingVerifications(verificationRequestsRes.data)
        if (claimsRes.success) setPendingClaims(claimsRes.data.filter(claim => claim.status === 'pending'))
      } catch (error) {
        console.error('Failed to load admin data:', error)
        setVendorError('Failed to load vendors')
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, [])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'vendors', label: 'Vendor Management', icon: Building2 },
    { id: 'verification-requests', label: 'Verification Requests', icon: Shield },
    { id: 'claims', label: 'Vendor Claims', icon: FileText },
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab metrics={metrics} onTabChange={handleTabChange} />
      case 'vendors':
        return (
          <VendorsTab
            vendorFilters={vendorFilters}
            setVendorFilters={setVendorFilters}
            categoryOptions={categoryOptions}
            vendorError={vendorError}
            onVendorsLoaded={setVendors}
          />
        )
      case 'verification-requests':
        return (
          <VerificationRequestsTab
            pendingVerifications={pendingVerifications}
            onVerificationCompleted={(vendorId) => {
              setPendingVerifications(prev => prev.filter(vendor => vendor.id !== vendorId))
            }}
          />
        )
      case 'claims':
        return (
          <ClaimsTab
            pendingClaims={pendingClaims}
            onClaimCompleted={(claimId) => {
              setPendingClaims(prev => prev.filter(claim => claim.id !== claimId))
            }}
          />
        )
      case 'analytics':
        return <AnalyticsTab performanceData={performanceData} />
      case 'activity':
        return <ActivityTab metrics={metrics} setMetrics={setMetrics} />
      default:
        return <OverviewTab metrics={metrics} onTabChange={setActiveTab} />
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
                    onClick={() => handleTabChange(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {tab.id === 'verification-requests' && pendingVerifications.length > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                        {pendingVerifications.length}
                      </span>
                    )}
                    {tab.id === 'claims' && pendingClaims.length > 0 && (
                      <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
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
