import { useState } from 'react'
import { Calendar, Clock, User, Building2, Mail, Phone } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './ui/dialog'

interface DemoRequestModalProps {
  vendor: {
    name: string
    category: string
  }
  isOpen: boolean
  onClose: () => void
}

export function DemoRequestModal({ vendor, isOpen, onClose }: DemoRequestModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bankName: '',
    title: '',
    assetsUnderManagement: '',
    currentProvider: '',
    timeline: '',
    preferredTime: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // TODO: Submit demo request to API
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      alert('Demo request submitted! The vendor will contact you within 1-2 business days.')
      onClose()
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        bankName: '',
        title: '',
        assetsUnderManagement: '',
        currentProvider: '',
        timeline: '',
        preferredTime: '',
        message: ''
      })
    } catch (error) {
      console.error('Demo request failed:', error)
      alert('Failed to submit demo request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogClose onClick={onClose} />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Request Demo - {vendor.name}
          </DialogTitle>
          <DialogDescription>
            Fill out this form to request a personalized demo. The vendor will contact you within 1-2 business days.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4" />
              Your Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="title">Your Title</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., CTO, VP Technology, IT Director"
                className="mt-1"
              />
            </div>
          </div>

          {/* Institution Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Institution Information
            </h3>
            
            <div>
              <Label htmlFor="bankName">Institution Name</Label>
              <Input
                id="bankName"
                required
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                placeholder="Your bank or credit union name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="assetsUnderManagement">Assets Under Management</Label>
              <Select onValueChange={(value) => handleInputChange('assetsUnderManagement', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select asset range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-50m">Under $50M</SelectItem>
                  <SelectItem value="50m-100m">$50M - $100M</SelectItem>
                  <SelectItem value="100m-500m">$100M - $500M</SelectItem>
                  <SelectItem value="500m-1b">$500M - $1B</SelectItem>
                  <SelectItem value="1b-5b">$1B - $5B</SelectItem>
                  <SelectItem value="over-5b">Over $5B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="currentProvider">Current {vendor.category} Provider (if any)</Label>
              <Input
                id="currentProvider"
                value={formData.currentProvider}
                onChange={(e) => handleInputChange('currentProvider', e.target.value)}
                placeholder="Your current solution provider"
                className="mt-1"
              />
            </div>
          </div>

          {/* Demo Preferences */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Demo Preferences
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeline">Implementation Timeline</Label>
                <Select onValueChange={(value) => handleInputChange('timeline', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate (0-3 months)</SelectItem>
                    <SelectItem value="short-term">Short-term (3-6 months)</SelectItem>
                    <SelectItem value="medium-term">Medium-term (6-12 months)</SelectItem>
                    <SelectItem value="long-term">Long-term (12+ months)</SelectItem>
                    <SelectItem value="research">Just researching</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="preferredTime">Preferred Demo Time</Label>
                <Select onValueChange={(value) => handleInputChange('preferredTime', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="message">Additional Information (Optional)</Label>
              <textarea
                id="message"
                rows={3}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Any specific questions or requirements you'd like to discuss..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Terms */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <input
                id="agree-contact"
                name="agree-contact"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="agree-contact" className="text-sm text-gray-700">
                I agree to be contacted by {vendor.name} regarding this demo request.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Submitting...' : 'Request Demo'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}