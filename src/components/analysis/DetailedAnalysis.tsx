import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { DetailedAnalysisItem } from '@/types/analysis'

interface DetailedAnalysisProps {
  analysis: DetailedAnalysisItem[]
}

export function DetailedAnalysis({ analysis }: DetailedAnalysisProps) {
  const [copiedQuotes, setCopiedQuotes] = useState<Set<string>>(new Set())

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedQuotes(prev => new Set(prev).add(id))
      setTimeout(() => {
        setCopiedQuotes(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
      }, 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Analysis</h3>
      
      <div className="space-y-6">
        {analysis.map((item, index) => (
          <div key={`${item.dimension}-${index}`} className="space-y-3">
            <h4 className="font-semibold text-gray-800 text-base">
              {item.dimension}
            </h4>
            
            <p className="text-gray-700 leading-relaxed">
              {item.explanation}
            </p>
            
            {item.examples && item.examples.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Supporting Evidence:</p>
                {item.examples.map((example, exampleIndex) => {
                  const quoteId = `${item.dimension}-${index}-${exampleIndex}`
                  const isCopied = copiedQuotes.has(quoteId)
                  
                  return (
                    <div
                      key={exampleIndex}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border-l-2 border-blue-200"
                    >
                      <blockquote className="flex-1 text-sm text-gray-700 italic">
                        "{example}"
                      </blockquote>
                      <button
                        onClick={() => copyToClipboard(example, quoteId)}
                        className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy quote"
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}