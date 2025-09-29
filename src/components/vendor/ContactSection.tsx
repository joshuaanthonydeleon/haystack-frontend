import { type ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type FormState = {
  phone: string
  email: string
}

type ContactSectionProps = {
  formState: FormState
  onInputChange: (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}

export const ContactSection = ({ formState, onInputChange }: ContactSectionProps) => {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formState.phone}
          onChange={onInputChange('phone')}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={formState.email}
          onChange={onInputChange('email')}
          type="email"
        />
      </div>
    </section>
  )
}
