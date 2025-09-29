import { type ChangeEvent } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type FormState = {
  summary: string
  detailedDescription: string
}

type DescriptionSectionProps = {
  formState: FormState
  onInputChange: (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}

export const DescriptionSection = ({ formState, onInputChange }: DescriptionSectionProps) => {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          value={formState.summary}
          onChange={onInputChange('summary')}
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="detailedDescription">Detailed description</Label>
        <Textarea
          id="detailedDescription"
          value={formState.detailedDescription}
          onChange={onInputChange('detailedDescription')}
          rows={4}
        />
      </div>
    </section>
  )
}
