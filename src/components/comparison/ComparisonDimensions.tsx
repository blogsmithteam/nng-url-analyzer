import { AnalysisData } from '@/types/analysis'

interface ComparisonDimensionsProps {
  results: AnalysisData[]
}

const COLORS = [
  'bg-blue-600',
  'bg-green-600', 
  'bg-purple-600',
  'bg-orange-600',
  'bg-red-600'
]

export function ComparisonDimensions({ results }: ComparisonDimensionsProps) {
  // Get all unique dimensions
  const allDimensions = [...new Set(
    results.flatMap(result => 
      result.toneDimensions?.map(dim => dim.dimension) || []
    )
  )]

  return (
    <div className="space-y-8">
      {allDimensions.map((dimensionName) => (
        <div key={dimensionName} className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {dimensionName} Comparison
          </h3>
          
          <div className="space-y-4">
            {results.map((result, index) => {
              const dimension = result.toneDimensions?.find(
                dim => dim.dimension === dimensionName
              )
              
              if (!dimension) return null
              
              const colorClass = COLORS[index % COLORS.length]
              
              return (
                <div key={`${result.url}-${dimensionName}`} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 ${colorClass} rounded-full`} />
                      <span className="font-medium text-gray-900">
                        {result.label}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        {dimension.dominantTerm}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {dimension.score}/100
                    </span>
                  </div>
                  
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colorClass} transition-all duration-500`}
                      style={{ width: `${dimension.score}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}