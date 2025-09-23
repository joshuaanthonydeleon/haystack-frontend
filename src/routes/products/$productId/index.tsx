import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Star,
  Download,
  Heart,
  Share2,
  Play,
  Shield,
  Building2,
  Users,
  Calendar,
  ExternalLink,
  FileText,
  Check,
  X,
  AlertCircle,
  Zap,
  Settings,
  TrendingUp,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DemoRequestModal } from '@/components/DemoRequestModal'
import { PricingModel, type Product, type ProductReview } from '@/types/api'

const ProductProfile = () => {
  const { productId } = Route.useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [selectedScreenshot, setSelectedScreenshot] = useState(0)

  // Mock product data - in real app, this would be fetched based on productId
  const product: Product = {
    id: productId,
    vendorId: 'coretech-001',
    name: 'CoreBanking Pro',
    slug: 'corebanking-pro',
    category: 'Core Banking',
    subcategories: ['Real-time Processing', 'Cloud Banking', 'API Banking'],
    description: 'Next-generation core banking platform designed for community banks and credit unions with real-time processing, comprehensive APIs, and modern cloud architecture.',
    longDescription: `CoreBanking Pro represents the future of banking technology, built from the ground up for modern financial institutions. Our platform combines the reliability banks need with the innovation they want.

    With over 200+ API endpoints, real-time transaction processing, and a microservices architecture, CoreBanking Pro enables financial institutions to launch new products faster, serve customers better, and scale efficiently.

    Trusted by 150+ community banks and credit unions across North America, our platform processes over $50 billion in transactions annually while maintaining 99.99% uptime.`,
    version: '3.2.1',
    rating: 4.8,
    reviewCount: 89,
    compatibility: 92,
    logoUrl: '/api/placeholder/80/80',
    screenshots: [
      '/api/placeholder/800/500',
      '/api/placeholder/800/500',
      '/api/placeholder/800/500',
      '/api/placeholder/800/500'
    ],
    features: [
      {
        id: 'realtime',
        title: 'Real-time Transaction Processing',
        description: 'Process transactions instantly with our advanced real-time processing engine that handles millions of transactions per day.',
        category: 'core',
        isHighlight: true,
        icon: 'Zap'
      },
      {
        id: 'api',
        title: 'Comprehensive API Suite',
        description: '200+ RESTful APIs enable seamless integration with third-party services and custom applications.',
        category: 'core',
        isHighlight: true,
        icon: 'Settings'
      },
      {
        id: 'cloud',
        title: 'Cloud-native Architecture',
        description: 'Built for the cloud with auto-scaling, high availability, and disaster recovery built-in.',
        category: 'core',
        isHighlight: true,
        icon: 'Package'
      },
      {
        id: 'reporting',
        title: 'Advanced Analytics & Reporting',
        description: 'Real-time dashboards and customizable reports provide insights into your banking operations.',
        category: 'advanced',
        isHighlight: false,
        icon: 'TrendingUp'
      },
      {
        id: 'compliance',
        title: 'Built-in Compliance Tools',
        description: 'Automated compliance reporting and monitoring for BSA/AML, OFAC, and other regulatory requirements.',
        category: 'core',
        isHighlight: true,
        icon: 'Shield'
      },
      {
        id: 'mobile',
        title: 'Mobile-first Design',
        description: 'Responsive interfaces that work seamlessly across desktop, tablet, and mobile devices.',
        category: 'advanced',
        isHighlight: false
      }
    ],
    specifications: [
      {
        category: 'Performance',
        items: [
          { label: 'Transaction Processing Speed', value: '<200ms average', isImportant: true },
          { label: 'Concurrent Users', value: '10,000+', isImportant: true },
          { label: 'Uptime SLA', value: '99.99%', isImportant: true },
          { label: 'Data Processing', value: '1M+ transactions/day', isImportant: false }
        ]
      },
      {
        category: 'Security',
        items: [
          { label: 'Encryption', value: 'AES-256, TLS 1.3', isImportant: true },
          { label: 'Authentication', value: 'Multi-factor, SSO, SAML', isImportant: true },
          { label: 'Compliance', value: 'SOC 2, PCI DSS, FFIEC', isImportant: true },
          { label: 'Audit Trail', value: 'Complete transaction logging', isImportant: false }
        ]
      },
      {
        category: 'Integration',
        items: [
          { label: 'API Endpoints', value: '200+ RESTful APIs', isImportant: true },
          { label: 'Data Formats', value: 'JSON, XML, CSV', isImportant: false },
          { label: 'Webhooks', value: 'Real-time event notifications', isImportant: true },
          { label: 'Third-party Integrations', value: '50+ pre-built connectors', isImportant: false }
        ]
      }
    ],
    integrations: [
      'Jack Henry & Associates',
      'Fiserv',
      'Q2 Digital Banking',
      'Alkami Technology',
      'Visa',
      'Mastercard',
      'SWIFT',
      'ACH Network'
    ],
    pricingModel: PricingModel.subscription,
    priceRange: '$5,000 - $25,000/month',
    pricingDetails: [
      {
        name: 'Community',
        description: 'Perfect for small community banks',
        basePrice: 5000,
        billingPeriod: 'monthly',
        features: [
          'Up to 1,000 accounts',
          'Basic reporting',
          'Standard API access',
          'Email support'
        ],
        limitations: [
          'Limited to 5 branches',
          'Standard SLA',
          '50 API calls/minute'
        ],
        isPopular: false
      },
      {
        name: 'Professional',
        description: 'Ideal for growing institutions',
        basePrice: 12000,
        billingPeriod: 'monthly',
        features: [
          'Up to 10,000 accounts',
          'Advanced reporting & analytics',
          'Full API access',
          'Phone & email support',
          'Custom integrations',
          'Dedicated account manager'
        ],
        limitations: [
          'Limited to 20 branches',
          'Premium SLA',
          '500 API calls/minute'
        ],
        isPopular: true
      },
      {
        name: 'Enterprise',
        description: 'For large institutions',
        basePrice: 25000,
        billingPeriod: 'monthly',
        features: [
          'Unlimited accounts',
          'White-label options',
          'Unlimited API access',
          '24/7 dedicated support',
          'Custom development',
          'Implementation assistance'
        ],
        isPopular: false,
        customPricing: true
      }
    ],
    supportedClientSizes: [
      'Community Banks ($50M - $1B assets)',
      'Credit Unions ($100M - $2B assets)',
      'Regional Banks ($1B+ assets)',
      'Neo Banks'
    ],
    systemRequirements: [
      {
        category: 'Cloud Infrastructure',
        requirements: [
          { component: 'Cloud Provider', minimum: 'AWS/Azure/GCP', recommended: 'Multi-cloud setup' },
          { component: 'Bandwidth', minimum: '100 Mbps', recommended: '1 Gbps+' },
          { component: 'Storage', minimum: '1 TB', recommended: '5 TB+' }
        ]
      },
      {
        category: 'On-premises (if applicable)',
        requirements: [
          { component: 'Server', minimum: '16 CPU cores, 64GB RAM', recommended: '32 CPU cores, 128GB RAM' },
          { component: 'Database', minimum: 'PostgreSQL 12+', recommended: 'PostgreSQL 14+ with clustering' },
          { component: 'Operating System', minimum: 'Ubuntu 20.04 LTS', recommended: 'Ubuntu 22.04 LTS' }
        ]
      }
    ],
    certifications: [
      'SOC 2 Type II',
      'PCI DSS Level 1',
      'FFIEC Compliance',
      'ISO 27001',
      'FIPS 140-2'
    ],
    tags: [
      'Core Banking',
      'Real-time',
      'Cloud-native',
      'API-first',
      'Compliance',
      'Mobile-ready'
    ],
    status: 'active',
    releaseDate: '2021-03-15',
    lastUpdated: '2024-02-01',
    vendor: {
      id: 'coretech-001',
      name: 'CoreTech Solutions',
      logoUrl: '/api/placeholder/40/40',
      rating: 4.7,
      supportQuality: 4.9
    },
    metrics: {
      installations: 152,
      demoRequests: 1250,
      savedCount: 890,
      viewCount: 15420
    },
    createdAt: '2021-03-15T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  }

  // Mock reviews data
  const reviews: ProductReview[] = [
    {
      id: '1',
      productId: productId,
      userId: 'user1',
      reviewer: 'Sarah Johnson',
      institutionName: 'First National Bank',
      institutionType: 'bank',
      title: 'Excellent platform with outstanding support',
      rating: 5,
      content: 'CoreBanking Pro has transformed our operations. The real-time processing is incredibly fast and the API integration made connecting our existing tools seamless.',
      pros: [
        'Lightning-fast processing',
        'Excellent API documentation',
        'Responsive customer support',
        'Easy to integrate'
      ],
      cons: [
        'Initial setup can be complex',
        'Pricing could be more competitive'
      ],
      isVerified: true,
      isAnonymous: false,
      usageDuration: '18 months',
      implementationRating: 4,
      supportRating: 5,
      valueRating: 4,
      date: '2024-01-15',
      helpfulCount: 12,
      tags: ['implementation', 'support', 'performance']
    },
    {
      id: '2',
      productId: productId,
      userId: 'user2',
      reviewer: 'Michael Chen',
      institutionName: 'Community Credit Union',
      institutionType: 'credit-union',
      title: 'Solid choice for growing institutions',
      rating: 4,
      content: 'We migrated from a legacy system and the difference is night and day. The reporting capabilities are excellent and the compliance tools save us hours each week.',
      pros: [
        'Modern interface',
        'Great reporting tools',
        'Built-in compliance features',
        'Scalable architecture'
      ],
      cons: [
        'Learning curve for staff',
        'Some advanced features require training'
      ],
      isVerified: true,
      isAnonymous: false,
      usageDuration: '14 months',
      implementationRating: 5,
      supportRating: 4,
      valueRating: 5,
      date: '2024-01-08',
      helpfulCount: 8,
      tags: ['migration', 'reporting', 'compliance']
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features & Specs' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'vendor', label: 'Vendor Info' },
  ]

  const getIconComponent = (iconName?: string) => {
    const icons = {
      Zap,
      Settings,
      Package,
      TrendingUp,
      Shield
    }
    return icons[iconName as keyof typeof icons] || FileText
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Product Description */}
            <div>
              <h3 className="text-lg font-semibold mb-4">About {product.name}</h3>
              <div className="prose prose-gray max-w-none">
                {product.longDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-600 mb-4">{paragraph.trim()}</p>
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Key Features</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {product.features.filter(f => f.isHighlight).map((feature) => {
                  const IconComponent = getIconComponent(feature.icon)
                  return (
                    <div key={feature.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{feature.title}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Supported Client Sizes */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Ideal For</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {product.supportedClientSizes.map((size, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <Building2 className="w-4 h-4 mr-2 text-blue-600" />
                    {size}
                  </div>
                ))}
              </div>
            </div>

            {/* Integrations */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Key Integrations</h3>
              <div className="flex flex-wrap gap-2">
                {product.integrations.slice(0, 6).map((integration) => (
                  <span
                    key={integration}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {integration}
                  </span>
                ))}
                {product.integrations.length > 6 && (
                  <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm">
                    +{product.integrations.length - 6} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )

      case 'features':
        return (
          <div className="space-y-8">
            {/* All Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Complete Feature Set</h3>
              <div className="space-y-4">
                {product.features.map((feature) => {
                  const IconComponent = getIconComponent(feature.icon)
                  return (
                    <div key={feature.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-gray-900 mb-1">{feature.title}</h4>
                            <div className="flex gap-1">
                              {feature.isHighlight && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                  Highlight
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded text-xs ${feature.category === 'core'
                                ? 'bg-green-100 text-green-700'
                                : feature.category === 'advanced'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-purple-100 text-purple-700'
                                }`}>
                                {feature.category}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Technical Specifications */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
              <div className="space-y-6">
                {product.specifications.map((spec) => (
                  <div key={spec.category}>
                    <h4 className="font-medium text-gray-900 mb-3">{spec.category}</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {spec.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                          <span className={`text-sm ${item.isImportant ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                            {item.label}
                          </span>
                          <span className={`text-sm ${item.isImportant ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Requirements */}
            <div>
              <h3 className="text-lg font-semibold mb-4">System Requirements</h3>
              <div className="space-y-4">
                {product.systemRequirements.map((req) => (
                  <div key={req.category} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">{req.category}</h4>
                    <div className="space-y-2">
                      {req.requirements.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <div className="font-medium text-gray-900">{item.component}</div>
                          <div className="text-gray-600">
                            <span className="text-xs text-gray-500 uppercase">Minimum:</span> {item.minimum}
                          </div>
                          <div className="text-gray-600">
                            <span className="text-xs text-gray-500 uppercase">Recommended:</span> {item.recommended}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'pricing':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Pricing Plans</h3>
              <p className="text-gray-600 mb-6">
                Choose the plan that best fits your institution's size and needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {product.pricingDetails.map((tier) => (
                <div
                  key={tier.name}
                  className={`border rounded-lg p-6 relative ${tier.isPopular ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200'
                    }`}
                >
                  {tier.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h4 className="text-xl font-semibold mb-2">{tier.name}</h4>
                    <p className="text-gray-600 text-sm mb-4">{tier.description}</p>
                    {tier.customPricing ? (
                      <div className="text-2xl font-bold">Custom</div>
                    ) : (
                      <div>
                        <span className="text-3xl font-bold">${tier.basePrice.toLocaleString()}</span>
                        <span className="text-gray-600">/{tier.billingPeriod === 'monthly' ? 'month' : tier.billingPeriod}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="text-sm font-medium text-gray-900 mb-2">Included:</div>
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {tier.limitations && (
                    <div className="space-y-2 mb-6">
                      <div className="text-sm font-medium text-gray-900 mb-2">Limitations:</div>
                      {tier.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    className="w-full"
                    variant={tier.isPopular ? 'default' : 'outline'}
                    onClick={() => setDemoModalOpen(true)}
                  >
                    {tier.customPricing ? 'Contact Sales' : 'Get Started'}
                  </Button>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold mb-2">Need a custom solution?</h4>
              <p className="text-gray-600 mb-4">
                We offer customized pricing and features for enterprise clients with unique requirements.
              </p>
              <Button variant="outline" onClick={() => setDemoModalOpen(true)}>
                Contact Sales Team
              </Button>
            </div>
          </div>
        )

      case 'reviews':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Customer Reviews</h3>
                <p className="text-gray-600">{reviews.length} verified reviews</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-xl font-semibold">{product.rating}</span>
                  <span className="text-gray-600">({product.reviewCount} total)</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-medium text-gray-900">{review.reviewer}</div>
                      <div className="text-sm text-gray-600">{review.institutionName} • {review.institutionType}</div>
                      <div className="text-sm text-gray-500">Using for {review.usageDuration}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
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

                  <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                  <p className="text-gray-700 mb-4">{review.content}</p>

                  {/* Rating Breakdown */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium">Implementation</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.implementationRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Support</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.supportRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Value</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.valueRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pros and Cons */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-green-700 mb-2">Pros</div>
                      <ul className="space-y-1">
                        {review.pros.map((pro, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-red-700 mb-2">Cons</div>
                      <ul className="space-y-1">
                        {review.cons.map((con, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <X className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex gap-2">
                      {review.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      {review.helpfulCount} found this helpful
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'vendor':
        return (
          <div className="space-y-8">
            {/* Vendor Information */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{product.vendor.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{product.vendor.rating} vendor rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>{product.vendor.supportQuality} support rating</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setDemoModalOpen(true)}>
                  Contact Vendor
                </Button>
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Vendor Profile
                </Button>
              </div>
            </div>

            {/* Product Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{product.metrics.installations}</div>
                <div className="text-sm text-gray-600">Active Installations</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{product.metrics.demoRequests.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Demo Requests</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{product.metrics.savedCount}</div>
                <div className="text-sm text-gray-600">Times Saved</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{product.metrics.viewCount.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Profile Views</div>
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h4 className="font-semibold mb-4">Security Certifications</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {product.certifications.map((cert) => (
                  <div key={cert} className="flex items-center border rounded-lg p-3">
                    <Shield className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <div className="font-medium">{cert}</div>
                      <div className="text-sm text-gray-600">Verified certification</div>
                    </div>
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
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Product Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-6">
                {/* Logo */}
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>

                {/* Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {product.name}
                      </h1>
                      <div className="text-gray-600 mb-2">
                        Version {product.version} by {product.vendor.name}
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          {product.category}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {product.metrics.installations} installations
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Updated {new Date(product.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">
                    {product.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : product.status === 'beta'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                      {product.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Screenshots & Actions */}
            <div className="space-y-4">
              {/* Screenshot */}
              <div className="bg-gray-100 rounded-lg aspect-video overflow-hidden">
                <img
                  src={product.screenshots[selectedScreenshot]}
                  alt={`${product.name} screenshot`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Screenshot thumbnails */}
              <div className="flex gap-2">
                {product.screenshots.map((screenshot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedScreenshot(index)}
                    className={`w-16 h-12 bg-gray-100 rounded border-2 overflow-hidden ${selectedScreenshot === index ? 'border-blue-500' : 'border-transparent'
                      }`}
                  >
                    <img
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Rating and Pricing */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">{product.rating}</span>
                  <span className="text-gray-600">({product.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-green-600 font-semibold">
                    {product.compatibility}% Compatibility Match
                  </span>
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-4">
                  {product.priceRange}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button size="lg" className="w-full" onClick={() => setDemoModalOpen(true)}>
                  <Play className="w-4 h-4 mr-2" />
                  Request Demo
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Brochure
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
          vendor={{ name: product.vendor.name, category: product.category }}
          isOpen={demoModalOpen}
          onClose={() => setDemoModalOpen(false)}
        />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/products/$productId/')({
  component: ProductProfile,
})