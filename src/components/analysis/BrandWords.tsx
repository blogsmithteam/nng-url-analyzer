import { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import { BrandWord } from '@/types/analysis'

interface BrandWordsProps {
  words: BrandWord[]
}

export function BrandWords({ words }: BrandWordsProps) {
  const [expandedWords, setExpandedWords] = useState<Set<string>>(new Set())
  const [allExpanded, setAllExpanded] = useState(false)
  const [copiedExamples, setCopiedExamples] = useState<Set<string>>(new Set())

  const toggleWord = (word: string) => {
    setExpandedWords(prev => {
      const newSet = new Set(prev)
      if (newSet.has(word)) {
        newSet.delete(word)
      } else {
        newSet.add(word)
      }
      return newSet
    })
  }

  const toggleAllWords = () => {
    if (allExpanded) {
      setExpandedWords(new Set())
    } else {
      setExpandedWords(new Set(words.map(w => w.word)))
    }
    setAllExpanded(!allExpanded)
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedExamples(prev => new Set(prev).add(id))
      setTimeout(() => {
        setCopiedExamples(prev => {
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
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Brand Words</h3>
        <button
          onClick={toggleAllWords}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {allExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Collapse All
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Expand All
            </>
          )}
        </button>
      </div>
      
      <div className="space-y-3">
        {words.map((brandWord, index) => {
          const isExpanded = expandedWords.has(brandWord.word)
          
          return (
            <div
              key={`${brandWord.word}-${index}`}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Header - always visible */}
              <button
                onClick={() => toggleWord(brandWord.word)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="brand-word-pill">
                    {brandWord.word}
                  </span>
                  <span className="text-sm text-gray-600 font-medium">
                    {brandWord.description}
                  </span>
                </div>
                
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {/* Expanded content */}
              {isExpanded && brandWord.examples && brandWord.examples.length > 0 && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 mb-2">Examples:</p>
                    {brandWord.examples.map((example, exampleIndex) => {
                      const exampleId = `${brandWord.word}-${index}-${exampleIndex}`
                      const isCopied = copiedExamples.has(exampleId)
                      
                      return (
                        <div
                          key={exampleIndex}
                          className="flex items-start gap-3 p-2 bg-gray-50 rounded border-l-2 border-green-200"
                        >
                          <blockquote className="flex-1 text-sm text-gray-700 italic">
                            "{example}"
                          </blockquote>
                          <button
                            onClick={() => copyToClipboard(example, exampleId)}
                            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Copy example"
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
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}