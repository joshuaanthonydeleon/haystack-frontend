import type {
  User,
  AuthRequest,
  SignUpRequest,
  AuthResponse,
  SignUpResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  AuthMessageResponse,
  Vendor,
  VendorCreateRequest,
  VendorUpdateRequest,
  VendorSearchParams,
  VendorSearchResponse,
  Review,
  ReviewCreateRequest,
  DemoRequest,
  DemoRequestCreateRequest,
  ComplianceDocument,
  DocumentAccessRequest,
  DocumentAccessRequestCreate,
  VendorClaim,
  VendorClaimRequest,
  AdminMetrics,
  VendorPerformanceMetrics,
  ApiResponse,
  DashboardAnalytics,
  Notification,
} from '../types/api'

import { VendorSize, PricingModel, VerificationStatus, VendorStatus, VendorClaimStatus, VerificationMethod } from '../types/api'

// Mock user data for demo requests (keeping old structure for compatibility)
const mockDemoUser = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  title: 'CTO',
  email: 'john.doe@firstnational.com'
}

const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'CoreTech Solutions',
    slug: 'coretech-solutions',
    category: 'Core Banking',
    subcategories: ['Account Management', 'Transaction Processing'],
    location: 'Austin, TX',
    size: VendorSize.midMarket,
    founded: '2015',
    employees: '150-500',
    rating: 4.8,
    reviewCount: 156,
    compatibility: 95,
    description: 'Modern core banking platform designed specifically for community banks.',
    longDescription: 'CoreTech Solutions provides a comprehensive core banking platform...',
    website: 'https://coretech-solutions.com',
    phone: '+1 (512) 555-0123',
    email: 'contact@coretech-solutions.com',
    logoUrl: '/api/placeholder/120/120',
    tags: ['Core Banking', 'Real-time Processing', 'API Integration'],
    features: ['Real-time processing', 'API ecosystem', 'Analytics'],
    integrations: ['Jack Henry', 'Fiserv', 'Q2'],
    certifications: ['SOC 2 Type II', 'PCI DSS'],
    clientSize: ['Community Banks', 'Credit Unions'],
    pricingModel: PricingModel.subscription,
    priceRange: '$10K - $50K/month',
    status: VendorStatus.active,
    isClaimed: true,
    claimedBy: 'vendor-user-1',
    claimedAt: '2024-01-15T00:00:00Z',
    verificationStatus: VerificationStatus.verified,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    lastActivityAt: '2024-02-15T00:00:00Z',
    metrics: {
      profileViews: 1250,
      demoRequests: 45,
      savedCount: 89,
      clickThroughRate: 12.5,
      conversionRate: 8.2
    }
  }
]

// API Service Class
export class ApiService {
  private baseUrl = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/auth'

  private async mockApiCall<T>(data: T, delay = 1000): Promise<ApiResponse<T>> {
    await new Promise(resolve => setTimeout(resolve, delay))
    return {
      success: true,
      data
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}, retryCount = 0): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && retryCount === 0) {
        const refreshToken = localStorage.getItem('auth_refresh_token')
        if (refreshToken) {
          try {
            const refreshResponse = await this.refreshToken({ refreshToken })
            if (refreshResponse.success) {
              // Update the authorization header and retry the request
              const newOptions = {
                ...options,
                headers: {
                  ...options.headers,
                  'Authorization': `Bearer ${refreshResponse.data.access_token}`
                }
              }
              return this.makeRequest<T>(endpoint, newOptions, 1)
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError)
          }
        }
        
        // If refresh fails or no refresh token, clear auth and redirect
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_refresh_token')
        localStorage.removeItem('auth_user')
        window.location.href = '/auth/signin'
      }

      if (!response.ok) {
        return {
          success: false,
          data: data as T,
          error: data.message || 'Request failed'
        }
      }

      return {
        success: true,
        data: data as T
      }
    } catch (error) {
      return {
        success: false,
        data: {} as T,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  // Authentication
  async signIn(request: AuthRequest): Promise<ApiResponse<AuthResponse>> {
    return this.makeRequest<AuthResponse>('/signin', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async signUp(request: SignUpRequest): Promise<ApiResponse<SignUpResponse>> {
    return this.makeRequest<SignUpResponse>('/signup', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async refreshToken(request: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> {
    return this.makeRequest<RefreshTokenResponse>('/refresh', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse<AuthMessageResponse>> {
    return this.makeRequest<AuthMessageResponse>('/forgot-password', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<AuthMessageResponse>> {
    return this.makeRequest<AuthMessageResponse>('/reset-password', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async verifyEmail(request: VerifyEmailRequest): Promise<ApiResponse<AuthMessageResponse>> {
    return this.makeRequest<AuthMessageResponse>('/verify-email', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async resendVerificationEmail(email: string): Promise<ApiResponse<AuthMessageResponse>> {
    return this.makeRequest<AuthMessageResponse>(`/resend-verification?email=${encodeURIComponent(email)}`, {
      method: 'POST'
    })
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      return {
        success: false,
        data: {} as User,
        error: 'No token found'
      }
    }

    return this.makeRequest<User>('/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  // Vendors
  async searchVendors(params: VendorSearchParams): Promise<ApiResponse<VendorSearchResponse>> {
    const filteredVendors = mockVendors.filter(vendor => {
      if (params.q) {
        const query = params.q.toLowerCase()
        return vendor.name.toLowerCase().includes(query) ||
          vendor.description.toLowerCase().includes(query) ||
          vendor.tags.some(tag => tag.toLowerCase().includes(query))
      }
      if (params.category && vendor.category !== params.category) return false
      if (params.size && vendor.size !== params.size) return false
      return true
    })

    return this.mockApiCall({
      vendors: filteredVendors,
      total: filteredVendors.length,
      page: params.page || 1,
      limit: params.limit || 10,
      hasMore: false
    })
  }

  async getVendor(id: string): Promise<ApiResponse<Vendor>> {
    const vendor = mockVendors.find(v => v.id === id) || mockVendors[0]
    return this.mockApiCall(vendor)
  }

  async createVendor(request: VendorCreateRequest): Promise<ApiResponse<Vendor>> {
    const newVendor: Vendor = {
      ...mockVendors[0],
      ...request,
      id: Math.random().toString(),
      slug: request.name.toLowerCase().replace(/\s+/g, '-'),
      status: VendorStatus.pending,
      isClaimed: false,
      verificationStatus: VerificationStatus.pending,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metrics: {
        profileViews: 0,
        demoRequests: 0,
        savedCount: 0,
        clickThroughRate: 0,
        conversionRate: 0
      }
    }
    return this.mockApiCall(newVendor)
  }

  async updateVendor(id: string, request: VendorUpdateRequest): Promise<ApiResponse<Vendor>> {
    const vendor = mockVendors.find(v => v.id === id) || mockVendors[0]
    const updatedVendor = {
      ...vendor,
      ...request,
      updatedAt: new Date().toISOString()
    }
    return this.mockApiCall(updatedVendor)
  }

  // Demo Requests
  async createDemoRequest(request: DemoRequestCreateRequest): Promise<ApiResponse<DemoRequest>> {
    const demoRequest: DemoRequest = {
      id: Math.random().toString(),
      ...request,
      userId: mockDemoUser.id,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    return this.mockApiCall(demoRequest)
  }

  async getDemoRequests(vendorId?: string): Promise<ApiResponse<DemoRequest[]>> {
    const mockDemoRequests: DemoRequest[] = [
      {
        id: '1',
        vendorId: '1',
        userId: mockDemoUser.id,
        status: 'pending',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@communitybank.com',
        phone: '+1 (555) 123-4567',
        bankName: 'Community First Bank',
        title: 'VP Technology',
        assetsUnderManagement: '500m-1b',
        timeline: 'short-term',
        preferredTime: 'morning',
        message: 'Looking to upgrade our core banking system.',
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-02-01T00:00:00Z'
      }
    ]

    const filtered = vendorId
      ? mockDemoRequests.filter(req => req.vendorId === vendorId)
      : mockDemoRequests

    return this.mockApiCall(filtered)
  }

  // Reviews
  async getVendorReviews(vendorId: string): Promise<ApiResponse<Review[]>> {
    const mockReviews: Review[] = [
      {
        id: '1',
        vendorId,
        userId: mockDemoUser.id,
        reviewer: 'Sarah Johnson',
        title: 'CTO, First National Bank',
        rating: 5,
        content: 'Excellent platform with outstanding support.',
        isVerified: true,
        isAnonymous: false,
        date: '2024-01-15',
        helpfulCount: 12,
        tags: ['Easy Implementation', 'Great Support']
      }
    ]
    return this.mockApiCall(mockReviews)
  }

  async createReview(request: ReviewCreateRequest): Promise<ApiResponse<Review>> {
    const review: Review = {
      id: Math.random().toString(),
      ...request,
      userId: mockDemoUser.id,
      reviewer: `${mockDemoUser.firstName} ${mockDemoUser.lastName}`,
      title: mockDemoUser.title,
      isVerified: true,
      isAnonymous: request.isAnonymous || false,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
      tags: request.tags || []
    }
    return this.mockApiCall(review)
  }

  // Compliance Documents
  async getVendorDocuments(vendorId: string): Promise<ApiResponse<ComplianceDocument[]>> {
    const mockDocuments: ComplianceDocument[] = [
      {
        id: '1',
        vendorId,
        title: 'SOC 2 Type II Report',
        description: 'Security, Availability, and Confidentiality audit report',
        type: 'security-audit',
        confidentiality: 'restricted',
        status: 'current',
        lastUpdated: '2024-01-15',
        size: '2.3 MB',
        fileUrl: '/documents/soc2-report.pdf',
        requiredApproval: true,
        downloadCount: 45,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      }
    ]
    return this.mockApiCall(mockDocuments)
  }

  async requestDocumentAccess(request: DocumentAccessRequestCreate): Promise<ApiResponse<DocumentAccessRequest>> {
    const accessRequest: DocumentAccessRequest = {
      id: Math.random().toString(),
      ...request,
      userId: mockDemoUser.id,
      status: 'pending',
      requestedAt: new Date().toISOString()
    }
    return this.mockApiCall(accessRequest)
  }

  // Vendor Claims
  async claimVendor(request: VendorClaimRequest): Promise<ApiResponse<VendorClaim>> {
    const claim: VendorClaim = {
      id: Math.random().toString(),
      ...request,
      userId: mockDemoUser.id,
      status: VendorClaimStatus.pending,
      verificationMethod: request.verificationMethod,
      submittedAt: new Date().toISOString()
    }
    return this.mockApiCall(claim)
  }

  async getVendorClaims(): Promise<ApiResponse<VendorClaim[]>> {
    const mockClaims: VendorClaim[] = [
      {
        id: '1',
        vendorId: '1',
        userId: mockDemoUser.id,
        status: VendorClaimStatus.approved,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@coretech-solutions.com',
        phone: '+1 (512) 555-0123',
        title: 'CEO',
        companyEmail: '@coretech-solutions.com',
        verificationMethod: VerificationMethod.email,
        submittedAt: '2024-01-10T00:00:00Z',
        reviewedAt: '2024-01-12T00:00:00Z',
        reviewedBy: 'admin-1'
      }
    ]
    return this.mockApiCall(mockClaims)
  }

  // Admin APIs
  async getAdminMetrics(): Promise<ApiResponse<AdminMetrics>> {
    const metrics: AdminMetrics = {
      totalVendors: 1247,
      activeVendors: 1089,
      pendingVerifications: 23,
      totalBanks: 456,
      totalDemoRequests: 2341,
      totalReviews: 567,
      monthlyGrowth: {
        vendors: 12.5,
        banks: 8.3,
        demoRequests: 24.7
      },
      topCategories: [
        { category: 'Core Banking', count: 234, growth: 15.2 },
        { category: 'Digital Banking', count: 189, growth: 22.1 },
        { category: 'Compliance', count: 156, growth: 8.7 }
      ],
      recentActivity: [
        {
          id: '1',
          type: 'vendor_signup',
          description: 'New vendor "PaymentTech Pro" signed up',
          timestamp: '2024-02-15T10:30:00Z'
        },
        {
          id: '2',
          type: 'demo_request',
          description: 'Demo requested for CoreTech Solutions',
          timestamp: '2024-02-15T09:15:00Z'
        }
      ]
    }
    return this.mockApiCall(metrics)
  }

  async getVendorPerformanceMetrics(): Promise<ApiResponse<VendorPerformanceMetrics[]>> {
    const metrics: VendorPerformanceMetrics[] = [
      {
        vendorId: '1',
        vendorName: 'CoreTech Solutions',
        profileViews: 1250,
        demoRequests: 45,
        conversionRate: 8.2,
        averageRating: 4.8,
        reviewCount: 156,
        documentsDownloaded: 89,
        lastActivityAt: '2024-02-15T00:00:00Z',
        monthlyTrend: [
          { month: '2024-01', views: 980, demos: 32, conversions: 3 },
          { month: '2024-02', views: 1250, demos: 45, conversions: 4 }
        ]
      }
    ]
    return this.mockApiCall(metrics)
  }

  async approveVendorClaim(claimId: string, approved: boolean, reason?: string): Promise<ApiResponse<VendorClaim>> {
    const claim = {
      id: claimId,
      vendorId: '1',
        userId: mockDemoUser.id,
      status: approved ? VendorClaimStatus.approved : VendorClaimStatus.rejected,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@vendor.com',
      phone: '+1 (555) 123-4567',
      title: 'CEO',
      companyEmail: '@vendor.com',
      verificationMethod: VerificationMethod.email,
      submittedAt: '2024-01-10T00:00:00Z',
      reviewedAt: new Date().toISOString(),
      reviewedBy: mockDemoUser.id,
      rejectionReason: reason
    }
    return this.mockApiCall(claim)
  }

  // Vendor Dashboard APIs
  async getVendorDashboard(): Promise<ApiResponse<DashboardAnalytics>> {
    const analytics: DashboardAnalytics = {
      overview: {
        totalLeads: 145,
        conversionRate: 12.4,
        avgDemoRequestTime: 2.3,
        topPerformingCategory: 'Core Banking'
      },
      leadGeneration: [
        { date: '2024-02-01', leads: 12, demos: 8, conversions: 1 },
        { date: '2024-02-02', leads: 15, demos: 10, conversions: 2 },
        { date: '2024-02-03', leads: 18, demos: 12, conversions: 1 }
      ],
      categoryPerformance: [
        { category: 'Core Banking', vendors: 45, leads: 234, avgRating: 4.6 },
        { category: 'Digital Banking', vendors: 38, leads: 189, avgRating: 4.4 }
      ],
      geographicDistribution: [
        { state: 'TX', vendors: 23, banks: 45, activity: 234 },
        { state: 'CA', vendors: 34, banks: 67, activity: 456 }
      ]
    }
    return this.mockApiCall(analytics)
  }

  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    const notifications: Notification[] = [
      {
        id: '1',
        userId: mockDemoUser.id,
        type: 'demo_request',
        title: 'New Demo Request',
        message: 'Community Bank requested a demo for your Core Banking solution',
        isRead: false,
        actionUrl: '/vendor/dashboard/demos/1',
        createdAt: '2024-02-15T10:30:00Z'
      }
    ]
    return this.mockApiCall(notifications)
  }
}

export const apiService = new ApiService()