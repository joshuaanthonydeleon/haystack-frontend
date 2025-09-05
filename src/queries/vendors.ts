import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '../services/api'
import type { VendorSearchParams, VendorCreateRequest, VendorUpdateRequest } from '../types/api'

// Query Keys
export const vendorKeys = {
  all: ['vendors'] as const,
  lists: () => [...vendorKeys.all, 'list'] as const,
  list: (filters: VendorSearchParams) => [...vendorKeys.lists(), filters] as const,
  details: () => [...vendorKeys.all, 'detail'] as const,
  detail: (id: string) => [...vendorKeys.details(), id] as const,
  reviews: (id: string) => [...vendorKeys.detail(id), 'reviews'] as const,
  documents: (id: string) => [...vendorKeys.detail(id), 'documents'] as const,
}

// Queries
export const useVendors = (params: VendorSearchParams = {}) => {
  return useQuery({
    queryKey: vendorKeys.list(params),
    queryFn: () => apiService.searchVendors(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useVendor = (id: string) => {
  return useQuery({
    queryKey: vendorKeys.detail(id),
    queryFn: () => apiService.getVendor(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useVendorReviews = (vendorId: string) => {
  return useQuery({
    queryKey: vendorKeys.reviews(vendorId),
    queryFn: () => apiService.getVendorReviews(vendorId),
    enabled: !!vendorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useVendorDocuments = (vendorId: string) => {
  return useQuery({
    queryKey: vendorKeys.documents(vendorId),
    queryFn: () => apiService.getVendorDocuments(vendorId),
    enabled: !!vendorId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Mutations
export const useCreateVendor = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: VendorCreateRequest) => apiService.createVendor(data),
    onSuccess: () => {
      // Invalidate all vendor lists
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() })
    },
  })
}

export const useUpdateVendor = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VendorUpdateRequest }) => 
      apiService.updateVendor(id, data),
    onSuccess: (response, { id }) => {
      if (response.success) {
        // Update the vendor detail cache
        queryClient.setQueryData(vendorKeys.detail(id), response)
        // Invalidate vendor lists to reflect changes
        queryClient.invalidateQueries({ queryKey: vendorKeys.lists() })
      }
    },
  })
}