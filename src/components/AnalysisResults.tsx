import { ToneScale } from './analysis/ToneScale'
import { DetailedAnalysis } from './analysis/DetailedAnalysis'
import { WritingTips } from './analysis/WritingTips'
import { BrandWords } from './analysis/BrandWords'
import { FullTextModal } from './analysis/FullTextModal'
import { ExportButton } from './analysis/ExportButton'
import { AnalysisData } from '@/types/analysis'
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface AnalysisResultsProps {
  data: AnalysisData
}

export function AnalysisResults({ data }: AnalysisResultsProps) {
  if (data.error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-red-700">Analysis Failed</h3>
        </div>
        <p className="text-red-600 mb-4">{data.error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  const isFallback = data.analysisMode === 'fallback'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-balance">
              {data.label}
            </h2>
            <p className="text-gray-600 text-sm break-all">{data.url}</p>
          </div>
          <div className="flex items-center gap-3">
            <ExportButton data={data} />
            {isFallback && (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-amber-700 text-sm font-medium">Fallback Analysis</span>
              </div>
            )}
            {!isFallback && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-700 text-sm font-medium">AI Analysis</span>
              </div>
            )}
          </div>
        </div>

        {isFallback && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <strong>Fallback analysis used.</strong> AI analysis failed, results have lower confidence.
            This uses heuristic scoring based on sentiment, readability, and emphasis patterns.
          </div>
        )}
      </div>

      {/* Tone Scale */}
      {data.toneDimensions && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Tone Profile</h3>
            <p className="text-sm text-gray-600">Click dimensions for detailed explanations</p>
          </div>
          <ToneScale dimensions={data.toneDimensions} detailedAnalysis={data.detailedAnalysis} />
        </div>
      )}

      {/* Detailed Analysis */}
      {data.detailedAnalysis && (
        <DetailedAnalysis analysis={data.detailedAnalysis} />
      )}

      {/* Writing Tips */}
      {data.writingTips && (
        <WritingTips tips={data.writingTips} />
      )}

      {/* Brand Words */}
      {data.brandWords && (
        <BrandWords words={data.brandWords} />
      )}

      {/* Full Text Modal */}
      {data.fullText && (
        <FullTextModal
          fullText={data.fullText}
          url={data.url}
          label={data.label}
        />
      )}
    </div>
  )
}