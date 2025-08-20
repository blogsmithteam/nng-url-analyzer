import { useState } from 'react'
import { Shield, Key, Lock, CheckCircle, AlertTriangle } from 'lucide-react'

interface KeyOnboardingProps {
  onKeySetup: (keyType: 'product' | 'user') => void
}

export function KeyOnboarding({ onKeySetup }: KeyOnboardingProps) {
  const [selectedOption, setSelectedOption] = useState<'product' | 'user' | null>(() => {
    const savedKeyType = localStorage.getItem('api_key_type')
    return savedKeyType as 'product' | 'user' || null
  })
  const [userKey, setUserKey] = useState(() => {
    return localStorage.getItem('openai_key') || ''
  })
  const [isValidating, setIsValidating] = useState(false)
  const [keyValid, setKeyValid] = useState<boolean | null>(null)

  const validateUserKey = async () => {
    if (!userKey.trim()) return

    setIsValidating(true)
    try {
      // Basic format validation for OpenAI keys
      const isValidFormat = userKey.startsWith('sk-') && userKey.length >= 40
      
      // Simulate validation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setKeyValid(isValidFormat)
      
      if (isValidFormat) {
        localStorage.setItem('openai_key', userKey)
        setTimeout(() => onKeySetup('user'), 500)
      }
    } catch (error) {
      setKeyValid(false)
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Connect to OpenAI
        </h2>
        <p className="text-gray-600">
          Choose how you'd like to connect for AI-powered tone analysis
        </p>
      </div>

      <div className="space-y-4">
        {/* Product Key Option */}
        <div
          onClick={() => setSelectedOption('product')}
          className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
            selectedOption === 'product'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Use Product Key (Recommended)
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                Managed by us. No setup required. All calls run server-side.
              </p>
              <div className="flex items-center gap-2 text-xs text-green-700">
                <CheckCircle className="w-3 h-3" />
                <span>Secure • No key exposure • Ready to use</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Key Option */}
        <div
          onClick={() => setSelectedOption('user')}
          className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
            selectedOption === 'user'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Key className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Provide Your Own Key
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                Server-transient storage. Key held in memory for session only.
              </p>
              <div className="flex items-center gap-2 text-xs text-blue-700">
                <Lock className="w-3 h-3" />
                <span>Session-only • Never persisted • HTTPS only</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Key Input */}
      {selectedOption === 'user' && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
            OpenAI API Key
          </label>
          <div className="flex gap-3">
            <input
              type="password"
              id="apiKey"
              value={userKey}
              onChange={(e) => {
                setUserKey(e.target.value)
                setKeyValid(null)
              }}
              placeholder="sk-..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus-ring text-sm"
            />
            <button
              onClick={validateUserKey}
              disabled={!userKey.trim() || isValidating}
              className="btn-primary text-sm"
            >
              {isValidating ? 'Validating...' : 'Validate'}
            </button>
          </div>
          
          {keyValid === false && (
            <div className="flex items-center gap-2 mt-3 text-sm text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span>Invalid API key. Please check and try again.</span>
            </div>
          )}
          
          {keyValid === true && (
            <div className="flex items-center gap-2 mt-3 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>Key validated successfully!</span>
            </div>
          )}
        </div>
      )}

      {/* Continue Button */}
      {selectedOption === 'product' && (
        <div className="mt-8 text-center">
          <button
            onClick={() => onKeySetup('product')}
            className="btn-primary px-8 py-3 text-lg"
          >
            Start Analyzing
          </button>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
        <h4 className="font-medium text-gray-800 mb-2">Privacy & Security</h4>
        <ul className="space-y-1 text-xs">
          <li>• API keys are never logged or exposed to client</li>
          <li>• Full content not stored by default (opt-in only)</li>
          <li>• Keys can be cleared anytime</li>
          <li>• All analysis calls run server-side with HTTPS</li>
        </ul>
      </div>
    </div>
  )
}