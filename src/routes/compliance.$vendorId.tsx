import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { 
  FileText, 
  Download, 
  Shield, 
  Calendar, 
  CheckCircle, 
  Lock,
  Building2,
  AlertTriangle
} from 'lucide-react'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/compliance/$vendorId')({
  component: ComplianceDocumentation,
})

const ComplianceDocumentation = () => {
  const { vendorId } = Route.useParams()
  const [requestedDocs, setRequestedDocs] = useState<string[]>([])

  // Mock compliance data
  const vendor = {
    id: vendorId,
    name: 'CoreTech Solutions',
    category: 'Core Banking',
    lastAudited: '2024-02-15'
  }

  const complianceDocuments = [
    {
      id: 'soc2-type2',
      title: 'SOC 2 Type II Report',
      description: 'Security, Availability, and Confidentiality audit report',
      type: 'Security Audit',
      lastUpdated: '2024-01-15',
      status: 'current',
      size: '2.3 MB',
      confidentiality: 'restricted',
      requiredApproval: true
    },
    {
      id: 'pci-dss',
      title: 'PCI DSS Compliance Certificate',
      description: 'Payment Card Industry Data Security Standard compliance',
      type: 'Security Certification',
      lastUpdated: '2024-02-01',
      status: 'current',
      size: '856 KB',
      confidentiality: 'public',
      requiredApproval: false
    },
    {
      id: 'ffiec-assessment',
      title: 'FFIEC Cybersecurity Assessment',
      description: 'Federal Financial Institutions Examination Council assessment',
      type: 'Regulatory Assessment',
      lastUpdated: '2024-01-20',
      status: 'current',
      size: '4.1 MB',
      confidentiality: 'restricted',
      requiredApproval: true
    },
    {
      id: 'iso27001',
      title: 'ISO 27001 Certification',
      description: 'Information security management system certification',
      type: 'Security Certification',
      lastUpdated: '2023-11-15',
      status: 'current',
      size: '1.2 MB',
      confidentiality: 'public',
      requiredApproval: false
    },
    {
      id: 'penetration-test',
      title: 'Third-Party Penetration Test Results',
      description: 'Annual security penetration testing report',
      type: 'Security Assessment',
      lastUpdated: '2024-01-30',
      status: 'current',
      size: '3.7 MB',
      confidentiality: 'confidential',
      requiredApproval: true
    },
    {
      id: 'disaster-recovery',
      title: 'Business Continuity & Disaster Recovery Plan',
      description: 'Comprehensive BCP/DR documentation and testing results',
      type: 'Operational Documentation',
      lastUpdated: '2024-02-10',
      status: 'current',
      size: '5.2 MB',
      confidentiality: 'restricted',
      requiredApproval: true
    },
    {
      id: 'data-processing',
      title: 'Data Processing Agreement (DPA)',
      description: 'GDPR and privacy compliance documentation',
      type: 'Legal Documentation',
      lastUpdated: '2024-01-05',
      status: 'current',
      size: '892 KB',
      confidentiality: 'restricted',
      requiredApproval: true
    }
  ]

  const handleRequestDocument = (docId: string) => {
    setRequestedDocs(prev => [...prev, docId])
    // TODO: Call API to request document access
    alert('Document access requested! You will receive an email when approved.')
  }

  const handleDownloadDocument = (docId: string) => {
    // TODO: Call API to download document
    alert('Document download initiated.')
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      current: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Current' },
      expiring: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle, text: 'Expiring Soon' },
      expired: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, text: 'Expired' }
    }
    
    const badge = badges[status as keyof typeof badges] || badges.current
    const Icon = badge.icon
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.text}
      </span>
    )
  }

  const getConfidentialityBadge = (level: string) => {
    const badges = {
      public: { color: 'bg-blue-100 text-blue-800', text: 'Public' },
      restricted: { color: 'bg-orange-100 text-orange-800', text: 'Restricted' },
      confidential: { color: 'bg-red-100 text-red-800', text: 'Confidential' }
    }
    
    const badge = badges[level as keyof typeof badges] || badges.restricted
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Lock className="w-3 h-3 mr-1" />
        {badge.text}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Compliance Documentation
              </h1>
              <p className="text-gray-600 mb-4">
                {vendor.name} - {vendor.category}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Last audited: {new Date(vendor.lastAudited).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  {complianceDocuments.length} documents available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Compliance Document Access</h3>
              <p className="text-sm text-blue-800">
                Some documents require approval before access. Restricted and confidential documents 
                are shared only after verification of your institution and signing appropriate NDAs.
              </p>
            </div>
          </div>
        </div>

        {/* Document Categories */}
        <div className="grid gap-8">
          {/* Security & Compliance */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Security & Compliance Certifications
              </h2>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                {complianceDocuments
                  .filter(doc => doc.type.includes('Security') || doc.type.includes('Regulatory'))
                  .map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-2">
                            <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 mb-1">{doc.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>Updated: {new Date(doc.lastUpdated).toLocaleDateString()}</span>
                                <span>Size: {doc.size}</span>
                                <span>Type: {doc.type}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-8">
                            {getStatusBadge(doc.status)}
                            {getConfidentialityBadge(doc.confidentiality)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {doc.requiredApproval ? (
                            requestedDocs.includes(doc.id) ? (
                              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                                Access Requested
                              </span>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRequestDocument(doc.id)}
                              >
                                Request Access
                              </Button>
                            )
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleDownloadDocument(doc.id)}
                              className="flex items-center gap-1"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Operational Documentation */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Operational & Legal Documentation
              </h2>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                {complianceDocuments
                  .filter(doc => doc.type.includes('Operational') || doc.type.includes('Legal'))
                  .map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-2">
                            <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 mb-1">{doc.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>Updated: {new Date(doc.lastUpdated).toLocaleDateString()}</span>
                                <span>Size: {doc.size}</span>
                                <span>Type: {doc.type}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-8">
                            {getStatusBadge(doc.status)}
                            {getConfidentialityBadge(doc.confidentiality)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {doc.requiredApproval ? (
                            requestedDocs.includes(doc.id) ? (
                              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                                Access Requested
                              </span>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRequestDocument(doc.id)}
                              >
                                Request Access
                              </Button>
                            )
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleDownloadDocument(doc.id)}
                              className="flex items-center gap-1"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you need additional documentation or have questions about compliance requirements, 
            our team can help connect you with the vendor's compliance team.
          </p>
          <Button variant="outline">
            Contact Compliance Team
          </Button>
        </div>
      </div>
    </div>
  )
}