import { useTokenRefresh } from '../hooks/useTokenRefresh'
import { useAuth } from '../contexts/AuthContext'

export function TokenManager() {
  try {
    useAuth() // Check if AuthProvider is available
    useTokenRefresh()
    return null
  } catch (error) {
    // AuthProvider not ready yet, return null
    return null
  }
}
