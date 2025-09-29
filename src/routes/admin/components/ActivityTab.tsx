import { Clock } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import type { AdminMetrics } from '../../../types/api'

interface ActivityTabProps {
  metrics: AdminMetrics | null
}

export const ActivityTab = ({ metrics }: ActivityTabProps) => {
  return (
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
}
