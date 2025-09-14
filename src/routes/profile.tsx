import { createFileRoute } from '@tanstack/react-router'
import { User, Mail, Phone, Building2, Calendar, Edit, Settings } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useAuth } from '../contexts/AuthContext'


const UserProfile = () => {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
          <p className="text-gray-600">Please sign in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-blue-600" />
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600 mb-2">
                  {user.email}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {user.role}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Button variant="outline" className="flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </Button>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">Not provided</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Account Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="text-gray-900 capitalize">{user.role}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Roles</p>
                  <p className="text-gray-900">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account-specific sections */}
        {user.role === 'vendor' && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Vendor Information
            </h2>
            <p className="text-gray-600">
              Manage your vendor profile and business information from the{' '}
              <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                Vendor Portal
              </Button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/profile')({
  component: UserProfile,
})