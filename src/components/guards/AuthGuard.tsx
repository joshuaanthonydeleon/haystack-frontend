import React, { useEffect } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { useAuth } from '../../contexts/AuthContext'
import type { User } from '../../types/api'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: User['role'] | User['role'][]
  fallbackPath?: string
}

export function AuthGuard({
  children,
  requiredRole,
  fallbackPath = '/auth/signin'
}: AuthGuardProps) {
  const { isAuthenticated, hasRole, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Handle redirect for unauthenticated users or insufficient permissions
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: fallbackPath, search: { redirect: location.pathname } })
    }
    if (!isLoading && isAuthenticated && requiredRole && !hasRole(requiredRole)) {
      navigate({ to: fallbackPath, search: { redirect: location.pathname } })
    }
  }, [isAuthenticated, isLoading, navigate, fallbackPath, location.pathname, requiredRole, hasRole])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Return null while redirecting unauthenticated users or users without proper role
  if (!isAuthenticated || (requiredRole && !hasRole(requiredRole))) {
    return null
  }

  return <>{children}</>
}