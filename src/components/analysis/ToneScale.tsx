import { ToneDimension } from '@/types/analysis'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'

interface ToneScaleProps {
  dimensions: ToneDimension[]
  detailedAnalysis?: Array<{
    dimension: string
    explanation: string
    examples?: string[]
  }>
}

const DIMENSION_LABELS = {
  'Formality': ['Very Casual', 'Casual', 'Neutral', 'Formal', 'Very Formal'],
  'Seriousness': ['Very Funny', 'Funny', 'Neutral', 'Serious', 'Very Serious'],
  'Enthusiasm': ['Very Subdued', 'Subdued', 'Neutral', 'Lively', 'Very Lively'],
  'Respectfulness': ['Irreverent', 'Casual', 'Neutral', 'Respectful', 'Very Respectful']
} as const

export function ToneScale({ dimensions, detailedAnalysis }: ToneScaleProps) {
  const [expandedDimensions, setExpandedDimensions] = useState<Set<string>>(new Set())
  const [copiedExamples, setCopiedExamples] = useState<Set<string>>(new Set())

  const toggleDimension = (dimension: string) => {
    setExpandedDimensions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(dimension)) {
        newSet.delete(dimension)
      } else {
        newSet.add(dimension)
      }
      return newSet
    })
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

  const getScoreExplanation = (score: number, dimension: string) => {
    const explanations = {
      'Formality': {
        low: 'Uses casual language, contractions, and conversational tone',
        medium: 'Balances professional and approachable language',
        high: 'Uses formal language, complete sentences, and professional terminology'
      },
      'Seriousness': {
        low: 'Incorporates humor, playful language, and light-hearted tone',
        medium: 'Maintains a balanced, professional but approachable tone',
        high: 'Uses serious, authoritative language focused on facts and expertise'
      },
      'Enthusiasm': {
        low: 'Calm, measured tone with minimal emotional language',
        medium: 'Moderately engaging with some energetic elements',
        high: 'High energy with exclamation points, dynamic language, and excitement'
      },
      'Respectfulness': {
        low: 'Direct, potentially challenging or provocative language',
        medium: 'Polite and considerate communication',
        high: 'Highly courteous, deferential, and considerate language'
      }
    }

    const dimExplanations = explanations[dimension as keyof typeof explanations]
    if (!dimExplanations) return 'Score reflects the intensity of this dimension in the content'

    if (score < 35) return dimExplanations.low
    if (score > 65) return dimExplanations.high
    return dimExplanations.medium
  }

  return (
    <div className="space-y-8">
      {dimensions.map((dimension) => {
        const labels = DIMENSION_LABELS[dimension.dimension as keyof typeof DIMENSION_LABELS] || 
          ['Very Low', 'Low', 'Neutral', 'High', 'Very High']
        
        // Convert 0-100 score to 0-4 position for 5-point scale
        const position = Math.round((dimension.score / 100) * 4)
        const percentage = (position / 4) * 100
        const isExpanded = expandedDimensions.has(dimension.dimension)
        const dimensionAnalysis = detailedAnalysis?.find(
          analysis => analysis.dimension.toLowerCase().includes(dimension.dimension.toLowerCase()) ||
                     dimension.dimension.toLowerCase().includes(analysis.dimension.toLowerCase())
        )

        return (
          <div key={dimension.dimension} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Header - always visible */}
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">
                  {dimension.dimension}
                </h4>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {dimension.dominantTerm}
                  </span>
                  <span className="text-sm text-gray-600">
                    {dimension.score}/100
                  </span>
                  <button
                    onClick={() => toggleDimension(dimension.dimension)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title={isExpanded ? 'Hide details' : 'Show details'}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>


              {/* Score Explanation */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Score {dimension.score}/100:</span>{' '}
                  {getScoreExplanation(dimension.score, dimension.dimension)}
                </p>
              </div>

              <div className="relative">
                {/* Scale Track */}
                <div className="tone-scale">
                  {/* Scale Markers */}
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className={`absolute top-0 w-px h-full bg-gray-300 ${
                        i === position ? 'bg-blue-600 w-0.5' : ''
                      }`}
                      style={{ left: `${(i / 4) * 100}%` }}
                    />
                  ))}
                  
                  {/* Active Marker */}
                  <div
                    className="tone-marker"
                    style={{ left: `calc(${percentage}% - 8px)` }}
                    tabIndex={0}
                    role="slider"
                    aria-label={`${dimension.dimension} score: ${dimension.score}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={dimension.score}
                  />
                </div>

                {/* Scale Labels */}
                <div className="flex justify-between mt-3">
                  {labels.map((label, index) => (
                    <span
                      key={index}
                      className={`text-xs text-center flex-1 ${
                        index === position
                          ? 'text-blue-700 font-semibold'
                          : 'text-gray-500'
                      }`}
                      style={{
                        maxWidth: '20%',
                        fontSize: '0.75rem',
                        lineHeight: '1rem'
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && dimensionAnalysis && (
              <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-800 mb-2">Analysis</h5>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {dimensionAnalysis.explanation}
                    </p>
                  </div>
                  
                  {dimensionAnalysis.examples && dimensionAnalysis.examples.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-800 mb-2">Examples from Text</h5>
                      <div className="space-y-2">
                        {dimensionAnalysis.examples.map((example, exampleIndex) => {
                          const exampleId = `${dimension.dimension}-${exampleIndex}`
                          const isCopied = copiedExamples.has(exampleId)
                          
                          return (
                            <div
                              key={exampleIndex}
                              className="flex items-start gap-3 p-2 bg-white rounded border-l-2 border-blue-200"
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
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}