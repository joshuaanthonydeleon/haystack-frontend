import { type ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type FormState = {
  founded: string
  employees: string
  priceRange: string
}

type DetailsSectionProps = {
  formState: FormState
  onInputChange: (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}

export const DetailsSection = ({ formState, onInputChange }: DetailsSectionProps) => {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="founded">Founded</Label>
        <Input
          id="founded"
          value={formState.founded}
          onChange={onInputChange('founded')}
          placeholder="2014"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="employees">Employees</Label>
        <Input
          id="employees"
          value={formState.employees}
          onChange={onInputChange('employees')}
          placeholder="250"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceRange">Price range</Label>
        <Input
          id="priceRange"
          value={formState.priceRange}
          onChange={onInputChange('priceRange')}
          placeholder="$$"
        />
      </div>
    </section>
  )
}
