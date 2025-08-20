import { AnalysisData } from '@/types/analysis'
import { ExternalLink } from 'lucide-react'

interface ComparisonOverviewProps {
  results: AnalysisData[]
}

export function ComparisonOverview({ results }: ComparisonOverviewProps) {
  const getDominantTrait = (dimensions: any[]) => {
    if (!dimensions || dimensions.length === 0) return 'N/A'
    
    // Find dimension with highest deviation from 50 (most extreme)
    const mostExtreme = dimensions.reduce((max, dim) => {
      const deviation = Math.abs(dim.score - 50)
      const maxDeviation = Math.abs(max.score - 50)
      return deviation > maxDeviation ? dim : max
    })
    
    return mostExtreme.dominantTerm
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {results.map((result, index) => {
        const dominantTrait = getDominantTrait(result.toneDimensions || [])
        const avgScore = result.toneDimensions 
          ? Math.round(result.toneDimensions.reduce((sum, dim) => sum + dim.score, 0) / result.toneDimensions.length)
          : 0

        return (
          <div
            key={`${result.url}-${index}`}
            className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-white"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate text-base">
                  {result.label}
                </h3>
                <p className="text-sm text-gray-600 truncate mt-1">
                  {new URL(result.url).hostname}
                </p>
              </div>
              
              <button
                onClick={() => window.open(result.url, '_blank', 'noopener,noreferrer')}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors ml-2"
                title="Open source"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            {/* Key Metrics */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Dominant Trait:</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                  {dominantTrait}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Score:</span>
                <span className="text-sm font-medium text-gray-900">
                  {avgScore}/100
                </span>
              </div>
              
              {result.analysisMode === 'fallback' && (
                <div className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                  Fallback analysis
                </div>
              )}
            </div>

            {/* Mini Progress Bars */}
            <div className="mt-4 space-y-2">
              {result.toneDimensions?.map((dimension) => (
                <div key={dimension.dimension} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-20 truncate">
                    {dimension.dimension}
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${dimension.score}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">
                    {dimension.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}