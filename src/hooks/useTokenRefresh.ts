import { useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'

export function useTokenRefresh() {
  const { refreshAuthToken, token, refreshToken, signOut } = useAuth()
  const refreshTimeoutRef = useRef<NodeJS.Timeout>()
  const isRefreshingRef = useRef(false)

  useEffect(() => {
    if (!token || !refreshToken) return

    // Function to refresh token
    const refreshTokenIfNeeded = async () => {
      if (isRefreshingRef.current) return
      
      isRefreshingRef.current = true
      try {
        const success = await refreshAuthToken()
        if (!success) {
          // If refresh fails, sign out
          signOut()
        }
      } catch (error) {
        console.error('Token refresh failed:', error)
        signOut()
      } finally {
        isRefreshingRef.current = false
      }
    }

    // Function to schedule next refresh
    const scheduleRefresh = () => {
      // Clear existing timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }

      // Schedule refresh for 14 minutes (access token expires in 15 minutes)
      refreshTimeoutRef.current = setTimeout(() => {
        refreshTokenIfNeeded()
      }, 14 * 60 * 1000) // 14 minutes
    }

    // Schedule initial refresh
    scheduleRefresh()

    // Cleanup function
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [token, refreshToken, refreshAuthToken, signOut])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [])
}
