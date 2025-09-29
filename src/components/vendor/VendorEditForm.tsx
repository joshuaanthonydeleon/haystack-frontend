import { type ChangeEvent, type FormEvent } from 'react'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BasicInfoSection } from './BasicInfoSection'
import { DescriptionSection } from './DescriptionSection'
import { CategorySection } from './CategorySection'
import { DetailsSection } from './DetailsSection'
import { ContactSection } from './ContactSection'
import { MultiValueSection } from './MultiValueSection'
import { StatusSection } from './StatusSection'
import { NotesSection } from './NotesSection'
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

type VendorEditFormProps = {
  formState: FormState
  formError: string | null
  saveMessage: string | null
  isSubmitting: boolean
  onInputChange: (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onSwitchChange: (field: keyof FormState) => (checked: boolean) => void
  onTagsChange: (values: string[]) => void
  onFeaturesChange: (values: string[]) => void
  onIntegrationsChange: (values: string[]) => void
  onTargetCustomersChange: (values: string[]) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onStatusChange?: (newStatus: '' | VendorStatus) => void
  previousStatus?: '' | VendorStatus
}


export const VendorEditForm = ({
  formState,
  formError,
  saveMessage,
  isSubmitting,
  onInputChange,
  onSwitchChange,
  onTagsChange,
  onFeaturesChange,
  onIntegrationsChange,
  onTargetCustomersChange,
  onSubmit,
  onStatusChange,
  previousStatus,
}: VendorEditFormProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <form onSubmit={onSubmit} className="space-y-8 p-6">
        <BasicInfoSection
          formState={{
            companyName: formState.companyName,
            website: formState.website,
            isActive: formState.isActive,
            location: formState.location,
          }}
          onInputChange={onInputChange}
          onSwitchChange={onSwitchChange}
        />

        <DescriptionSection
          formState={{
            summary: formState.summary,
            detailedDescription: formState.detailedDescription,
          }}
          onInputChange={onInputChange}
        />

        <CategorySection
          formState={{
            category: formState.category,
            size: formState.size,
            pricingModel: formState.pricingModel,
          }}
          onInputChange={onInputChange}
        />

        <DetailsSection
          formState={{
            founded: formState.founded,
            employees: formState.employees,
            priceRange: formState.priceRange,
          }}
          onInputChange={onInputChange}
        />

        <ContactSection
          formState={{
            phone: formState.phone,
            email: formState.email,
          }}
          onInputChange={onInputChange}
        />

        <MultiValueSection
          formState={{
            tags: formState.tags,
            features: formState.features,
            integrations: formState.integrations,
            targetCustomers: formState.targetCustomers,
          }}
          onTagsChange={onTagsChange}
          onFeaturesChange={onFeaturesChange}
          onIntegrationsChange={onIntegrationsChange}
          onTargetCustomersChange={onTargetCustomersChange}
        />

        <StatusSection
          formState={{
            status: formState.status,
            verificationStatus: formState.verificationStatus,
            logoUrl: formState.logoUrl,
          }}
          onInputChange={onInputChange}
          onStatusChange={onStatusChange}
          previousStatus={previousStatus}
        />

        <NotesSection
          formState={{
            pricingNotes: formState.pricingNotes,
            notes: formState.notes,
          }}
          onInputChange={onInputChange}
        />

        {formError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        {saveMessage && (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {saveMessage}
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save changes
          </Button>
        </div>
      </form>
    </div>
  )
}
