import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User, AuthRequest, SignUpRequest } from '../types/api'
import { apiService } from '../services/api'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (credentials: AuthRequest) => Promise<void>
  signUp: (userData: SignUpRequest) => Promise<void>
  signOut: () => void
  hasRole: (role: User['accountType'] | User['accountType'][]) => boolean
  getDashboardRoute: () => string
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token')
        const storedUser = localStorage.getItem('auth_user')
        
        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
          
          // Optionally validate token with backend
          try {
            const response = await apiService.getCurrentUser()
            if (response.success) {
              setUser(response.data)
              localStorage.setItem('auth_user', JSON.stringify(response.data))
            }
          } catch (error) {
            // Token might be invalid, clear auth state
            console.warn('Failed to validate stored token:', error)
            signOut()
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
  }, [])

  const signIn = async (credentials: AuthRequest) => {
    try {
      setIsLoading(true)
      const response = await apiService.signIn(credentials)
      
      if (response.success) {
        const { user, token } = response.data
        setUser(user)
        setToken(token)
        
        // Store in localStorage for persistence
        localStorage.setItem('auth_token', token)
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
        const { user, token } = response.data
        setUser(user)
        setToken(token)
        
        // Store in localStorage for persistence
        localStorage.setItem('auth_token', token)
        localStorage.setItem('auth_user', JSON.stringify(user))
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
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  const hasRole = (role: User['accountType'] | User['accountType'][]): boolean => {
    if (!user) return false
    
    if (Array.isArray(role)) {
      return role.includes(user.accountType)
    }
    
    return user.accountType === role
  }

  const getDashboardRoute = (): string => {
    if (!user) return '/'
    
    switch (user.accountType) {
      case 'admin':
        return '/admin/dashboard'
      case 'vendor':
        return '/vendor/dashboard'
      case 'bank':
      case 'credit-union':
        return '/dashboard'
      default:
        return '/'
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

  const isAuthenticated = !!user && !!token

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
    hasRole,
    getDashboardRoute,
    refreshUser
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

export function useRequireRole(requiredRole: User['accountType'] | User['accountType'][]) {
  const { user, isAuthenticated, hasRole, isLoading } = useAuth()
  
  return {
    user,
    isAuthenticated,
    hasRequiredRole: hasRole(requiredRole),
    isLoading
  }
}