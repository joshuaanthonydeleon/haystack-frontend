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
  VendorResearchRecord,
} from '../types/api'

import { VendorClaimStatus, VerificationMethod } from '../types/api'

// Mock user data for demo requests (keeping old structure for compatibility)
const mockDemoUser = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  title: 'CTO',
  email: 'john.doe@firstnational.com'
}

type RequestOptions = RequestInit & {
  skipAuth?: boolean
  skipRefresh?: boolean
}

type TokenPayload = {
  accessToken: string
  refreshToken: string
}

// API Service Class
export class ApiService {
  private baseUrl = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001'
  private tokenListeners = new Set<(tokens: TokenPayload | null) => void>()
  private refreshPromise: Promise<ApiResponse<RefreshTokenResponse>> | null = null

  private async mockApiCall<T>(data: T, delay = 1000): Promise<ApiResponse<T>> {
    await new Promise(resolve => setTimeout(resolve, delay))
    return {
      success: true,
      data
    }
  }

  subscribeToTokenUpdates(listener: (tokens: TokenPayload | null) => void): () => void {
    this.tokenListeners.add(listener)
    return () => this.tokenListeners.delete(listener)
  }

  setAuthTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('auth_token', accessToken)
    localStorage.setItem('auth_refresh_token', refreshToken)
    this.tokenListeners.forEach(listener => listener({ accessToken, refreshToken }))
  }

  clearAuthTokens() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_refresh_token')
    this.tokenListeners.forEach(listener => listener(null))
  }

  private async makeRequest<T>(endpoint: string, options: RequestOptions = {}, retryCount = 0): Promise<ApiResponse<T>> {
    try {
      const { skipAuth, skipRefresh, ...fetchOptions } = options
      const headers = new Headers(fetchOptions.headers || {})
      const token = localStorage.getItem('auth_token')

      if (!headers.has('Content-Type') && fetchOptions.body) {
        headers.set('Content-Type', 'application/json')
      }

      if (!skipAuth && token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchOptions,
        headers,
      })

      const data = await response.json()

      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && retryCount === 0 && !skipRefresh) {
        const refreshTokenValue = localStorage.getItem('auth_refresh_token')
        if (refreshTokenValue) {
          try {
            const refreshResponse = await this.refreshToken({ refreshToken: refreshTokenValue })
            if (refreshResponse.success) {
              // Update the authorization header and retry the request
              const retryHeaders = new Headers(fetchOptions.headers || {})
              retryHeaders.set('Authorization', `Bearer ${refreshResponse.data.access_token}`)

              return this.makeRequest<T>(
                endpoint,
                {
                  ...fetchOptions,
                  headers: retryHeaders,
                },
                1
              )
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError)
          }
        }

        // If refresh fails or no refresh token, clear auth and redirect
        this.clearAuthTokens()
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
    return this.makeRequest<AuthResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async signUp(request: SignUpRequest): Promise<ApiResponse<SignUpResponse>> {
    return this.makeRequest<SignUpResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async refreshToken(request: RefreshTokenRequest, options: { force?: boolean } = {}): Promise<ApiResponse<RefreshTokenResponse>> {
    if (!options.force && this.refreshPromise) {
      return this.refreshPromise
    }

    const refreshTask = this.makeRequest<RefreshTokenResponse>(
      '/auth/refresh',
      {
        method: 'POST',
        body: JSON.stringify(request),
        skipAuth: true,
        skipRefresh: true,
      }
    ).then((response) => {
      if (response.success) {
        const { access_token, refresh_token } = response.data
        this.setAuthTokens(access_token, refresh_token)
      }

      return response
    }).finally(() => {
      if (this.refreshPromise === refreshTask) {
        this.refreshPromise = null
      }
    })

    this.refreshPromise = refreshTask

    return refreshTask
  }

  async forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse<AuthMessageResponse>> {
    return this.makeRequest<AuthMessageResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<AuthMessageResponse>> {
    return this.makeRequest<AuthMessageResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async verifyEmail(request: VerifyEmailRequest): Promise<ApiResponse<AuthMessageResponse>> {
    return this.makeRequest<AuthMessageResponse>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async resendVerificationEmail(email: string): Promise<ApiResponse<AuthMessageResponse>> {
    return this.makeRequest<AuthMessageResponse>(`/auth/resend-verification?email=${encodeURIComponent(email)}`, {
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

    return this.makeRequest<User>('/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  // Vendors
  async searchVendors(params: VendorSearchParams): Promise<ApiResponse<VendorSearchResponse>> {
    console.log('searchVendors', params)
    const queryParams = new URLSearchParams()
    if (params.q) queryParams.append('q', params.q)
    if (params.category) queryParams.append('category', params.category)
    if (params.size) queryParams.append('size', params.size)
    queryParams.append('page', (params.page || 1).toString())
    queryParams.append('limit', (params.limit || 10).toString())

    console.log('queryParams', queryParams.toString())

    return this.makeRequest<VendorSearchResponse>(`/vendor/search?${queryParams.toString()}`, {
      method: 'GET'
    })
  }

  async getVendor(id: string): Promise<ApiResponse<Vendor>> {
    return this.makeRequest<Vendor>(`/vendor/${id}`, {
      method: 'GET'
    })
  }

  async createVendor(request: VendorCreateRequest): Promise<ApiResponse<Vendor>> {
    return this.makeRequest<Vendor>('/vendor', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async updateVendor(id: string, request: VendorUpdateRequest): Promise<ApiResponse<Vendor>> {
    return this.makeRequest<Vendor>(`/vendor/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request)
    })
  }

  async startVendorResearch(id: string): Promise<ApiResponse<VendorResearchRecord>> {
    return this.makeRequest<VendorResearchRecord>(`/vendor/${id}/research`, {
      method: 'POST'
    })
  }

  async getVendorResearchHistory(id: string): Promise<ApiResponse<VendorResearchRecord[]>> {
    return this.makeRequest<VendorResearchRecord[]>(`/vendor/${id}/research`, {
      method: 'GET'
    })
  }

  async getVendorResearchById(vendorId: string, researchId: number): Promise<ApiResponse<VendorResearchRecord>> {
    return this.makeRequest<VendorResearchRecord>(`/vendor/${vendorId}/research/${researchId}`, {
      method: 'GET'
    })
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
    return this.makeRequest<Review[]>(`/vendor/${vendorId}/ratings`, {
      method: 'GET'
    })
  }

  async createReview(request: ReviewCreateRequest): Promise<ApiResponse<Review>> {
    return this.makeRequest<Review>(`/vendor/${request.vendorId}/ratings`, {
      method: 'POST',
      body: JSON.stringify(request)
    })
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
