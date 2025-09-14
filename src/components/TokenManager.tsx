import { useTokenRefresh } from '../hooks/useTokenRefresh'

export function TokenManager() {
  useTokenRefresh()
  return null
}
