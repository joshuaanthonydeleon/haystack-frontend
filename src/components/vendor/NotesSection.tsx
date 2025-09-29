import { type ChangeEvent } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type FormState = {
  pricingNotes: string
  notes: string
}

type NotesSectionProps = {
  formState: FormState
  onInputChange: (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}

export const NotesSection = ({ formState, onInputChange }: NotesSectionProps) => {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="pricingNotes">Pricing notes</Label>
        <Textarea
          id="pricingNotes"
          value={formState.pricingNotes}
          onChange={onInputChange('pricingNotes')}
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Internal notes</Label>
        <Textarea
          id="notes"
          value={formState.notes}
          onChange={onInputChange('notes')}
          rows={3}
        />
      </div>
    </section>
  )
}
