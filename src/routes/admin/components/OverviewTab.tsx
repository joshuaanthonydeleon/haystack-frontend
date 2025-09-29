import {
  Activity,
  BarChart3,
  Building2,
  Calendar,
  Download,
  Eye,
  FileText,
  Shield,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import type { AdminMetrics } from '../../../types/api'

interface OverviewTabProps {
  metrics: AdminMetrics | null
  onTabChange: (tabId: string) => void
}

export const OverviewTab = ({ metrics, onTabChange }: OverviewTabProps) => {
  return (
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
                <Activity className="w-4 h-4 text-orange-500 mr-1" />
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
            onClick={() => onTabChange('verification-requests')}
          >
            <Shield className="w-4 h-4" />
            Review Verification Requests
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
}
