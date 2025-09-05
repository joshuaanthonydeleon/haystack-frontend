import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Users, 
  Eye, 
  Calendar, 
  TrendingUp, 
  Settings, 
  FileText, 
  Star,
  Download,
  MessageSquare
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { AuthGuard } from '../../components/guards/AuthGuard'
import type { DashboardAnalytics, DemoRequest, Review, VendorPerformanceMetrics } from '../../types/api'
import { apiService } from '../../services/api'

export const Route = createFileRoute('/vendor/dashboard')({
  component: () => (
    <AuthGuard requiredRole="vendor">
      <VendorDashboard />
    </AuthGuard>
  ),
})

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [analyticsRes, demosRes, reviewsRes] = await Promise.all([
          apiService.getVendorDashboard(),
          apiService.getDemoRequests('1'), // Current vendor ID
          apiService.getVendorReviews('1')
        ])

        if (analyticsRes.success) setAnalytics(analyticsRes.data)
        if (demosRes.success) setDemoRequests(demosRes.data)
        if (reviewsRes.success) setReviews(reviewsRes.data)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'leads', label: 'Demo Requests', icon: Calendar },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.overview.totalLeads || 0}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.overview.conversionRate || 0}%</p>
              <p className="text-sm text-green-600">+2.4% from last month</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profile Views</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
              <p className="text-sm text-green-600">+18% from last month</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Demo Time</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.overview.avgDemoRequestTime || 0} days</p>
              <p className="text-sm text-red-600">+0.3 days from last month</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Demo Requests</h3>
          <div className="space-y-3">
            {demoRequests.slice(0, 5).map((demo) => (
              <div key={demo.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{demo.firstName} {demo.lastName}</p>
                  <p className="text-sm text-gray-600">{demo.bankName}</p>
                  <p className="text-xs text-gray-500">{new Date(demo.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  demo.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  demo.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {demo.status}
                </span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('leads')}>
            View All Requests
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
          <div className="space-y-3">
            {reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="py-2 border-b last:border-b-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{review.reviewer}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{review.content}</p>
                <p className="text-xs text-gray-500 mt-1">{review.date}</p>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('reviews')}>
            View All Reviews
          </Button>
        </div>
      </div>
    </div>
  )

  const renderLeadsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Demo Requests</h2>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>Schedule Demo</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">All Requests ({demoRequests.length})</h3>
            <div className="flex gap-2">
              <select className="border rounded-md px-3 py-1 text-sm">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {demoRequests.map((demo) => (
                <tr key={demo.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-gray-900">{demo.firstName} {demo.lastName}</p>
                      <p className="text-sm text-gray-600">{demo.title}</p>
                      <p className="text-sm text-gray-600">{demo.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-gray-900">{demo.bankName}</p>
                      <p className="text-sm text-gray-600">{demo.assetsUnderManagement} assets</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{demo.timeline}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      demo.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      demo.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {demo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(demo.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View</Button>
                      {demo.status === 'pending' && (
                        <Button size="sm">Schedule</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderReviewsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
        <div className="text-sm text-gray-600">
          Average Rating: 4.8 ★ ({reviews.length} reviews)
        </div>
      </div>

      <div className="grid gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="font-medium text-gray-900">{review.reviewer}</span>
                  {review.isVerified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Verified</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{review.title}</p>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{review.helpfulCount} helpful</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-3">{review.content}</p>
            
            {review.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {review.tags.map((tag) => (
                  <span key={tag} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics & Performance</h2>
      
      {/* Performance Charts Placeholder */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Lead Generation Trend</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Chart visualization would go here</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Profile Views</span>
              <span className="font-semibold">1,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Demo Requests</span>
              <span className="font-semibold">145</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Scheduled Demos</span>
              <span className="font-semibold">89</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Conversions</span>
              <span className="font-semibold">18</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderProfileTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Company Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input 
              type="text" 
              defaultValue="CoreTech Solutions"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input 
              type="url" 
              defaultValue="https://coretech-solutions.com"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input 
              type="text" 
              defaultValue="Austin, TX"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
            <select className="w-full border rounded-md px-3 py-2">
              <option value="startup">Startup (1-10)</option>
              <option value="small-business">Small Business (11-50)</option>
              <option value="mid-market" selected>Mid-Market (51-500)</option>
              <option value="enterprise">Enterprise (500+)</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            rows={4}
            defaultValue="Modern core banking platform designed specifically for community banks and credit unions."
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <Button>Save Changes</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverviewTab()
      case 'leads': return renderLeadsTab()
      case 'reviews': return renderReviewsTab()
      case 'analytics': return renderAnalyticsTab()
      case 'profile': return renderProfileTab()
      default: return renderOverviewTab()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vendor Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your company profile, track leads, and analyze performance
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
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
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