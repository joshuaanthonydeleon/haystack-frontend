import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, Building2, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

export const Route = createFileRoute('/claim')({
  component: ClaimVendor,
})

const ClaimVendor = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showClaimForm, setShowClaimForm] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)

  const mockVendors = [
    {
      id: 1,
      name: 'CoreTech Solutions',
      category: 'Core Banking',
      status: 'unclaimed',
      description: 'Modern core banking platform for community banks',
      website: 'https://coretech-solutions.com'
    },
    {
      id: 2,
      name: 'SecureBank Digital',
      category: 'Digital Banking',
      status: 'claimed',
      description: 'Complete digital banking suite with mobile apps',
      website: 'https://securebank-digital.com'
    },
    {
      id: 3,
      name: 'PayFlow Systems',
      category: 'Payment Processing',
      status: 'unclaimed',
      description: 'Next-generation payment processing platform',
      website: 'https://payflow-systems.com'
    }
  ]

  const [claimFormData, setClaimFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    title: '',
    phone: '',
    companyEmail: '',
    verificationMethod: '',
    message: ''
  })

  const filteredVendors = mockVendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleClaimVendor = (vendor: any) => {
    setSelectedVendor(vendor)
    setShowClaimForm(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Submit claim request to API
    console.log('Claim request submitted:', { vendor: selectedVendor, formData: claimFormData })
    alert('Claim request submitted! We will review your request and get back to you within 2 business days.')
    setShowClaimForm(false)
    setClaimFormData({
      firstName: '',
      lastName: '',
      email: '',
      title: '',
      phone: '',
      companyEmail: '',
      verificationMethod: '',
      message: ''
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setClaimFormData(prev => ({ ...prev, [field]: value }))
  }

  if (showClaimForm && selectedVendor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="mb-8">
              <Button 
                variant="outline" 
                onClick={() => setShowClaimForm(false)}
                className="mb-4"
              >
                ← Back to Search
              </Button>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Claim Your Vendor Profile
              </h1>
              <p className="text-gray-600">
                You're claiming: <strong>{selectedVendor.name}</strong>
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    required
                    value={claimFormData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    required
                    value={claimFormData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Your Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={claimFormData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={claimFormData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="title">Your Title/Position</Label>
                <Input
                  id="title"
                  required
                  value={claimFormData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., CEO, CTO, Sales Director"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="companyEmail">Company Email Domain</Label>
                <Input
                  id="companyEmail"
                  required
                  value={claimFormData.companyEmail}
                  onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                  placeholder="e.g., @yourcompany.com"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must match the domain of the company you're claiming
                </p>
              </div>

              <div>
                <Label htmlFor="verificationMethod">Preferred Verification Method</Label>
                <Select onValueChange={(value) => handleInputChange('verificationMethod', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select verification method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Company Email Verification</SelectItem>
                    <SelectItem value="phone">Phone Call Verification</SelectItem>
                    <SelectItem value="website">Website Domain Verification</SelectItem>
                    <SelectItem value="linkedin">LinkedIn Profile Verification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Additional Information (Optional)</Label>
                <textarea
                  id="message"
                  rows={4}
                  value={claimFormData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Any additional information that might help verify your claim..."
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• We'll verify your identity and authority to represent this company</li>
                  <li>• You'll receive an email confirmation within 24 hours</li>
                  <li>• Once verified, you'll get full access to manage your vendor profile</li>
                  <li>• You can then update company information, add team members, and respond to inquiries</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button type="submit" size="lg" className="px-8">
                  Submit Claim Request
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg"
                  onClick={() => setShowClaimForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Claim Your Vendor Profile
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Is your company already listed on Haystack FI? Claim your profile to manage your 
            presence, respond to inquiries, and connect with qualified bank prospects.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Find Your Company</h2>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for your company name or domain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>Search</Button>
          </div>

          {/* Search Results */}
          <div className="space-y-4">
            {filteredVendors.map((vendor) => (
              <div key={vendor.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                    <p className="text-sm text-gray-600">{vendor.description}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500">{vendor.category}</span>
                      <a 
                        href={vendor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Website
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {vendor.status === 'claimed' ? (
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Already Claimed
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-orange-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Unclaimed
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleClaimVendor(vendor)}
                      >
                        Claim Profile
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredVendors.length === 0 && searchTerm && (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No companies found matching your search.</p>
                <Button variant="outline">
                  Request to Add Your Company
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-semibold mb-6">Benefits of Claiming Your Profile</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Control Your Presence</h3>
              <p className="text-sm text-gray-600">
                Update company information, add team members, and manage your profile content.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Get Verified</h3>
              <p className="text-sm text-gray-600">
                Show banks you're a legitimate, verified vendor they can trust.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <ExternalLink className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Generate Leads</h3>
              <p className="text-sm text-gray-600">
                Receive qualified inquiries from banks actively looking for your solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}