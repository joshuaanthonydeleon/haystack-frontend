import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '../services/api'
import type { DemoRequestCreateRequest } from '../types/api'

// Query Keys
export const demoKeys = {
  all: ['demos'] as const,
  lists: () => [...demoKeys.all, 'list'] as const,
  list: (vendorId?: string) => [...demoKeys.lists(), vendorId] as const,
}

// Queries
export const useDemoRequests = (vendorId?: string) => {
  return useQuery({
    queryKey: demoKeys.list(vendorId),
    queryFn: () => apiService.getDemoRequests(vendorId),
    staleTime: 30 * 1000, // 30 seconds (demo requests are time-sensitive)
  })
}

// Mutations
export const useCreateDemoRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: DemoRequestCreateRequest) => apiService.createDemoRequest(data),
    onSuccess: (response, variables) => {
      // Invalidate demo request lists
      queryClient.invalidateQueries({ queryKey: demoKeys.lists() })
      
      // Also invalidate vendor-specific demo requests
      if (variables.vendorId) {
        queryClient.invalidateQueries({ 
          queryKey: demoKeys.list(variables.vendorId) 
        })
      }
    },
  })
}