import { useState } from 'react'
import { Plus, X, Globe, Shield, Key, RotateCcw } from 'lucide-react'

interface UrlInputProps {
  onAnalyze: (urls: Array<{url: string, label?: string}>) => Promise<void>
  isAnalyzing: boolean
  onClear: () => void
  apiKeyType: 'product' | 'user'
  onResetKeys: () => void
}

interface UrlEntry {
  id: string
  url: string
  label: string
  isValid: boolean
}

export function UrlInput({ onAnalyze, isAnalyzing, onClear, apiKeyType, onResetKeys }: UrlInputProps) {
  const [urlEntries, setUrlEntries] = useState<UrlEntry[]>([
    { id: '1', url: '', label: '', isValid: true }
  ])

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return url.startsWith('http://') || url.startsWith('https://')
    } catch {
      return false
    }
  }

  const updateUrlEntry = (id: string, field: 'url' | 'label', value: string) => {
    setUrlEntries(entries =>
      entries.map(entry =>
        entry.id === id
          ? {
              ...entry,
              [field]: value,
              isValid: field === 'url' ? (value === '' || validateUrl(value)) : entry.isValid
            }
          : entry
      )
    )
  }

  const addUrlEntry = () => {
    if (urlEntries.length < 5) {
      setUrlEntries(entries => [
        ...entries,
        { id: Date.now().toString(), url: '', label: '', isValid: true }
      ])
    }
  }

  const removeUrlEntry = (id: string) => {
    if (urlEntries.length > 1) {
      setUrlEntries(entries => entries.filter(entry => entry.id !== id))
    }
  }

  const handleAnalyze = () => {
    const validEntries = urlEntries
      .filter(entry => entry.url.trim() && validateUrl(entry.url))
      .map(entry => ({
        url: entry.url.trim(),
        label: entry.label.trim() || new URL(entry.url).hostname
      }))

    if (validEntries.length > 0) {
      onAnalyze(validEntries)
    }
  }

  const canAnalyze = urlEntries.some(entry => entry.url.trim() && entry.isValid) && !isAnalyzing

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header with API Key Status */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            URL Analysis
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full text-sm">
            {apiKeyType === 'product' ? (
              <>
                <Shield className="w-3 h-3 text-green-600" />
                <span className="text-green-700 font-medium">Product Key Active</span>
              </>
            ) : (
              <>
                <Key className="w-3 h-3 text-blue-600" />
                <span className="text-blue-700 font-medium">User Key Active</span>
              </>
            )}
          </div>
          
          <button
            onClick={onResetKeys}
            className="text-gray-500 hover:text-gray-700 p-1 rounded"
            title="Change API key"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* URL Entries */}
      <div className="space-y-3 mb-6">
        {urlEntries.map((entry, index) => (
          <div key={entry.id} className="flex gap-3 items-center">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={entry.url}
                  onChange={(e) => updateUrlEntry(entry.id, 'url', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus-ring text-sm ${
                    entry.isValid ? 'border-gray-300' : 'border-red-300 bg-red-50'
                  }`}
                />
                {!entry.isValid && (
                  <p className="text-red-600 text-xs mt-1">Please enter a valid URL</p>
                )}
              </div>
              
              <input
                type="text"
                placeholder={`Label ${index + 1} (optional)`}
                value={entry.label}
                onChange={(e) => updateUrlEntry(entry.id, 'label', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-ring text-sm"
              />
            </div>
            
            {urlEntries.length > 1 && (
              <button
                onClick={() => removeUrlEntry(entry.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Remove URL"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add URL Button */}
      {urlEntries.length < 5 && (
        <div className="mb-6">
          <button
            onClick={addUrlEntry}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Another URL (up to 5)
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="text-sm text-gray-600">
          {urlEntries.length > 1 ? 'Multi-URL comparison mode' : 'Single URL analysis'}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClear}
            className="btn-secondary"
            disabled={isAnalyzing}
          >
            Clear
          </button>
          
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className="btn-primary"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Tone'}
          </button>
        </div>
      </div>

      {/* Cost estimate */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
        <p className="font-medium mb-1">Estimated cost: ${(urlEntries.filter(e => e.url.trim()).length * 0.15).toFixed(2)}</p>
        <p className="text-blue-600">Analysis typically completes in 10-30 seconds per URL</p>
      </div>
    </div>
  )
}