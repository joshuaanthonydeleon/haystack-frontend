import { createFileRoute } from '@tanstack/react-router'
import { Search, Building2, Users, TrendingUp, FileText, Star } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { AuthGuard } from '../components/guards/AuthGuard'

export const Route = createFileRoute('/dashboard')({
  component: () => (
    <AuthGuard requiredRole={['bank', 'credit-union', 'vendor', 'admin']}>
      <Dashboard />
    </AuthGuard>
  ),
})

const Dashboard = () => {
  const mockRecommendations = [
    {
      id: 1,
      name: 'CoreTech Solutions',
      category: 'Core Banking',
      compatibility: 95,
      rating: 4.8,
      description: 'Modern core banking platform for community banks',
      logoUrl: '/api/placeholder/80/80'
    },
    {
      id: 2,
      name: 'SecureBank API',
      category: 'Digital Banking',
      compatibility: 88,
      rating: 4.6,
      description: 'Mobile and web banking solutions',
      logoUrl: '/api/placeholder/80/80'
    },
    {
      id: 3,
      name: 'ComplianceFirst',
      category: 'RegTech',
      compatibility: 92,
      rating: 4.9,
      description: 'Automated compliance and risk management',
      logoUrl: '/api/placeholder/80/80'
    }
  ]

  const stats = [
    { label: 'Active Vendors', value: '2,847', icon: Building2, change: '+12%' },
    { label: 'Bank Partners', value: '1,293', icon: Users, change: '+8%' },
    { label: 'Successful Matches', value: '5,621', icon: TrendingUp, change: '+23%' },
    { label: 'Due Diligence Docs', value: '12,456', icon: FileText, change: '+15%' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Haystack FI
          </h1>
          <p className="text-gray-600 mt-2">
            Discover and connect with vetted technology vendors for your financial institution
          </p>
        </div>

        {/* Quick Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Find Vendors</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search for vendors, solutions, or categories..."
                className="w-full"
              />
            </div>
            <Button className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change} from last month</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Recommended Vendors */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Recommended for Your Bank</h2>
          <div className="grid gap-6">
            {mockRecommendations.map((vendor) => (
              <div key={vendor.id} className="flex items-center gap-6 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{vendor.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {vendor.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{vendor.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{vendor.rating}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {vendor.compatibility}% Compatibility Match
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button size="sm">
                    Request Demo
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Button variant="outline">View All Recommendations</Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Explore Categories</h3>
            <div className="space-y-2">
              <a href="#" className="block text-blue-600 hover:text-blue-800">Core Banking Systems</a>
              <a href="#" className="block text-blue-600 hover:text-blue-800">Digital Banking</a>
              <a href="#" className="block text-blue-600 hover:text-blue-800">Payment Processing</a>
              <a href="#" className="block text-blue-600 hover:text-blue-800">Compliance & Risk</a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">Demo Requested</p>
                <p className="text-gray-600">CoreTech Solutions - 2 hours ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Profile Viewed</p>
                <p className="text-gray-600">SecureBank API - 1 day ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Document Downloaded</p>
                <p className="text-gray-600">ComplianceFirst SOC2 - 2 days ago</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              Our team can help you find the right vendors for your specific needs.
            </p>
            <Button className="w-full">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}