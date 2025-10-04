import { useState, useMemo, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { FileText } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '../../../components/ui/dialog'
import { apiService } from '../../../services/api'
import type { VendorClaim, VendorClaimStatus } from '../../../types/api'

interface ClaimsTabProps {
  pendingClaims: VendorClaim[]
  onClaimCompleted?: (claimId: string) => void
}

export const ClaimsTab = ({ pendingClaims, onClaimCompleted }: ClaimsTabProps) => {
  const [claimsPage, setClaimsPage] = useState(1)
  const [claimsPageSize, setClaimsPageSize] = useState(10)
  const [claims, setClaims] = useState<VendorClaim[]>(pendingClaims)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedClaim, setSelectedClaim] = useState<VendorClaim | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    setClaims(pendingClaims)
  }, [pendingClaims])

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(claims.length / claimsPageSize))
    setClaimsPage(prev => Math.min(prev, totalPages))
  }, [claims, claimsPageSize])

  const approveClaimMutation = useMutation({
    mutationFn: async ({ claimId, approved, reason }: { claimId: string; approved: boolean; reason?: string }) => {
      const response = await apiService.approveVendorClaim(claimId, approved, reason)
      if (!response.success) {
        throw new Error(response.error || 'Failed to process claim')
      }
      return response.data
    },
    onSuccess: (_, { claimId }) => {
      setClaims(prev => prev.filter(claim => claim.id !== claimId))
      onClaimCompleted?.(claimId)
      setFeedbackMessage({ type: 'success', message: 'Claim processed successfully.' })
      setDialogOpen(false)
      setSelectedClaim(null)
      setRejectionReason('')
    },
    onError: (error: unknown) => {
      setFeedbackMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to process claim. Please try again.',
      })
    },
  })

  const handleOpenDialog = (claim: VendorClaim) => {
    setSelectedClaim(claim)
    setDialogOpen(true)
    setFeedbackMessage(null)
    setRejectionReason('')
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedClaim(null)
    setRejectionReason('')
  }

  const handleApproveClaim = () => {
    if (!selectedClaim || approveClaimMutation.isPending) {
      return
    }

    approveClaimMutation.mutate({ claimId: selectedClaim.id, approved: true })
  }

  const handleRejectClaim = () => {
    if (!selectedClaim || approveClaimMutation.isPending) {
      return
    }

    if (!rejectionReason.trim()) {
      setFeedbackMessage({
        type: 'error',
        message: 'Please provide a reason for rejection.',
      })
      return
    }

    approveClaimMutation.mutate({ claimId: selectedClaim.id, approved: false, reason: rejectionReason })
  }

  // Pagination logic for claims
  const paginatedClaims = useMemo(() => {
    const startIndex = (claimsPage - 1) * claimsPageSize
    const endIndex = startIndex + claimsPageSize
    return claims.slice(startIndex, endIndex)
  }, [claims, claimsPage, claimsPageSize])

  const totalClaimsPages = Math.max(1, Math.ceil(claims.length / claimsPageSize))

  // Reset page when page size changes
  const handleClaimsPageSizeChange = (newPageSize: number) => {
    setClaimsPageSize(newPageSize)
    setClaimsPage(1)
  }

  const getStatusBadgeColor = (status: VendorClaimStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Vendor Claims</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {claims.length} pending claims
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Show:</label>
            <select
              className="border rounded-md px-2 py-1 text-sm"
              value={claimsPageSize}
              onChange={(e) => handleClaimsPageSizeChange(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {feedbackMessage && (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${feedbackMessage.type === 'success'
            ? 'border-green-200 bg-green-50 text-green-700'
            : 'border-red-200 bg-red-50 text-red-700'
            }`}
        >
          {feedbackMessage.message}
        </div>
      )}

      <div className="grid gap-6">
        {paginatedClaims.map((claim) => (
          <div
            key={claim.id}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {claim.firstName} {claim.lastName}
                </h3>
                <p className="text-sm text-gray-500">{claim.email}</p>
                <p className="text-sm text-gray-500">{claim.title} at {claim.companyEmail}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 text-sm rounded-full ${getStatusBadgeColor(claim.status)}`}>
                  {claim.status}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(claim.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Phone</p>
                <p className="text-sm text-gray-600">{claim.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Verification Method</p>
                <p className="text-sm text-gray-600 capitalize">{claim.verificationMethod}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Vendor ID</p>
                <p className="text-sm text-gray-600">{claim.vendorId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Claim ID</p>
                <p className="text-sm text-gray-600">{claim.id}</p>
              </div>
            </div>

            {claim.message && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">Message</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{claim.message}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleOpenDialog(claim)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Review &amp; Decide
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOpenDialog(claim)}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}

        {claims.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Claims</h3>
            <p className="text-gray-600">All vendor claims have been reviewed.</p>
          </div>
        )}
      </div>

      {/* Pagination Navigation */}
      {claims.length > 0 && totalClaimsPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>
              Showing {((claimsPage - 1) * claimsPageSize) + 1} to{' '}
              {Math.min(claimsPage * claimsPageSize, claims.length)} of{' '}
              {claims.length} results
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setClaimsPage(prev => Math.max(1, prev - 1))}
              disabled={claimsPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalClaimsPages }, (_, i) => i + 1).map(pageNum => {
                // Show first page, last page, current page, and pages around current page
                const shouldShow = pageNum === 1 ||
                  pageNum === totalClaimsPages ||
                  Math.abs(pageNum - claimsPage) <= 1

                if (!shouldShow) {
                  // Show ellipsis for gaps
                  if (pageNum === 2 && claimsPage > 4) {
                    return <span key={pageNum} className="px-2 text-gray-500">...</span>
                  }
                  if (pageNum === totalClaimsPages - 1 && claimsPage < totalClaimsPages - 3) {
                    return <span key={pageNum} className="px-2 text-gray-500">...</span>
                  }
                  return null
                }

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === claimsPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setClaimsPage(pageNum)}
                    className="min-w-[32px]"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setClaimsPage(prev => Math.min(totalClaimsPages, prev + 1))}
              disabled={claimsPage === totalClaimsPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => (open ? setDialogOpen(true) : handleCloseDialog())}>
        <DialogContent className="max-w-2xl">
          <DialogClose onClick={handleCloseDialog} />
          <DialogHeader>
            <DialogTitle>Review Vendor Claim</DialogTitle>
            <DialogDescription>
              Review the claim details below and decide whether to approve or reject this vendor claim.
            </DialogDescription>
          </DialogHeader>

          {selectedClaim && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Full Name</p>
                  <p className="text-base text-gray-900">{selectedClaim.firstName} {selectedClaim.lastName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Title</p>
                  <p className="text-base text-gray-900">{selectedClaim.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600">{selectedClaim.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-sm text-gray-600">{selectedClaim.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Company Email</p>
                  <p className="text-sm text-gray-600">{selectedClaim.companyEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Verification Method</p>
                  <p className="text-sm text-gray-600 capitalize">{selectedClaim.verificationMethod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Vendor ID</p>
                  <p className="text-sm text-gray-600">{selectedClaim.vendorId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Submitted</p>
                  <p className="text-sm text-gray-600">{new Date(selectedClaim.submittedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedClaim.message && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Message</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{selectedClaim.message}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason (required for rejection)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter reason for rejection..."
                />
              </div>

              {feedbackMessage && feedbackMessage.type === 'error' && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                  {feedbackMessage.message}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={handleCloseDialog} disabled={approveClaimMutation.isPending}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRejectClaim}
                disabled={approveClaimMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white border-red-600"
              >
                {approveClaimMutation.isPending ? 'Processing...' : 'Reject Claim'}
              </Button>
              <Button
                onClick={handleApproveClaim}
                disabled={approveClaimMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {approveClaimMutation.isPending ? 'Processing...' : 'Approve Claim'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}