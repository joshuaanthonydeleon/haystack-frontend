import { useNavigate } from '@tanstack/react-router'
import { Home, Search, ArrowLeft, MapPin } from 'lucide-react'
import { Button } from './ui/button'

export function NotFound() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate({ to: '/' })
  }

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Cute animated 404 illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Main 404 number with floating animation */}
            <div className="text-8xl font-bold text-gray-200 animate-pulse select-none">
              4🔍4
            </div>
            {/* Floating search icon */}
            <div className="absolute top-4 right-8 animate-bounce">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <Search className="w-6 h-6 text-yellow-800" />
              </div>
            </div>
            {/* Floating map pin */}
            <div className="absolute bottom-2 left-4 animate-bounce delay-300">
              <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="w-4 h-4 text-red-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Main message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Oops! Page Not Found
        </h1>
        
        <div className="mb-8">
          <p className="text-xl text-gray-600 mb-4">
            🕵️ We've searched everywhere, but this page seems to have vanished!
          </p>
          <p className="text-gray-500 mb-4">
            The page you're looking for might have been moved, deleted, or perhaps it never existed in the first place.
          </p>
          <p className="text-sm text-gray-400">
            Don't worry though, even the best explorers get lost sometimes! 🗺️
          </p>
        </div>

        {/* Helpful suggestions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">What can you do?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Check the URL for any typos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Go back to the previous page</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              <span>Start fresh from our homepage</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleGoHome}
            className="w-full flex items-center justify-center gap-2"
            size="lg"
          >
            <Home className="w-4 h-4" />
            Take Me Home
          </Button>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate({ to: '/vendors' })}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Find Vendors
            </Button>
          </div>
        </div>

        {/* Cute footer message */}
        <div className="mt-8 text-xs text-gray-400">
          <p>🚀 Error 404 • Haystack FI</p>
          <p className="mt-1">Lost but not forgotten ✨</p>
        </div>
      </div>
    </div>
  )
}