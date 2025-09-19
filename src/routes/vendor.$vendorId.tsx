import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Star,
  MapPin,
  Users,
  Calendar,
  FileText,
  Shield,
  Building2,
  Phone,
  Mail,
  Globe,
  Loader2
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { DemoRequestModal } from '../components/DemoRequestModal'
import { useVendor } from '../queries/vendors'

const VendorProfile = () => {
  const { vendorId } = Route.useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [demoModalOpen, setDemoModalOpen] = useState(false)

  // Fetch vendor data using TanStack Query
  const { data: vendorResponse, isLoading, error } = useVendor(vendorId)
  const vendor = vendorResponse?.success ? vendorResponse.data : null

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading vendor profile...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vendor Not Found</h1>
          <p className="text-gray-600 mb-4">The vendor you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  // Use the vendor data from the API response
  // The vendor object now contains all the real data fetched via TanStack Query

  const reviews = [
    {
      id: 1,
      reviewer: 'Sarah Johnson',
      title: 'CTO, First National Bank',
      rating: 5,
      date: '2024-01-15',
      content: 'CoreTech has transformed our operations. The real-time processing and robust API have enabled us to innovate faster than ever before.'
    },
    {
      id: 2,
      reviewer: 'Michael Chen',
      title: 'VP Technology, Community Credit Union',
      rating: 5,
      date: '2024-01-08',
      content: 'Excellent platform with outstanding support. The migration was seamless and the team was incredibly helpful throughout the process.'
    },
    {
      id: 3,
      reviewer: 'Lisa Rodriguez',
      title: 'IT Director, Regional Bank',
      rating: 4,
      date: '2023-12-20',
      content: 'Solid core banking solution. Good feature set and reliable performance. Would recommend to other community banks.'
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'compliance', label: 'Compliance' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About {vendor.companyName}</h3>
              <div className="prose prose-gray max-w-none">
                {vendor.profile?.detailedDescription?.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-600 mb-4">{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {vendor.profile?.features?.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Integrations</h4>
                <ul className="space-y-2">
                  {vendor.profile?.integrations?.map((integration, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                      {integration}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )

      case 'features':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Detailed Features</h3>
              <div className="grid gap-4">
                {vendor.profile?.features?.map((feature, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{feature}</h4>
                    <p className="text-sm text-gray-600">
                      Detailed description of this feature would go here, including benefits, specifications, and use cases.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'reviews':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Customer Reviews</h3>
              <div className="text-sm text-gray-600">
                {reviews.length} reviews
              </div>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium text-gray-900">{review.reviewer}</div>
                      <div className="text-sm text-gray-600">{review.title}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">{review.date}</div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'compliance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Certifications & Compliance</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {vendor.profile?.certifications?.map((cert, index) => (
                  <div key={index} className="flex items-center border rounded-lg p-4">
                    <Shield className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <div className="font-medium">{cert}</div>
                      <div className="text-sm text-gray-600">Verified certification</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Ideal Client Profile</h4>
              <div className="space-y-2">
                {vendor.profile?.clientSize?.map((size, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <Building2 className="w-4 h-4 mr-2 text-blue-600" />
                    {size}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex items-start gap-8">
            {/* Logo */}
            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-16 h-16 text-gray-400" />
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {vendor.companyName}
                  </h1>
                  <div className="flex items-center gap-6 text-gray-600 mb-3">
                    <span className="inline-flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {vendor.profile?.category}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {vendor.profile?.location}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {vendor.profile?.employees} employees
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Founded {vendor.profile?.founded}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-xl font-semibold">{vendor.profile?.rating}</span>
                    <span className="text-gray-600">({vendor.ratings.length} reviews)</span>
                  </div>
                  <div className="text-green-600 font-semibold">
                    {vendor.profile?.compatibility}% Compatibility Match
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                {vendor.profile?.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {vendor.profile?.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Contact Info */}
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                <a href={vendor.website} className="inline-flex items-center gap-1 hover:text-blue-600">
                  <Globe className="w-4 h-4" />
                  Website
                </a>
                {vendor.profile?.phone && (
                  <a href={`tel:${vendor.profile?.phone}`} className="inline-flex items-center gap-1 hover:text-blue-600">
                    <Phone className="w-4 h-4" />
                    {vendor.profile?.phone}
                  </a>
                )}
                {vendor.profile?.email && (
                  <a href={`mailto:${vendor.profile?.email}`} className="inline-flex items-center gap-1 hover:text-blue-600">
                    <Mail className="w-4 h-4" />
                    Contact
                  </a>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button size="lg" className="px-6" onClick={() => setDemoModalOpen(true)}>
                  Request Demo
                </Button>
                <Button variant="outline" size="lg" className="px-6">
                  <FileText className="w-4 h-4 mr-2" />
                  View Documentation
                </Button>
                <Button variant="outline" size="lg">
                  Save Vendor
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b">
            <nav className="flex space-x-8 px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {renderTabContent()}
          </div>
        </div>

        {/* Demo Request Modal */}
        <DemoRequestModal
          vendor={{ name: vendor.companyName, category: vendor.profile?.category ?? '' }}
          isOpen={demoModalOpen}
          onClose={() => setDemoModalOpen(false)}
        />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/vendor/$vendorId')({
  component: VendorProfile,
})