import { useState, useMemo, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Shield } from 'lucide-react'
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
import type { Vendor } from '../../../types/api'

interface VerificationRequestsTabProps {
  pendingVerifications: Vendor[]
  onVerificationCompleted?: (vendorId: string) => void
}

export const VerificationRequestsTab = ({ pendingVerifications, onVerificationCompleted }: VerificationRequestsTabProps) => {
  const [verificationPage, setVerificationPage] = useState(1)
  const [verificationPageSize, setVerificationPageSize] = useState(10)
  const [verificationRequests, setVerificationRequests] = useState<Vendor[]>(pendingVerifications)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    setVerificationRequests(pendingVerifications)
  }, [pendingVerifications])

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(verificationRequests.length / verificationPageSize))
    setVerificationPage(prev => Math.min(prev, totalPages))
  }, [verificationRequests, verificationPageSize])

  const verifyVendorMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      const response = await apiService.verifyVendor(vendorId)
      if (!response.success) {
        throw new Error(response.error || 'Failed to verify vendor')
      }
      return response.data
    },
    onSuccess: (_, vendorId) => {
      setVerificationRequests(prev => prev.filter(verification => verification.id !== vendorId))
      onVerificationCompleted?.(vendorId)
      setFeedbackMessage({ type: 'success', message: 'Vendor verified successfully.' })
      setDialogOpen(false)
      setSelectedVendor(null)
    },
    onError: (error: unknown) => {
      setFeedbackMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to verify vendor. Please try again.',
      })
    },
  })

  const handleOpenDialog = (vendor: Vendor) => {
    setSelectedVendor(vendor)
    setDialogOpen(true)
    setFeedbackMessage(null)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedVendor(null)
  }

  const handleVerifyVendor = () => {
    if (!selectedVendor || verifyVendorMutation.isPending) {
      return
    }

    verifyVendorMutation.mutate(selectedVendor.id)
  }

  // Pagination logic for verification requests
  const paginatedVerifications = useMemo(() => {
    const startIndex = (verificationPage - 1) * verificationPageSize
    const endIndex = startIndex + verificationPageSize
    return verificationRequests.slice(startIndex, endIndex)
  }, [verificationRequests, verificationPage, verificationPageSize])

  const totalVerificationPages = Math.max(1, Math.ceil(verificationRequests.length / verificationPageSize))

  // Reset page when page size changes
  const handleVerificationPageSizeChange = (newPageSize: number) => {
    setVerificationPageSize(newPageSize)
    setVerificationPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Verification Requests</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {verificationRequests.length} pending verification requests
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Show:</label>
            <select
              className="border rounded-md px-2 py-1 text-sm"
              value={verificationPageSize}
              onChange={(e) => handleVerificationPageSizeChange(Number(e.target.value))}
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
        {paginatedVerifications.map((verification) => (
          <div
            key={verification.id}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {verification.companyName}
                </h3>
                <p className="text-sm text-gray-500">{verification.profile.email}</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                  {verification.profile.verificationStatus}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(verification.profile.createdAt || new Date()).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Company Email</p>
                <p className="text-sm text-gray-600">{verification.profile.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Phone</p>
                <p className="text-sm text-gray-600">{verification.profile.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Vendor ID</p>
                <p className="text-sm text-gray-600">{verification.id}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleOpenDialog(verification)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Review &amp; Verify
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOpenDialog(verification)}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}

        {verificationRequests.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Verification Requests</h3>
            <p className="text-gray-600">All verification requests have been reviewed.</p>
          </div>
        )}
      </div>

      {/* Pagination Navigation */}
      {verificationRequests.length > 0 && totalVerificationPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>
              Showing {((verificationPage - 1) * verificationPageSize) + 1} to{' '}
              {Math.min(verificationPage * verificationPageSize, verificationRequests.length)} of{' '}
              {verificationRequests.length} results
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVerificationPage(prev => Math.max(1, prev - 1))}
              disabled={verificationPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalVerificationPages }, (_, i) => i + 1).map(pageNum => {
                // Show first page, last page, current page, and pages around current page
                const shouldShow = pageNum === 1 ||
                  pageNum === totalVerificationPages ||
                  Math.abs(pageNum - verificationPage) <= 1

                if (!shouldShow) {
                  // Show ellipsis for gaps
                  if (pageNum === 2 && verificationPage > 4) {
                    return <span key={pageNum} className="px-2 text-gray-500">...</span>
                  }
                  if (pageNum === totalVerificationPages - 1 && verificationPage < totalVerificationPages - 3) {
                    return <span key={pageNum} className="px-2 text-gray-500">...</span>
                  }
                  return null
                }

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === verificationPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setVerificationPage(pageNum)}
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
              onClick={() => setVerificationPage(prev => Math.min(totalVerificationPages, prev + 1))}
              disabled={verificationPage === totalVerificationPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => (open ? setDialogOpen(true) : handleCloseDialog())}>
        <DialogContent>
          <DialogClose onClick={handleCloseDialog} />
          <DialogHeader>
            <DialogTitle>Verify Vendor</DialogTitle>
            <DialogDescription>
              Review the vendor details below and confirm to mark the vendor as verified.
            </DialogDescription>
          </DialogHeader>

          {selectedVendor && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Company Name</p>
                <p className="text-base text-gray-900">{selectedVendor.companyName}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600">{selectedVendor.profile.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-sm text-gray-600">{selectedVendor.profile.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Verification Status</p>
                  <p className="text-sm text-gray-600 capitalize">{selectedVendor.profile.verificationStatus}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Vendor ID</p>
                  <p className="text-sm text-gray-600">{selectedVendor.id}</p>
                </div>
              </div>
              {feedbackMessage && feedbackMessage.type === 'error' && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                  {feedbackMessage.message}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={handleCloseDialog} disabled={verifyVendorMutation.isPending}>
              Cancel
            </Button>
            <Button
              onClick={handleVerifyVendor}
              disabled={verifyVendorMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {verifyVendorMutation.isPending ? 'Verifying...' : 'Confirm Verification'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
