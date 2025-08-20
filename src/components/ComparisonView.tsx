import { useState } from 'react'
import { AnalysisData } from '@/types/analysis'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs'
import { ComparisonOverview } from './comparison/ComparisonOverview'
import { ComparisonDimensions } from './comparison/ComparisonDimensions'
import { ComparisonChart } from './comparison/ComparisonChart'
import { ExportButton } from './analysis/ExportButton'
import { BarChart3, Grid3X3, PieChart } from 'lucide-react'

interface ComparisonViewProps {
  results: AnalysisData[]
}

export function ComparisonView({ results }: ComparisonViewProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // Filter out errored results for comparison
  const validResults = results.filter(result => !result.error && result.toneDimensions)

  if (validResults.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Comparison Results</h2>
        <p className="text-gray-600">No valid analysis results to compare.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Tone Comparison ({validResults.length} URLs)
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Compare tone profiles across multiple websites
            </p>
          </div>
          <ExportButton data={validResults} isComparison />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="dimensions" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dimensions
            </TabsTrigger>
            <TabsTrigger value="chart" className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Chart
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="overview" className="mt-0">
              <ComparisonOverview results={validResults} />
            </TabsContent>

            <TabsContent value="dimensions" className="mt-0">
              <ComparisonDimensions results={validResults} />
            </TabsContent>

            <TabsContent value="chart" className="mt-0">
              <ComparisonChart results={validResults} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}