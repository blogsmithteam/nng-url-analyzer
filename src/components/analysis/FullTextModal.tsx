import { useState } from 'react'
import { Eye, X, Copy, ExternalLink, Check } from 'lucide-react'

interface FullTextModalProps {
  fullText: string
  url: string
  label: string
}

export function FullTextModal({ fullText, url, label }: FullTextModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showFormatted, setShowFormatted] = useState(true)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const openSource = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (!isOpen) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 w-full text-left hover:bg-gray-50 transition-colors p-3 rounded-lg border border-gray-200"
        >
          <Eye className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-medium text-gray-900">View Full Text</h3>
            <p className="text-sm text-gray-600 mt-1">
              See the complete sanitized content used for analysis
            </p>
          </div>
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div className="fixed inset-4 md:inset-8 bg-white rounded-lg shadow-xl z-50 flex flex-col max-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              Full Text: {label}
            </h2>
            <p className="text-sm text-gray-600 truncate mt-1">{url}</p>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setShowFormatted(true)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  showFormatted
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Formatted
              </button>
              <button
                onClick={() => setShowFormatted(false)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  !showFormatted
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Plain
              </button>
            </div>
            
            {/* Actions */}
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Copy full text"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
            
            <button
              onClick={openSource}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Open source URL"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {showFormatted ? (
            <div 
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {fullText}
            </div>
          ) : (
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
              {fullText}
            </pre>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
          <p>
            This content has been sanitized and normalized for analysis.
            Scripts, iframes, and styling have been removed.
          </p>
        </div>
      </div>
    </>
  )
}