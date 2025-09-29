import { type ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

type FormState = {
  companyName: string
  website: string
  isActive: boolean
  location: string
}

type BasicInfoSectionProps = {
  formState: FormState
  onInputChange: (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onSwitchChange: (field: keyof FormState) => (checked: boolean) => void
}

export const BasicInfoSection = ({ formState, onInputChange, onSwitchChange }: BasicInfoSectionProps) => {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company name</Label>
        <Input
          id="companyName"
          value={formState.companyName}
          onChange={onInputChange('companyName')}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={formState.website}
          onChange={onInputChange('website')}
          placeholder="https://example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formState.location}
          onChange={onInputChange('location')}
          placeholder="Austin, TX"
        />
      </div>
      <div className="grid grid-cols-[auto_1fr] items-center gap-3 pt-6">
        <Label htmlFor="isActive">Active</Label>
        <Switch
          id="isActive"
          checked={formState.isActive}
          onCheckedChange={onSwitchChange('isActive')}
        />
      </div>
    </section>
  )
}
