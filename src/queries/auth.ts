import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '../services/api'
import type { 
  AuthRequest, 
  SignUpRequest, 
  RefreshTokenRequest, 
  ForgotPasswordRequest, 
  ResetPasswordRequest, 
  VerifyEmailRequest 
} from '../types/api'

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

export const useRefreshToken = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: RefreshTokenRequest) => apiService.refreshToken(data),
    onSuccess: (response) => {
      if (response.success) {
        // Update tokens in localStorage
        localStorage.setItem('auth_token', response.data.access_token)
        localStorage.setItem('auth_refresh_token', response.data.refresh_token)
      }
    },
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => apiService.forgotPassword(data),
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => apiService.resetPassword(data),
  })
}

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => apiService.verifyEmail(data),
  })
}

export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: (email: string) => apiService.resendVerificationEmail(email),
  })
}

export const useSignOut = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      // Clear tokens from localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_refresh_token')
      localStorage.removeItem('auth_user')
      return { success: true }
    },
    onSuccess: () => {
      // Clear all cached data on sign out
      queryClient.clear()
    },
  })
}