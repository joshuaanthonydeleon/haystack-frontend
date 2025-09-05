import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { 
  Shield, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Globe, 
  Building2,
  Mail,
  Phone
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { AuthGuard } from '../../components/guards/AuthGuard'

export const Route = createFileRoute('/vendor/verify')({
  component: () => (
    <AuthGuard requiredRole="vendor">
      <VendorVerification />
    </AuthGuard>
  ),
})

const VendorVerification = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [verificationType, setVerificationType] = useState('')
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    businessEmail: '',
    phoneNumber: '',
    businessLicense: '',
    incorporationState: '',
    ein: '',
    businessAddress: '',
    contactName: '',
    contactTitle: '',
    contactEmail: '',
    contactPhone: '',
    linkedinProfile: '',
    businessDescription: '',
    yearsInBusiness: '',
    employeeCount: '',
    certifications: [] as string[],
    clientReferences: [] as Array<{name: string, contact: string, relationship: string}>
  })
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({})

  const verificationSteps = [
    { id: 1, name: 'Verification Type', description: 'Choose verification method' },
    { id: 2, name: 'Company Details', description: 'Basic company information' },
    { id: 3, name: 'Business Documents', description: 'Upload verification documents' },
    { id: 4, name: 'Contact Verification', description: 'Verify authorized representative' },
    { id: 5, name: 'Review & Submit', description: 'Review and submit verification' }
  ]

  const verificationTypes = [
    {
      id: 'domain',
      name: 'Domain Verification',
      description: 'Verify ownership of your company domain',
      icon: Globe,
      difficulty: 'Easy',
      timeframe: '5-10 minutes',
      requirements: ['Access to company domain DNS', 'Business email address']
    },
    {
      id: 'business-license',
      name: 'Business License',
      description: 'Upload official business license or registration',
      icon: FileText,
      difficulty: 'Medium',
      timeframe: '1-2 business days',
      requirements: ['Valid business license', 'State/local registration', 'EIN documentation']
    },
    {
      id: 'incorporation',
      name: 'Articles of Incorporation',
      description: 'Provide incorporation documents',
      icon: Building2,
      difficulty: 'Medium',
      timeframe: '1-2 business days',
      requirements: ['Articles of incorporation', 'Certificate of good standing', 'Operating agreement (if LLC)']
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Verification',
      description: 'Verify through LinkedIn company profile',
      icon: Shield,
      difficulty: 'Easy',
      timeframe: '30 minutes',
      requirements: ['LinkedIn company page admin access', 'Professional LinkedIn profile', 'Company email address']
    }
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field: string, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [field]: file }))
  }

  const nextStep = () => {
    if (currentStep < verificationSteps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderVerificationTypeStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Verification Method</h2>
        <p className="text-gray-600">Select the verification method that works best for your company</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {verificationTypes.map((type) => {
          const Icon = type.icon
          return (
            <div
              key={type.id}
              onClick={() => setVerificationType(type.id)}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-colors ${
                verificationType === type.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{type.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className={`px-2 py-1 rounded-full ${
                      type.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      type.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {type.difficulty}
                    </span>
                    <span>~{type.timeframe}</span>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Requirements:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {type.requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {verificationType && (
        <div className="text-center">
          <Button onClick={nextStep} size="lg">
            Continue with {verificationTypes.find(t => t.id === verificationType)?.name}
          </Button>
        </div>
      )}
    </div>
  )

  const renderCompanyDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Information</h2>
        <p className="text-gray-600">Provide basic details about your company</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            placeholder="CoreTech Solutions"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="website">Company Website *</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://coretech-solutions.com"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="businessEmail">Business Email *</Label>
          <Input
            id="businessEmail"
            type="email"
            value={formData.businessEmail}
            onChange={(e) => handleInputChange('businessEmail', e.target.value)}
            placeholder="admin@coretech-solutions.com"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber">Business Phone *</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            placeholder="+1 (512) 555-0123"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="incorporationState">State of Incorporation *</Label>
          <Select onValueChange={(value) => handleInputChange('incorporationState', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AL">Alabama</SelectItem>
              <SelectItem value="AK">Alaska</SelectItem>
              <SelectItem value="AZ">Arizona</SelectItem>
              <SelectItem value="CA">California</SelectItem>
              <SelectItem value="TX">Texas</SelectItem>
              {/* Add more states */}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="ein">EIN (Tax ID) *</Label>
          <Input
            id="ein"
            value={formData.ein}
            onChange={(e) => handleInputChange('ein', e.target.value)}
            placeholder="12-3456789"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="yearsInBusiness">Years in Business *</Label>
          <Select onValueChange={(value) => handleInputChange('yearsInBusiness', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1">Less than 1 year</SelectItem>
              <SelectItem value="1-3">1-3 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="5-10">5-10 years</SelectItem>
              <SelectItem value="10+">10+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="employeeCount">Employee Count *</Label>
          <Select onValueChange={(value) => handleInputChange('employeeCount', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 employees</SelectItem>
              <SelectItem value="11-50">11-50 employees</SelectItem>
              <SelectItem value="51-200">51-200 employees</SelectItem>
              <SelectItem value="201-500">201-500 employees</SelectItem>
              <SelectItem value="500+">500+ employees</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="businessAddress">Business Address *</Label>
        <textarea
          id="businessAddress"
          rows={3}
          value={formData.businessAddress}
          onChange={(e) => handleInputChange('businessAddress', e.target.value)}
          placeholder="123 Business St, Austin, TX 78701"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <Label htmlFor="businessDescription">Business Description *</Label>
        <textarea
          id="businessDescription"
          rows={4}
          value={formData.businessDescription}
          onChange={(e) => handleInputChange('businessDescription', e.target.value)}
          placeholder="Describe your company's products, services, and target market..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep}>Continue</Button>
      </div>
    </div>
  )

  const renderDocumentUploadStep = () => {
    const requiredDocuments = {
      'domain': ['Domain verification file', 'Business email confirmation'],
      'business-license': ['Business license', 'State registration', 'EIN letter'],
      'incorporation': ['Articles of incorporation', 'Certificate of good standing', 'Operating agreement'],
      'linkedin': ['LinkedIn company profile screenshot', 'Admin verification']
    }

    const docs = requiredDocuments[verificationType as keyof typeof requiredDocuments] || []

    return (
      <div className="space-y-6">
        <div className="text-center">
          <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Documents</h2>
          <p className="text-gray-600">Upload the required verification documents</p>
        </div>

        <div className="space-y-4">
          {docs.map((doc, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{doc}</h3>
                <span className="text-sm text-red-600">Required</span>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Drop files here or click to browse</p>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(doc, file)
                  }}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <Button variant="outline" size="sm" onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                  input?.click()
                }}>
                  Choose File
                </Button>
                <p className="text-xs text-gray-500 mt-2">PDF, DOC, or Image files (max 10MB)</p>
              </div>
              
              {uploadedFiles[doc] && (
                <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  {uploadedFiles[doc].name} uploaded
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Document Requirements</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• All documents must be clear and legible</li>
                <li>• Documents should be current and not expired</li>
                <li>• Company name must match across all documents</li>
                <li>• Files must be under 10MB each</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep}>Back</Button>
          <Button onClick={nextStep}>Continue</Button>
        </div>
      </div>
    )
  }

  const renderContactVerificationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Verification</h2>
        <p className="text-gray-600">Verify the authorized representative for this verification</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="contactName">Full Name *</Label>
          <Input
            id="contactName"
            value={formData.contactName}
            onChange={(e) => handleInputChange('contactName', e.target.value)}
            placeholder="John Doe"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="contactTitle">Job Title *</Label>
          <Input
            id="contactTitle"
            value={formData.contactTitle}
            onChange={(e) => handleInputChange('contactTitle', e.target.value)}
            placeholder="CEO, CTO, VP"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="contactEmail">Business Email *</Label>
          <Input
            id="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={(e) => handleInputChange('contactEmail', e.target.value)}
            placeholder="john@company.com"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Must use company domain</p>
        </div>

        <div>
          <Label htmlFor="contactPhone">Phone Number *</Label>
          <Input
            id="contactPhone"
            type="tel"
            value={formData.contactPhone}
            onChange={(e) => handleInputChange('contactPhone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="mt-1"
          />
        </div>

        {verificationType === 'linkedin' && (
          <div className="md:col-span-2">
            <Label htmlFor="linkedinProfile">LinkedIn Profile URL *</Label>
            <Input
              id="linkedinProfile"
              type="url"
              value={formData.linkedinProfile}
              onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
              placeholder="https://www.linkedin.com/in/johndoe"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Must be a professional LinkedIn profile with company affiliation</p>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-900 mb-1">Verification Process</h3>
            <p className="text-sm text-yellow-800">
              We will contact the provided representative to verify their authority to represent the company. 
              This may include phone verification and/or email confirmation.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep}>Continue</Button>
      </div>
    </div>
  )

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">Review your information before submitting for verification</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Verification Summary</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Verification Method</h4>
            <p className="text-gray-600">
              {verificationTypes.find(t => t.id === verificationType)?.name}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Company Name</h4>
            <p className="text-gray-600">{formData.companyName}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Website</h4>
            <p className="text-gray-600">{formData.website}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Contact Person</h4>
            <p className="text-gray-600">{formData.contactName} - {formData.contactTitle}</p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-2">Uploaded Documents</h4>
          <div className="space-y-2">
            {Object.keys(uploadedFiles).map((doc) => (
              <div key={doc} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{doc}</span>
                <span className="text-gray-500">({uploadedFiles[doc].name})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">What happens next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Our verification team will review your submission within 1-2 business days</li>
              <li>• You'll receive email updates on the verification status</li>
              <li>• We may contact you for additional information if needed</li>
              <li>• Once verified, you'll have full access to manage your vendor profile</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <Button onClick={() => alert('Verification submitted!')} className="bg-green-600 hover:bg-green-700">
          Submit for Verification
        </Button>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderVerificationTypeStep()
      case 2: return renderCompanyDetailsStep()
      case 3: return renderDocumentUploadStep()
      case 4: return renderContactVerificationStep()
      case 5: return renderReviewStep()
      default: return renderVerificationTypeStep()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {verificationSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < verificationSteps.length - 1 && (
                  <div className={`hidden sm:block w-20 h-1 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-4">
            {verificationSteps.map((step) => (
              <div key={step.id} className="text-center" style={{ width: '120px' }}>
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  )
}