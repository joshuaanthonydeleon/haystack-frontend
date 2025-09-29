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
    const queryParams = new URLSearchParams()
    if (params.q) queryParams.append('q', params.q)
    if (params.category) queryParams.append('category', params.category)
    if (params.size) queryParams.append('size', params.size)
    queryParams.append('page', (params.page || 1).toString())
    queryParams.append('limit', (params.limit || 10).toString())

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
    const vendorId = typeof request.vendorId === 'string'
      ? Number.parseInt(request.vendorId, 10)
      : request.vendorId

    const payload = {
      ...request,
      vendorId
    }

    return this.makeRequest<DemoRequest>('/demo-requests', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  async getDemoRequests(vendorId?: string): Promise<ApiResponse<DemoRequest[]>> {
    const query = vendorId ? `?vendorId=${encodeURIComponent(vendorId)}` : ''
    return this.makeRequest<DemoRequest[]>(`/demo-requests${query}`, {
      method: 'GET'
    })
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
    return this.makeRequest<ComplianceDocument[]>(`/vendor/${vendorId}/documents`, {
      method: 'GET'
    })
  }

  async requestDocumentAccess(request: DocumentAccessRequestCreate): Promise<ApiResponse<DocumentAccessRequest>> {
    return this.makeRequest<DocumentAccessRequest>(`/documents/${request.documentId}/access-requests`, {
      method: 'POST',
      body: JSON.stringify({ justification: request.justification })
    })
  }

  // Vendor Claims
  async claimVendor(request: VendorClaimRequest): Promise<ApiResponse<VendorClaim>> {
    const { vendorId, ...payload } = request

    return this.makeRequest<VendorClaim>(`/vendor/${vendorId}/claims`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  async getVendorClaims(): Promise<ApiResponse<VendorClaim[]>> {
    return this.makeRequest<VendorClaim[]>(`/vendor/claims`, {
      method: 'GET'
    })
  }

  async getVendorVerificationRequests(): Promise<ApiResponse<Vendor[]>> {
    return this.makeRequest<Vendor[]>(`/vendor/verification-requests`, {
      method: 'GET'
    })
  }

  // Admin APIs
  async getAdminMetrics(): Promise<ApiResponse<AdminMetrics>> {
    return this.makeRequest<AdminMetrics>('/admin/metrics', {
      method: 'GET'
    })
  }

  async getVendorPerformanceMetrics(): Promise<ApiResponse<VendorPerformanceMetrics[]>> {
    return this.makeRequest<VendorPerformanceMetrics[]>('/admin/vendor-performance', {
      method: 'GET'
    })
  }

  async approveVendorClaim(claimId: string, approved: boolean, reason?: string): Promise<ApiResponse<VendorClaim>> {
    return this.makeRequest<VendorClaim>(`/vendor/claims/${claimId}/decision`, {
      method: 'POST',
      body: JSON.stringify({
        approve: approved,
        rejectionReason: reason
      })
    })
  }

  // Vendor Dashboard APIs
  async getVendorDashboard(): Promise<ApiResponse<DashboardAnalytics>> {
    return this.makeRequest<DashboardAnalytics>('/vendor/dashboard', {
      method: 'GET'
    })
  }

  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return this.makeRequest<Notification[]>('/notifications', {
      method: 'GET'
    })
  }
}

export const apiService = new ApiService()
