import { createFileRoute, Link } from '@tanstack/react-router'
import { Search, Shield, TrendingUp, Users, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'

const HomePage = () => {
  const features = [
    {
      icon: Search,
      title: 'Smart Vendor Matching',
      description: 'Find technology vendors that match your core system and specific needs with our intelligent matching engine.'
    },
    {
      icon: Shield,
      title: 'Verified Partners',
      description: 'All vendors are thoroughly vetted with compliance documentation and due diligence materials readily available.'
    },
    {
      icon: Users,
      title: 'Bank-First Experience',
      description: 'Designed specifically for community banks and credit unions with features that matter to your institution.'
    },
    {
      icon: TrendingUp,
      title: 'Qualified Leads',
      description: 'Vendors receive only qualified, interested prospects - real bankers ready to discuss solutions.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Connect Banks with
              <span className="block text-blue-200">Vetted Technology</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Haystack FI is the marketplace where community banks and credit unions discover,
              vet, and connect with technology vendors that match their specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/signup">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/vendors">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8">
                  Browse Vendors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Haystack FI?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're solving the vendor discovery problem for both banks and technology companies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="text-center">
                  <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Find Your Perfect Technology Partners?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of banks already using Haystack FI to discover and vet technology vendors.
            </p>
            <Link to="/auth/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8">
                Sign Up Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: HomePage,
})