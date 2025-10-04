import { useState } from 'react'
import { BarChart3 } from 'lucide-react'
import type { VendorPerformanceMetrics } from '../../../types/api'
import { VendorMetricsModal } from './modals/VendorMetricsModal'

interface AnalyticsTabProps {
  performanceData: VendorPerformanceMetrics[]
}

export const AnalyticsTab = ({ performanceData }: AnalyticsTabProps) => {
  const [selectedVendor, setSelectedVendor] = useState<VendorPerformanceMetrics | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleVendorClick = (vendor: VendorPerformanceMetrics) => {
    setSelectedVendor(vendor)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedVendor(null)
  }
  return (
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
              <div 
                key={vendor.vendorId} 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200 border border-transparent hover:border-gray-200"
                onClick={() => handleVendorClick(vendor)}
              >
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

      {/* Vendor Metrics Modal */}
      <VendorMetricsModal
        vendor={selectedVendor}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
