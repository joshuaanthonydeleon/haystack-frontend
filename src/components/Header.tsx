import { Link } from '@tanstack/react-router'
import { Search, Building2, User, Menu, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, signOut, hasRole } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Haystack FI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Always show public pages */}
            <Link 
              to="/vendors" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Find Vendors
            </Link>
            
            {/* Show authenticated user links */}
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
            )}
            
            {/* Show vendor claim link for non-vendors */}
            {(!isAuthenticated || !hasRole('vendor')) && (
              <Link 
                to="/claim" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Claim Your Profile
              </Link>
            )}
            
            {/* Vendor-specific links */}
            {hasRole('vendor') && (
              <>
                <Link 
                  to="/vendor/dashboard" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Vendor Portal
                </Link>
                <Link 
                  to="/vendor/verify" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Verification
                </Link>
              </>
            )}
            
            {/* Admin-specific links */}
            {hasRole('admin') && (
              <Link 
                to="/admin/dashboard" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>
            
            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{user?.name || 'Profile'}</span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={signOut}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <Link to="/auth/signin">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                to="/vendors" 
                className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Find Vendors
              </Link>
              
              {isAuthenticated && (
                <Link 
                  to="/dashboard" 
                  className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              
              {(!isAuthenticated || !hasRole('vendor')) && (
                <Link 
                  to="/claim" 
                  className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Claim Your Profile
                </Link>
              )}
              
              {hasRole('vendor') && (
                <>
                  <Link 
                    to="/vendor/dashboard" 
                    className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Vendor Portal
                  </Link>
                  <Link 
                    to="/vendor/verify" 
                    className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Verification
                  </Link>
                </>
              )}
              
              {hasRole('admin') && (
                <Link 
                  to="/admin/dashboard" 
                  className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4 space-x-3">
                  {isAuthenticated ? (
                    <Button 
                      size="sm" 
                      className="w-full" 
                      onClick={() => {
                        signOut()
                        setIsMobileMenuOpen(false)
                      }}
                      variant="outline"
                    >
                      Sign Out
                    </Button>
                  ) : (
                    <Link to="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full">Sign In</Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
