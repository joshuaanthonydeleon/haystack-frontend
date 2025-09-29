import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

type VendorResearchHistoryProps = {
  vendorId: string
  researchHistory: any[]
  isLoading: boolean
}

export const VendorResearchHistory = ({ vendorId, researchHistory, isLoading }: VendorResearchHistoryProps) => {
  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">AI Research History</h2>
      <div className="bg-white rounded-lg border shadow-sm p-6 text-sm text-gray-600">
        {isLoading ? (
          'Loading research history…'
        ) : (
          <>
            <p>{researchHistory.length} research run(s) recorded.</p>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/vendors/$vendorId/research" params={{ vendorId }}>
                  View full research history
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
