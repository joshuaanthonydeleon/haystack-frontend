// User & Authentication Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  title: string
  bankName?: string
  accountType: 'bank' | 'credit-union' | 'vendor' | 'admin'
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthRequest {
  email: string
  password: string
}

export interface SignUpRequest extends AuthRequest {
  firstName: string
  lastName: string
  bankName: string
  title: string
  accountType: 'bank' | 'credit-union' | 'vendor' | 'admin'
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}


export enum VendorSize {
  startup = 'startup',
  smallBusiness = 'small-business',
  midMarket = 'mid-market',
  enterprise = 'enterprise'
}

export enum VendorStatus {
  pending = 'pending',
  active = 'active',
  suspended = 'suspended',
  rejected = 'rejected'
}

export enum PricingModel {
  subscription = 'subscription',
  oneTime = 'one-time',
  usageBased = 'usage-based',
  custom = 'custom'
}

export enum VerificationStatus {
  pending = 'pending',
  verified = 'verified',
  rejected = 'rejected'
}

// Vendor Types
export interface Vendor {
  id: string
  name: string
  slug: string
  category: string
  subcategories: string[]
  location: string
  size: VendorSize
  founded: string
  employees: string
  rating: number
  reviewCount: number
  compatibility?: number
  description: string
  longDescription: string
  website: string
  phone: string
  email: string
  logoUrl: string
  bannerUrl?: string
  tags: string[]
  features: string[]
  integrations: string[]
  certifications: string[]
  clientSize: string[]
  pricingModel: PricingModel
  priceRange: string
  status: VendorStatus
  isClaimed: boolean
  claimedBy?: string
  claimedAt?: string
  verificationStatus: VerificationStatus
  createdAt: string
  updatedAt: string
  lastActivityAt: string
  metrics: {
    profileViews: number
    demoRequests: number
    savedCount: number
    clickThroughRate: number
    conversionRate: number
  }
}

export interface VendorCreateRequest {
  name: string
  category: string
  description: string
  website: string
  location: string
  size: VendorSize
  founded: string
}

export interface VendorUpdateRequest extends Partial<Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>> { }

export interface VendorSearchParams {
  q?: string
  category?: string
  size?: string
  location?: string
  tags?: string[]
  minRating?: number
  sortBy?: 'compatibility' | 'rating' | 'name' | 'recent'
  page?: number
  limit?: number
}

export interface VendorSearchResponse {
  vendors: Vendor[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Review Types
export interface Review {
  id: string
  vendorId: string
  userId: string
  reviewer: string
  title: string
  rating: number
  content: string
  isVerified: boolean
  isAnonymous: boolean
  date: string
  helpfulCount: number
  tags: string[]
}

export interface ReviewCreateRequest {
  vendorId: string
  rating: number
  content: string
  title: string
  isAnonymous?: boolean
  tags?: string[]
}

// Demo Request Types
export interface DemoRequest {
  id: string
  vendorId: string
  userId: string
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
  firstName: string
  lastName: string
  email: string
  phone?: string
  bankName: string
  title: string
  assetsUnderManagement: string
  currentProvider?: string
  timeline: string
  preferredTime: string
  message?: string
  scheduledAt?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface DemoRequestCreateRequest {
  vendorId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  bankName: string
  title: string
  assetsUnderManagement: string
  currentProvider?: string
  timeline: string
  preferredTime: string
  message?: string
}

// Compliance Document Types
export interface ComplianceDocument {
  id: string
  vendorId: string
  title: string
  description: string
  type: 'security-audit' | 'security-certification' | 'regulatory-assessment' | 'operational-documentation' | 'legal-documentation'
  confidentiality: 'public' | 'restricted' | 'confidential'
  status: 'current' | 'expiring' | 'expired'
  lastUpdated: string
  expiresAt?: string
  size: string
  fileUrl: string
  requiredApproval: boolean
  downloadCount: number
  createdAt: string
  updatedAt: string
}

export interface DocumentAccessRequest {
  id: string
  documentId: string
  userId: string
  status: 'pending' | 'approved' | 'rejected'
  requestedAt: string
  approvedAt?: string
  approvedBy?: string
  rejectedAt?: string
  rejectionReason?: string
}

export interface DocumentAccessRequestCreate {
  documentId: string
  justification?: string
}

export enum VerificationMethod {
  email = 'email',
  phone = 'phone',
  website = 'website',
  linkedin = 'linkedin'
}

export enum VendorClaimStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected'
}

// Vendor Claim & Verification Types
export interface VendorClaim {
  id: string
  vendorId: string
  userId: string
  status: VendorClaimStatus
  firstName: string
  lastName: string
  email: string
  phone: string
  title: string
  companyEmail: string
  verificationMethod: VerificationMethod
  message?: string
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
}

export interface VendorClaimRequest {
  vendorId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  title: string
  companyEmail: string
  verificationMethod: VerificationMethod
  message?: string
}

export interface VendorVerification {
  id: string
  vendorId: string
  submittedBy: string
  verificationType: 'domain' | 'business-license' | 'incorporation' | 'linkedin' | 'manual'
  status: 'pending' | 'verified' | 'failed' | 'expired'
  verificationData: Record<string, any>
  submittedAt: string
  verifiedAt?: string
  verifiedBy?: string
  expiresAt?: string
  failureReason?: string
}

// Admin Dashboard Types
export interface AdminMetrics {
  totalVendors: number
  activeVendors: number
  pendingVerifications: number
  totalBanks: number
  totalDemoRequests: number
  totalReviews: number
  monthlyGrowth: {
    vendors: number
    banks: number
    demoRequests: number
  }
  topCategories: Array<{
    category: string
    count: number
    growth: number
  }>
  recentActivity: Array<{
    id: string
    type: 'vendor_signup' | 'demo_request' | 'review_submitted' | 'verification_pending'
    description: string
    timestamp: string
    relatedId?: string
  }>
}

export interface VendorPerformanceMetrics {
  vendorId: string
  vendorName: string
  profileViews: number
  demoRequests: number
  conversionRate: number
  averageRating: number
  reviewCount: number
  documentsDownloaded: number
  lastActivityAt: string
  monthlyTrend: Array<{
    month: string
    views: number
    demos: number
    conversions: number
  }>
}

// Bank/Institution Types
export interface Institution {
  id: string
  name: string
  type: 'bank' | 'credit-union'
  location: string
  assetsUnderManagement: string
  isVerified: boolean
  domain: string
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Error Types
export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

// Dashboard Analytics Types
export interface DashboardAnalytics {
  overview: {
    totalLeads: number
    conversionRate: number
    avgDemoRequestTime: number
    topPerformingCategory: string
  }
  leadGeneration: Array<{
    date: string
    leads: number
    demos: number
    conversions: number
  }>
  categoryPerformance: Array<{
    category: string
    vendors: number
    leads: number
    avgRating: number
  }>
  geographicDistribution: Array<{
    state: string
    vendors: number
    banks: number
    activity: number
  }>
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: 'demo_request' | 'claim_approved' | 'document_request' | 'review_submitted'
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  createdAt: string
}

// Product Types
export interface Product {
  id: string
  vendorId: string
  name: string
  slug: string
  category: string
  subcategories: string[]
  description: string
  longDescription: string
  version: string
  rating: number
  reviewCount: number
  compatibility?: number
  logoUrl: string
  screenshots: string[]
  features: ProductFeature[]
  specifications: ProductSpecification[]
  integrations: string[]
  pricingModel: PricingModel
  priceRange: string
  pricingDetails: PricingTier[]
  supportedClientSizes: string[]
  systemRequirements: SystemRequirement[]
  certifications: string[]
  tags: string[]
  status: 'active' | 'deprecated' | 'beta' | 'coming-soon'
  releaseDate: string
  lastUpdated: string
  vendor: {
    id: string
    name: string
    logoUrl: string
    rating: number
    supportQuality: number
  }
  metrics: {
    installations: number
    demoRequests: number
    savedCount: number
    viewCount: number
  }
  createdAt: string
  updatedAt: string
}

export interface ProductFeature {
  id: string
  title: string
  description: string
  category: 'core' | 'advanced' | 'premium'
  isHighlight: boolean
  icon?: string
}

export interface ProductSpecification {
  category: string
  items: Array<{
    label: string
    value: string
    isImportant?: boolean
  }>
}

export interface PricingTier {
  name: string
  description: string
  basePrice: number
  billingPeriod: 'monthly' | 'yearly' | 'one-time' | 'usage-based'
  features: string[]
  limitations?: string[]
  isPopular?: boolean
  customPricing?: boolean
}

export interface SystemRequirement {
  category: string
  requirements: Array<{
    component: string
    minimum: string
    recommended: string
  }>
}

export interface ProductSearchParams {
  q?: string
  vendorId?: string
  category?: string
  tags?: string[]
  minRating?: number
  pricingModel?: PricingModel
  sortBy?: 'compatibility' | 'rating' | 'name' | 'recent' | 'popular'
  page?: number
  limit?: number
}

export interface ProductSearchResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface ProductReview {
  id: string
  productId: string
  userId: string
  reviewer: string
  institutionName: string
  institutionType: 'bank' | 'credit-union'
  title: string
  rating: number
  content: string
  pros: string[]
  cons: string[]
  isVerified: boolean
  isAnonymous: boolean
  usageDuration: string
  implementationRating: number
  supportRating: number
  valueRating: number
  date: string
  helpfulCount: number
  tags: string[]
}