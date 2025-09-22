import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState, type ChangeEvent, type ClipboardEvent, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowLeft, Loader2, Save, X } from 'lucide-react'

import { AuthGuard } from '../../components/guards/AuthGuard'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Switch } from '../../components/ui/switch'
import { Textarea } from '../../components/ui/textarea'
import { useVendor, useUpdateVendor, useVendorResearchHistory } from '../../queries/vendors'
import {
  PricingModel,
  VendorCategory,
  VendorSize,
  VendorStatus,
  VerificationStatus,
} from '../../types/api'

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

type TextFormField = {
  [K in keyof FormState]: FormState[K] extends string ? K : never
}[keyof FormState]

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

type MultiValueInputProps = {
  id: string
  label: string
  values: string[]
  placeholder?: string
  description?: string
  onChange: (values: string[]) => void
}

const MultiValueInput = ({ id, label, values, placeholder, description, onChange }: MultiValueInputProps) => {
  const [inputValue, setInputValue] = useState('')

  const addValue = (rawValue: string) => {
    const value = rawValue.trim()
    if (!value) return
    const exists = values.some((item) => item.toLowerCase() === value.toLowerCase())
    if (exists) {
      setInputValue('')
      return
    }
    onChange([...values, value])
    setInputValue('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',' || event.key === 'Tab') {
      if (inputValue.trim().length === 0) return
      event.preventDefault()
      addValue(inputValue)
    }

    if (event.key === 'Backspace' && inputValue.length === 0 && values.length > 0) {
      event.preventDefault()
      onChange(values.slice(0, values.length - 1))
    }
  }

  const handleBlur = () => {
    if (inputValue.trim().length > 0) {
      addValue(inputValue)
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData('text')
    if (!text) return
    event.preventDefault()
    text
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .forEach(addValue)
  }

  const removeValue = (value: string) => {
    onChange(values.filter((item) => item !== value))
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="border-input focus-within:border-ring focus-within:ring-ring/50 relative flex min-h-11 w-full flex-wrap items-center gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-within:ring-[3px]">
        {values.map((value) => (
          <span
            key={value}
            className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-3 py-1 text-xs"
          >
            {value}
            <button
              type="button"
              className="hover:text-primary/80 focus-visible:outline-none"
              onClick={() => removeValue(value)}
              aria-label={`Remove ${label} ${value}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onPaste={handlePaste}
          placeholder={values.length === 0 ? placeholder : undefined}
          className="bg-transparent flex-1 min-w-[8rem] border-none outline-none text-sm"
        />
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  )
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

  const statusBadgeStyles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  }

  useEffect(() => {
    if (!vendor) return

    const profile = vendor.profile

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
      status: profile?.status ?? '',
      verificationStatus: profile?.verificationStatus ?? '',
      tags: profile?.tags ?? [],
      features: profile?.features ?? [],
      integrations: profile?.integrations ?? [],
      targetCustomers: profile?.targetCustomers ?? [],
      pricingNotes: profile?.pricingNotes ?? '',
      notes: profile?.notes ?? '',
    })
  }, [vendor])

  const handleInputChange = (field: TextFormField) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { value } = event.target
    setFormState((prev) => ({ ...prev, [field]: value }))
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

  const selectOptions = useMemo(
    () => ({
      categories: Object.values(VendorCategory),
      sizes: Object.values(VendorSize),
      pricingModels: Object.values(PricingModel),
      statuses: Object.values(VendorStatus),
      verificationStatuses: Object.values(VerificationStatus),
    }),
    []
  )

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
                <Link to="/vendor/$vendorId" params={{ vendorId }}>
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

        <div className="bg-white rounded-lg shadow-sm border">
          <form onSubmit={handleSubmit} className="space-y-8 p-6">
            <section className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company name</Label>
                <Input
                  id="companyName"
                  value={formState.companyName}
                  onChange={handleInputChange('companyName')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formState.website}
                  onChange={handleInputChange('website')}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formState.location}
                  onChange={handleInputChange('location')}
                  placeholder="Austin, TX"
                />
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-3 pt-6">
                <Label htmlFor="isActive">Active</Label>
                <Switch
                  id="isActive"
                  checked={formState.isActive}
                  onCheckedChange={(checked) =>
                    setFormState((prev) => ({ ...prev, isActive: checked }))
                  }
                />
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={formState.summary}
                  onChange={handleInputChange('summary')}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="detailedDescription">Detailed description</Label>
                <Textarea
                  id="detailedDescription"
                  value={formState.detailedDescription}
                  onChange={handleInputChange('detailedDescription')}
                  rows={4}
                />
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="border rounded-md px-3 py-2 text-sm"
                  value={formState.category}
                  onChange={handleInputChange('category')}
                >
                  <option value="">Select category</option>
                  {selectOptions.categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Company size</Label>
                <select
                  id="size"
                  className="border rounded-md px-3 py-2 text-sm"
                  value={formState.size}
                  onChange={handleInputChange('size')}
                >
                  <option value="">Select size</option>
                  {selectOptions.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricingModel">Pricing model</Label>
                <select
                  id="pricingModel"
                  className="border rounded-md px-3 py-2 text-sm"
                  value={formState.pricingModel}
                  onChange={handleInputChange('pricingModel')}
                >
                  <option value="">Select pricing model</option>
                  {selectOptions.pricingModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="founded">Founded</Label>
                <Input
                  id="founded"
                  value={formState.founded}
                  onChange={handleInputChange('founded')}
                  placeholder="2014"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employees">Employees</Label>
                <Input
                  id="employees"
                  value={formState.employees}
                  onChange={handleInputChange('employees')}
                  placeholder="250"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceRange">Price range</Label>
                <Input
                  id="priceRange"
                  value={formState.priceRange}
                  onChange={handleInputChange('priceRange')}
                  placeholder="$$"
                />
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formState.phone}
                  onChange={handleInputChange('phone')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={formState.email}
                  onChange={handleInputChange('email')}
                  type="email"
                />
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <MultiValueInput
                id="tags"
                label="Tags"
                values={formState.tags}
                placeholder="Add a tag and press enter"
                onChange={(values) => setFormState((prev) => ({ ...prev, tags: values }))}
              />
              <MultiValueInput
                id="integrations"
                label="Integrations"
                values={formState.integrations}
                placeholder="Add an integration and press enter"
                onChange={(values) => setFormState((prev) => ({ ...prev, integrations: values }))}
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <MultiValueInput
                id="features"
                label="Key features"
                values={formState.features}
                placeholder="List a feature and press enter"
                onChange={(values) => setFormState((prev) => ({ ...prev, features: values }))}
              />
              <MultiValueInput
                id="targetCustomers"
                label="Target customers"
                values={formState.targetCustomers}
                placeholder="Add a customer segment"
                onChange={(values) =>
                  setFormState((prev) => ({ ...prev, targetCustomers: values }))
                }
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="status">Vendor status</Label>
                <select
                  id="status"
                  className="border rounded-md px-3 py-2 text-sm"
                  value={formState.status}
                  onChange={handleInputChange('status')}
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
                  onChange={handleInputChange('verificationStatus')}
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
                  onChange={handleInputChange('logoUrl')}
                  placeholder="https://..."
                />
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pricingNotes">Pricing notes</Label>
                <Textarea
                  id="pricingNotes"
                  value={formState.pricingNotes}
                  onChange={handleInputChange('pricingNotes')}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Internal notes</Label>
                <Textarea
                  id="notes"
                  value={formState.notes}
                  onChange={handleInputChange('notes')}
                  rows={3}
                />
              </div>
            </section>

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
              <Button type="submit" disabled={updateVendor.isPending}>
                {updateVendor.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save changes
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">AI Research History</h2>
          <div className="bg-white rounded-lg border shadow-sm p-6 text-sm text-gray-600">
            {researchLoading ? (
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
