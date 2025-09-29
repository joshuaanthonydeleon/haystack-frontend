import { MultiValueInput } from '@/components/ui/multi-value-input'

type FormState = {
  tags: string[]
  features: string[]
  integrations: string[]
  targetCustomers: string[]
}

type MultiValueSectionProps = {
  formState: FormState
  onTagsChange: (values: string[]) => void
  onFeaturesChange: (values: string[]) => void
  onIntegrationsChange: (values: string[]) => void
  onTargetCustomersChange: (values: string[]) => void
}

export const MultiValueSection = ({ 
  formState, 
  onTagsChange, 
  onFeaturesChange, 
  onIntegrationsChange, 
  onTargetCustomersChange 
}: MultiValueSectionProps) => {
  return (
    <>
      <section className="grid gap-6 lg:grid-cols-2">
        <MultiValueInput
          id="tags"
          label="Tags"
          values={formState.tags}
          placeholder="Add a tag and press enter"
          onChange={onTagsChange}
        />
        <MultiValueInput
          id="integrations"
          label="Integrations"
          values={formState.integrations}
          placeholder="Add an integration and press enter"
          onChange={onIntegrationsChange}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <MultiValueInput
          id="features"
          label="Key features"
          values={formState.features}
          placeholder="List a feature and press enter"
          onChange={onFeaturesChange}
        />
        <MultiValueInput
          id="targetCustomers"
          label="Target customers"
          values={formState.targetCustomers}
          placeholder="Add a customer segment"
          onChange={onTargetCustomersChange}
        />
      </section>
    </>
  )
}
