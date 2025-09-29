import { type ChangeEvent, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { VendorStatus, VerificationStatus } from '@/types/api'

type FormState = {
  status: '' | VendorStatus
  verificationStatus: '' | VerificationStatus
  logoUrl: string
}

type StatusSectionProps = {
  formState: FormState
  onInputChange: (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onStatusChange?: (newStatus: '' | VendorStatus) => void
  previousStatus?: '' | VendorStatus
}

export const StatusSection = ({ 
  formState, 
  onInputChange, 
  onStatusChange, 
  previousStatus 
}: StatusSectionProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<'' | VendorStatus>('')

  const selectOptions = {
    statuses: Object.values(VendorStatus),
    verificationStatuses: Object.values(VerificationStatus),
  }

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value as '' | VendorStatus
    
    // Only show confirmation if status is actually changing and we have a previous status
    if (previousStatus !== undefined && newStatus !== formState.status) {
      setPendingStatus(newStatus)
      setShowConfirmation(true)
    } else {
      // If no previous status (initial load) or same status, update directly
      onInputChange('status')(event)
      onStatusChange?.(newStatus)
    }
  }

  const handleConfirmStatusChange = () => {
    onInputChange('status')({ target: { value: pendingStatus } } as ChangeEvent<HTMLSelectElement>)
    onStatusChange?.(pendingStatus)
    setShowConfirmation(false)
    setPendingStatus('')
  }

  const handleCancelStatusChange = () => {
    setShowConfirmation(false)
    setPendingStatus('')
  }

  const getStatusDisplayName = (status: '' | VendorStatus) => {
    if (!status) return 'Select status'
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const getConfirmationMessage = (fromStatus: '' | VendorStatus, toStatus: '' | VendorStatus) => {
    const fromDisplay = fromStatus ? getStatusDisplayName(fromStatus) : 'No status'
    const toDisplay = getStatusDisplayName(toStatus)
    return `Are you sure you want to change the vendor status from "${fromDisplay}" to "${toDisplay}"? This action will be saved immediately.`
  }

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="status">Vendor status</Label>
          <select
            id="status"
            className="border rounded-md px-3 py-2 text-sm"
            value={formState.status}
            onChange={handleStatusChange}
          >
            <option value="">Select status</option>
            {selectOptions.statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="verificationStatus">Verification status</Label>
          <select
            id="verificationStatus"
            className="border rounded-md px-3 py-2 text-sm"
            value={formState.verificationStatus}
            onChange={onInputChange('verificationStatus')}
          >
            <option value="">Select verification status</option>
            {selectOptions.verificationStatuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="logoUrl">Logo URL</Label>
          <Input
            id="logoUrl"
            value={formState.logoUrl}
            onChange={onInputChange('logoUrl')}
            placeholder="https://..."
          />
        </div>
      </section>

      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        title="Confirm Status Change"
        description={getConfirmationMessage(previousStatus || '', pendingStatus)}
        confirmText="Change Status"
        cancelText="Cancel"
        onConfirm={handleConfirmStatusChange}
        onCancel={handleCancelStatusChange}
        variant="default"
      />
    </>
  )
}
