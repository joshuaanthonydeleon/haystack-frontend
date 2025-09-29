import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { Shield } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import type { Vendor } from '../../../types/api'

interface VerificationRequestsTabProps {
  pendingVerifications: Vendor[]
}

export const VerificationRequestsTab = ({ pendingVerifications }: VerificationRequestsTabProps) => {
  const [verificationPage, setVerificationPage] = useState(1)
  const [verificationPageSize, setVerificationPageSize] = useState(10)

  // Pagination logic for verification requests
  const paginatedVerifications = useMemo(() => {
    const startIndex = (verificationPage - 1) * verificationPageSize
    const endIndex = startIndex + verificationPageSize
    return pendingVerifications.slice(startIndex, endIndex)
  }, [pendingVerifications, verificationPage, verificationPageSize])

  const totalVerificationPages = Math.ceil(pendingVerifications.length / verificationPageSize)

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
            {pendingVerifications.length} pending verification requests
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

      <div className="grid gap-6">
        {paginatedVerifications.map((verification) => (
          <Link
            to="/admin/vendors/$vendorId/edit"
            params={{ vendorId: verification.id.toString() }}
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

            {/* <div className="flex gap-3">
              <Button
                onClick={() => handleClaimAction(claim.id, true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const reason = prompt('Reason for rejection (optional):')
                  handleClaimAction(claim.id, false, reason || undefined)
                }}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div> */}
          </Link>
        ))}

        {pendingVerifications.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Verification Requests</h3>
            <p className="text-gray-600">All verification requests have been reviewed.</p>
          </div>
        )}
      </div>

      {/* Pagination Navigation */}
      {pendingVerifications.length > 0 && totalVerificationPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>
              Showing {((verificationPage - 1) * verificationPageSize) + 1} to{' '}
              {Math.min(verificationPage * verificationPageSize, pendingVerifications.length)} of{' '}
              {pendingVerifications.length} results
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
    </div>
  )
}
