import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User, AuthRequest, SignUpRequest } from '../types/api'
import { apiService } from '../services/api'

interface AuthContextType {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (credentials: AuthRequest) => Promise<void>
  signUp: (userData: SignUpRequest) => Promise<void>
  signOut: () => void
  hasRole: (role: User['role'] | User['role'][]) => boolean
  getDashboardRoute: () => string
  refreshUser: () => Promise<void>
  refreshAuthToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const unsubscribe = apiService.subscribeToTokenUpdates((tokens) => {
      setToken(tokens?.accessToken ?? null)
      setRefreshToken(tokens?.refreshToken ?? null)
    })

    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token')
        const storedRefreshToken = localStorage.getItem('auth_refresh_token')
        const storedUser = localStorage.getItem('auth_user')
        
        if (storedToken && storedRefreshToken && storedUser) {
          setToken(storedToken)
          setRefreshToken(storedRefreshToken)
          setUser(JSON.parse(storedUser))
          
          // Validate token with backend
          try {
            const response = await apiService.getCurrentUser()
            if (response.success) {
              setUser(response.data)
              localStorage.setItem('auth_user', JSON.stringify(response.data))
            } else {
              // Token might be expired, try to refresh
              const refreshSuccess = await refreshAuthToken()
              if (!refreshSuccess) {
                signOut()
              }
            }
          } catch (error) {
            // Token might be invalid, try to refresh
            const refreshSuccess = await refreshAuthToken()
            if (!refreshSuccess) {
              signOut()
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        signOut()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    return () => {
      unsubscribe()
    }
  }, [])

  const signIn = async (credentials: AuthRequest) => {
    try {
      setIsLoading(true)
      const response = await apiService.signIn(credentials)
      
      if (response.success) {
        const { user, access_token, refresh_token } = response.data
        setUser(user)
        setToken(access_token)
        setRefreshToken(refresh_token)

        // Store in localStorage for persistence
        apiService.setAuthTokens(access_token, refresh_token)
        localStorage.setItem('auth_user', JSON.stringify(user))
      } else {
        throw new Error(response.error || 'Authentication failed')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (userData: SignUpRequest) => {
    try {
      setIsLoading(true)
      const response = await apiService.signUp(userData)
      
      if (response.success) {
        const { user, access_token, refresh_token, message } = response.data
        setUser(user)
        setToken(access_token)
        setRefreshToken(refresh_token)

        // Store authentication data for immediate access
        apiService.setAuthTokens(access_token, refresh_token)
        localStorage.setItem('auth_user', JSON.stringify(user))
        
        // Show success message
        console.log(message)
      } else {
        throw new Error(response.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    setToken(null)
    setRefreshToken(null)
    apiService.clearAuthTokens()
    localStorage.removeItem('auth_user')
  }

  const hasRole = (role: User['role'] | User['role'][]): boolean => {
    if (!user) return false
    
    if (Array.isArray(role)) {
      return role.includes(user.role)
    }
    
    return user.role === role
  }

  const getDashboardRoute = (): string => {
    if (!user) return '/'
    
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard'
      case 'vendor':
        return '/vendor/dashboard'
      default:
        return '/dashboard'
    }
  }

  const refreshUser = async () => {
    if (!token) return
    
    try {
      const response = await apiService.getCurrentUser()
      if (response.success) {
        setUser(response.data)
        localStorage.setItem('auth_user', JSON.stringify(response.data))
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
      // If refresh fails, sign out
      signOut()
    }
  }

  const refreshAuthToken = async (): Promise<boolean> => {
    if (!refreshToken) return false
    
    try {
      const response = await apiService.refreshToken({ refreshToken })
      if (response.success) {
        const { access_token, refresh_token } = response.data
        setToken(access_token)
        setRefreshToken(refresh_token)

        // Update localStorage
        apiService.setAuthTokens(access_token, refresh_token)

        return true
      }
    } catch (error) {
      console.error('Failed to refresh token:', error)
    }
    
    return false
  }

  const isAuthenticated = !!user && !!token

  const value: AuthContextType = {
    user,
    token,
    refreshToken,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
    hasRole,
    getDashboardRoute,
    refreshUser,
    refreshAuthToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Convenience hooks for role checking
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  return { isAuthenticated, isLoading }
}

export function useRequireRole(requiredRole: User['role'] | User['role'][]) {
  const { user, isAuthenticated, hasRole, isLoading } = useAuth()
  
  return {
    user,
    isAuthenticated,
    hasRequiredRole: hasRole(requiredRole),
    isLoading
  }
}
