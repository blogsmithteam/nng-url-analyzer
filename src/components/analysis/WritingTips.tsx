import { useState } from 'react'
import { Copy, Check, Lightbulb } from 'lucide-react'
import { WritingTip } from '@/types/analysis'

interface WritingTipsProps {
  tips: WritingTip[]
}

export function WritingTips({ tips }: WritingTipsProps) {
  const [copiedTips, setCopiedTips] = useState<Set<string>>(new Set())

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedTips(prev => new Set(prev).add(id))
      setTimeout(() => {
        setCopiedTips(prev => {
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
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-5 h-5 text-amber-600" />
        <h3 className="text-lg font-semibold text-gray-900">Writing Tips</h3>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {tips.map((tip, index) => {
          const tipId = `tip-${index}`
          const isCopied = copiedTips.has(tipId)
          
          return (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h4 className="font-medium text-gray-900 text-sm leading-relaxed flex-1">
                  {tip.tip}
                </h4>
                <button
                  onClick={() => copyToClipboard(tip.tip, tipId)}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy tip"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              {tip.example && (
                <div className="p-2 bg-blue-50 rounded border-l-2 border-blue-200">
                  <p className="text-xs text-blue-700 font-medium mb-1">Example:</p>
                  <blockquote className="text-sm text-blue-800 italic">
                    "{tip.example}"
                  </blockquote>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}