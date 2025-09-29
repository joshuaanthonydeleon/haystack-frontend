import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'

import { AuthGuard } from '@/components/guards/AuthGuard'
import { Button } from '@/components/ui/button'
import { VendorEditForm } from '@/components/vendor/VendorEditForm'
import { VendorResearchHistory } from '@/components/vendor/VendorResearchHistory'
import { useVendor, useUpdateVendor, useVendorResearchHistory } from '@/queries/vendors'
import {
  PricingModel,
  VendorCategory,
  VendorSize,
  VendorStatus,
  VerificationStatus,
} from '@/types/api'

type FormState = {
  companyName: string
  website: string
  isActive: boolean
  summary: string
  detailedDescription: string
  category: '' | VendorCategory
  size: '' | VendorSize
  location: string
  founded: string
  employees: string
  phone: string
  email: string
  logoUrl: string
  pricingModel: '' | PricingModel
  priceRange: string
  status: '' | VendorStatus
  verificationStatus: '' | VerificationStatus
  tags: string[]
  features: string[]
  integrations: string[]
  targetCustomers: string[]
  pricingNotes: string
  notes: string
}


const defaultFormState: FormState = {
  companyName: '',
  website: '',
  isActive: true,
  summary: '',
  detailedDescription: '',
  category: '',
  size: '',
  location: '',
  founded: '',
  employees: '',
  phone: '',
  email: '',
  logoUrl: '',
  pricingModel: '',
  priceRange: '',
  status: '',
  verificationStatus: '',
  tags: [],
  features: [],
  integrations: [],
  targetCustomers: [],
  pricingNotes: '',
  notes: '',
}

const emptyToNull = (value: string) => {
  const trimmed = value.trim()
  return trimmed.length === 0 ? null : trimmed
}

const VendorEditPage = () => {
  const { vendorId } = Route.useParams()
  const navigate = useNavigate()
  const { data, isLoading, error } = useVendor(vendorId)
  const updateVendor = useUpdateVendor()
  const { data: researchHistoryResponse, isLoading: researchLoading } = useVendorResearchHistory(vendorId)

  const vendor = data?.success ? data.data : null
  const researchHistory = researchHistoryResponse?.success ? researchHistoryResponse.data : []

  const [formState, setFormState] = useState<FormState>(defaultFormState)
  const [formError, setFormError] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [previousStatus, setPreviousStatus] = useState<'' | VendorStatus>('')

  useEffect(() => {
    if (!vendor) return

    const profile = vendor.profile
    const currentStatus = profile?.status ?? ''

    setFormState({
      companyName: vendor.companyName ?? '',
      website: vendor.website ?? '',
      isActive: vendor.isActive ?? true,
      summary: profile?.summary ?? '',
      detailedDescription: profile?.detailedDescription ?? '',
      category: profile?.category ?? '',
      size: profile?.size ?? '',
      location: profile?.location ?? '',
      founded: profile?.founded ?? '',
      employees: profile?.employees ?? '',
      phone: profile?.phone ?? '',
      email: profile?.email ?? '',
      logoUrl: profile?.logoUrl ?? '',
      pricingModel: profile?.pricingModel ?? '',
      priceRange: profile?.priceRange ?? '',
      status: currentStatus,
      verificationStatus: profile?.verificationStatus ?? '',
      tags: profile?.tags ?? [],
      features: profile?.features ?? [],
      integrations: profile?.integrations ?? [],
      targetCustomers: profile?.targetCustomers ?? [],
      pricingNotes: profile?.pricingNotes ?? '',
      notes: profile?.notes ?? '',
    })

    // Set the previous status for comparison
    setPreviousStatus(currentStatus)
  }, [vendor])

  const handleInputChange = (field: keyof FormState) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { value } = event.target
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleSwitchChange = (field: keyof FormState) => (checked: boolean) => {
    setFormState((prev) => ({ ...prev, [field]: checked }))
  }

  const handleTagsChange = (values: string[]) => {
    setFormState((prev) => ({ ...prev, tags: values }))
  }

  const handleFeaturesChange = (values: string[]) => {
    setFormState((prev) => ({ ...prev, features: values }))
  }

  const handleIntegrationsChange = (values: string[]) => {
    setFormState((prev) => ({ ...prev, integrations: values }))
  }

  const handleTargetCustomersChange = (values: string[]) => {
    setFormState((prev) => ({ ...prev, targetCustomers: values }))
  }

  const handleStatusChange = () => {
    // Update the previous status when status is actually changed
    setPreviousStatus(formState.status)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setSaveMessage(null)

    if (!formState.companyName.trim()) {
      setFormError('Company name is required.')
      return
    }

    const payload: Record<string, unknown> = {
      companyName: formState.companyName.trim(),
      isActive: formState.isActive,
      website: emptyToNull(formState.website),
      summary: emptyToNull(formState.summary),
      detailedDescription: emptyToNull(formState.detailedDescription),
      category: formState.category || null,
      size: formState.size || null,
      location: emptyToNull(formState.location),
      founded: emptyToNull(formState.founded),
      employees: emptyToNull(formState.employees),
      phone: emptyToNull(formState.phone),
      email: emptyToNull(formState.email),
      logoUrl: emptyToNull(formState.logoUrl),
      pricingModel: formState.pricingModel || null,
      priceRange: emptyToNull(formState.priceRange),
      status: formState.status || null,
      verificationStatus: formState.verificationStatus || null,
      tags: formState.tags.length > 0 ? formState.tags : null,
      features: formState.features.length > 0 ? formState.features : null,
      integrations: formState.integrations.length > 0 ? formState.integrations : null,
      targetCustomers: formState.targetCustomers.length > 0 ? formState.targetCustomers : null,
      pricingNotes: emptyToNull(formState.pricingNotes),
      notes: emptyToNull(formState.notes),
    }

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) {
        delete payload[key]
      }
    })

    try {
      const response = await updateVendor.mutateAsync({ id: vendorId, data: payload })
      if (response.success) {
        setSaveMessage('Vendor updated successfully.')
      } else {
        setFormError(response.error ?? 'Failed to update vendor. Please try again.')
      }
    } catch (mutationError) {
      setFormError(
        mutationError instanceof Error
          ? mutationError.message
          : 'Unexpected error while updating vendor.'
      )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading vendor details...</p>
        </div>
      </div>
    )
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Vendor not available</h1>
          <p className="text-gray-600">
            {error instanceof Error ? error.message : 'We could not load this vendor right now.'}
          </p>
          <Button onClick={() => navigate({ to: '/admin/dashboard' })}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/admin/dashboard' })}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to dashboard
              </Button>
              <Button asChild variant="outline">
                <Link to="/vendors/$vendorId" params={{ vendorId }}>
                  View public profile
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/admin/vendors/$vendorId/research" params={{ vendorId }}>
                  Research history
                </Link>
              </Button>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit {vendor.companyName}</h1>
              <p className="text-gray-600">
                Update key details for this vendor. Use enter to add multi-value fields like tags or integrations.
              </p>
            </div>
          </div>
        </div>

        <VendorEditForm
          formState={formState}
          formError={formError}
          saveMessage={saveMessage}
          isSubmitting={updateVendor.isPending}
          onInputChange={handleInputChange}
          onSwitchChange={handleSwitchChange}
          onTagsChange={handleTagsChange}
          onFeaturesChange={handleFeaturesChange}
          onIntegrationsChange={handleIntegrationsChange}
          onTargetCustomersChange={handleTargetCustomersChange}
          onSubmit={handleSubmit}
          onStatusChange={handleStatusChange}
          previousStatus={previousStatus}
        />

        <VendorResearchHistory
          vendorId={vendorId}
          researchHistory={researchHistory}
          isLoading={researchLoading}
        />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/admin/vendors/$vendorId/edit')({
  component: () => (
    <AuthGuard requiredRole="admin">
      <VendorEditPage />
    </AuthGuard>
  ),
})
