import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import { X, TrendingUp, Eye, Users, Star, Download, Calendar, BarChart3 } from 'lucide-react'
import type { VendorPerformanceMetrics } from '../../../../types/api'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface VendorMetricsModalProps {
  vendor: VendorPerformanceMetrics | null
  isOpen: boolean
  onClose: () => void
}

export const VendorMetricsModal = ({ vendor, isOpen, onClose }: VendorMetricsModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      // Reset animation after modal opens
      setTimeout(() => setIsAnimating(false), 500)
    }
  }, [isOpen])

  if (!vendor) return null

  // Chart data for monthly trend
  const trendData = {
    labels: vendor.monthlyTrend.map(item => item.month),
    datasets: [
      {
        label: 'Profile Views',
        data: vendor.monthlyTrend.map(item => item.views),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Demo Requests',
        data: vendor.monthlyTrend.map(item => item.demos),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Conversions',
        data: vendor.monthlyTrend.map(item => item.conversions),
        borderColor: 'rgb(245, 101, 101)',
        backgroundColor: 'rgba(245, 101, 101, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  // Chart data for key metrics comparison
  const metricsData = {
    labels: ['Profile Views', 'Demo Requests', 'Documents Downloaded', 'Reviews'],
    datasets: [
      {
        label: 'Count',
        data: [
          vendor.profileViews,
          vendor.demoRequests,
          vendor.documentsDownloaded,
          vendor.reviewCount,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 101, 101, 0.8)',
          'rgba(251, 191, 36, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 101, 101)',
          'rgb(251, 191, 36)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: isAnimating ? 1000 : 0,
      easing: 'easeInOutQuart' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: 'rgb(107, 114, 128)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: 'rgb(107, 114, 128)',
        },
      },
    },
  }

  const barOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: false,
      },
    },
  }

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{vendor.vendorName}</h2>
              <p className="text-gray-600 mt-1">Performance Analytics</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Profile Views</p>
                    <p className="text-3xl font-bold text-blue-900">{vendor.profileViews.toLocaleString()}</p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Demo Requests</p>
                    <p className="text-3xl font-bold text-green-900">{vendor.demoRequests.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Conversion Rate</p>
                    <p className="text-3xl font-bold text-purple-900">{vendor.conversionRate}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Average Rating</p>
                    <p className="text-3xl font-bold text-yellow-900">{vendor.averageRating.toFixed(1)}</p>
                    <p className="text-xs text-yellow-700">{vendor.reviewCount} reviews</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monthly Trend Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Monthly Performance Trend
                </h3>
                <div className="h-80">
                  <Line data={trendData} options={chartOptions} />
                </div>
              </div>

              {/* Key Metrics Bar Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Key Metrics Overview
                </h3>
                <div className="h-80">
                  <Bar data={metricsData} options={barOptions} />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Download className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Document Downloads</h4>
                </div>
                <p className="text-2xl font-bold text-gray-900">{vendor.documentsDownloaded.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">Total downloads</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Last Activity</h4>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(vendor.lastActivityAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">Most recent activity</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Review Score</h4>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">{vendor.averageRating.toFixed(1)}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(vendor.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">Based on {vendor.reviewCount} reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}