import { type ChangeEvent } from 'react'
import { Label } from '@/components/ui/label'
import { VendorCategory, VendorSize, PricingModel } from '@/types/api'

type FormState = {
  category: '' | VendorCategory
  size: '' | VendorSize
  pricingModel: '' | PricingModel
}

type CategorySectionProps = {
  formState: FormState
  onInputChange: (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}

export const CategorySection = ({ formState, onInputChange }: CategorySectionProps) => {
  const selectOptions = {
    categories: Object.values(VendorCategory),
    sizes: Object.values(VendorSize),
    pricingModels: Object.values(PricingModel),
  }

  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          className="border rounded-md px-3 py-2 text-sm"
          value={formState.category}
          onChange={onInputChange('category')}
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
          onChange={onInputChange('size')}
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
          onChange={onInputChange('pricingModel')}
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
  )
}
