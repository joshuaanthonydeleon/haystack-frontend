import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '../services/api'
import type { AuthRequest, SignUpRequest } from '../types/api'

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
}

// Queries
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => apiService.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Mutations
export const useSignIn = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: AuthRequest) => apiService.signIn(data),
    onSuccess: (response) => {
      if (response.success) {
        // Set user data in cache
        queryClient.setQueryData(authKeys.user(), response)
      }
    },
  })
}

export const useSignUp = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: SignUpRequest) => apiService.signUp(data),
    onSuccess: (response) => {
      if (response.success) {
        // Set user data in cache
        queryClient.setQueryData(authKeys.user(), response)
      }
    },
  })
}

export const useSignOut = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      // In a real app, you'd call an API endpoint to invalidate the session
      return { success: true }
    },
    onSuccess: () => {
      // Clear all cached data on sign out
      queryClient.clear()
    },
  })
}