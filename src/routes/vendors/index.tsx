import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Search, Filter, Star, Building2, MapPin, Users, ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DemoRequestModal } from '@/components/DemoRequestModal'
import { useVendors } from '@/queries/vendors'
import type { VendorSearchParams } from '@/types/api'

const VendorSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSize, setSelectedSize] = useState('all')
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [selectedVendorForDemo, setSelectedVendorForDemo] = useState<any>(null)

  // Build search parameters for TanStack Query
  const searchParams: VendorSearchParams = useMemo(() => ({
    q: searchTerm || undefined,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    size: selectedSize === 'all' ? undefined : selectedSize as any,
    page: 1,
    limit: 50,
  }), [searchTerm, selectedCategory, selectedSize])

  // Use TanStack Query to fetch vendors
  const { data: vendorsResponse, isLoading, error } = useVendors(searchParams)

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'core-banking', label: 'Core Banking' },
    { value: 'digital-banking', label: 'Digital Banking' },
    { value: 'payment-processing', label: 'Payment Processing' },
    { value: 'compliance', label: 'Compliance & Risk' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'data-analytics', label: 'Data & Analytics' },
    { value: 'customer-experience', label: 'Customer Experience' },
  ]

  // Extract vendors from API response
  const vendors = vendorsResponse?.success ? vendorsResponse.data.vendors : []
  const totalVendors = vendorsResponse?.success ? vendorsResponse.data.total : 0

  const handleDemoRequest = (vendor: any) => {
    setSelectedVendorForDemo(vendor)
    setDemoModalOpen(true)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Technology Vendors
          </h1>
          <p className="text-gray-600">
            Discover vetted technology partners that match your institution's needs
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search vendors, solutions, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Company Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="small-business">Small Business</SelectItem>
                  <SelectItem value="mid-market">Mid-Market</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading vendors...
              </div>
            ) : error ? (
              <span className="text-red-600">Error loading vendors</span>
            ) : (
              `Showing ${vendors.length} of ${totalVendors} vendors`
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select defaultValue="compatibility">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compatibility">Best Match</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="recent">Recently Added</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Vendor Grid */}
        <div className="grid gap-6">
          {isLoading ? (
            // Loading skeleton
            (Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              </div>
            )))
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">Failed to load vendors</p>
              <p className="text-gray-600 mt-2">Please try refreshing the page</p>
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No vendors found</p>
              <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
            </div>
          ) : (
            vendors.map((vendor) => (
              <div key={vendor.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-6">
                  {/* Logo */}
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-10 h-10 text-gray-400" />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {vendor.companyName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="inline-flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {vendor.profile.category}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {vendor.profile.location}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {vendor.profile.size}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          {vendor.profile.rating ? (
                            <>
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-semibold">{vendor.profile.rating}</span>
                              <span className="text-sm text-gray-600">({vendor.ratings.length})</span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-600">No ratings</span>
                          )}
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          {vendor.profile.compatibility}% Match
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">
                      {vendor.profile.summary}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {vendor.profile.tags && vendor.profile.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <Link to="/vendors/$vendorId" params={{ vendorId: vendor.id }}>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4" />
                          View Profile
                        </Button>
                      </Link>
                      <Button size="sm" onClick={() => handleDemoRequest(vendor)}>
                        Request Demo
                      </Button>
                      <Button variant="outline" size="sm">
                        Save Vendor
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline">
            Load More Vendors
          </Button>
        </div>

        {/* Demo Request Modal */}
        {selectedVendorForDemo && (
          <DemoRequestModal
            vendor={selectedVendorForDemo}
            isOpen={demoModalOpen}
            onClose={() => {
              setDemoModalOpen(false)
              setSelectedVendorForDemo(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/vendors/')({
  component: VendorSearch,
})