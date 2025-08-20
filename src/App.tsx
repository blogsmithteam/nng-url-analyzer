import { useState } from 'react'
import { AnalyzerInterface } from '@/components/AnalyzerInterface'
import { KeyOnboarding } from '@/components/KeyOnboarding'
import { Header } from '@/components/Header'

export default function App() {
  const [hasApiKey, setHasApiKey] = useState(() => {
    // Check if user has a saved API key
    const savedKey = localStorage.getItem('openai_key')
    const savedKeyType = localStorage.getItem('api_key_type')
    return !!(savedKey && savedKeyType)
  })
  const [apiKeyType, setApiKeyType] = useState<'product' | 'user'>(() => {
    const savedKeyType = localStorage.getItem('api_key_type')
    return (savedKeyType as 'product' | 'user') || 'product'
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {!hasApiKey ? (
          <KeyOnboarding
            onKeySetup={(keyType) => {
              localStorage.setItem('api_key_type', keyType)
              setApiKeyType(keyType)
              setHasApiKey(true)
            }}
          />
        ) : (
          <AnalyzerInterface
            apiKeyType={apiKeyType}
            onResetKeys={() => {
              localStorage.removeItem('openai_key')
              localStorage.removeItem('api_key_type')
              setHasApiKey(false)
            }}
          />
        )}
      </main>
    </div>
  )
}