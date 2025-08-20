import { useState, useEffect } from 'react'
import { UrlInput } from './UrlInput'
import { AnalysisResults } from './AnalysisResults'
import { ComparisonView } from './ComparisonView'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs'
import { AnalysisData } from '@/types/analysis'
import { analysisService } from '@/services/analysisService'

interface AnalyzerInterfaceProps {
  apiKeyType: 'product' | 'user'
  onResetKeys: () => void
}

export function AnalyzerInterface({ apiKeyType, onResetKeys }: AnalyzerInterfaceProps) {
  const [mode, setMode] = useState<'single' | 'compare'>('single')
  const [analysisResults, setAnalysisResults] = useState<AnalysisData[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Set up the analysis service with API key
  useEffect(() => {
    if (apiKeyType === 'user') {
      const userKey = localStorage.getItem('openai_key')
      if (userKey) {
        analysisService.setApiKey(userKey, 'user')
      }
    } else {
      // For product key, you'd need to set this up with your actual product key
      // For now, we'll use fallback analysis
      analysisService.setApiKey('', 'product')
    }
  }, [apiKeyType])
  const handleAnalysis = async (urls: Array<{url: string, label?: string}>) => {
    setIsAnalyzing(true)
    const results: AnalysisData[] = []

    try {
      // Process URLs concurrently (up to 5 as per spec)
      const promises = urls.slice(0, 5).map(async ({url, label}) => {
        try {
          const result = await analysisService.analyzeUrl({
            url,
            label,
            apiKeyType,
            userKey: apiKeyType === 'user' ? localStorage.getItem('openai_key') || undefined : undefined
          })
          return result
        } catch (error) {
          return {
            url,
            label: label || new URL(url).hostname,
            error: error instanceof Error ? error.message : 'Analysis failed',
            analysisMode: 'error'
          }
        }
      })

      const completed = await Promise.all(promises)
      setAnalysisResults(completed)
      
      if (urls.length > 1) {
        setMode('compare')
      }
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const clearResults = () => {
    setAnalysisResults([])
    setMode('single')
  }

  return (
    <div className="space-y-8">
      {/* Nielsen Norman Reference */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          This tool uses{' '}
          <a
            href="https://www.nngroup.com/articles/tone-of-voice-dimensions/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline hover:text-blue-900 transition-colors"
          >
            Nielsen Norman Group's Tone of Voice Dimensions
          </a>
          {' '}methodology for comprehensive brand tone analysis.
        </p>
      </div>

      {/* URL Input */}
      <UrlInput
        onAnalyze={handleAnalysis}
        isAnalyzing={isAnalyzing}
        onClear={clearResults}
        apiKeyType={apiKeyType}
        onResetKeys={onResetKeys}
      />

      {/* Results */}
      {analysisResults.length > 0 && (
        <div>
          {analysisResults.length === 1 ? (
            <AnalysisResults data={analysisResults[0]} />
          ) : (
            <ComparisonView results={analysisResults} />
          )}
        </div>
      )}
    </div>
  )
}