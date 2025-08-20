import { useState } from 'react'
import { Download, Check } from 'lucide-react'
import { AnalysisData } from '@/types/analysis'

interface ExportButtonProps {
  data: AnalysisData | AnalysisData[]
  isComparison?: boolean
}

export function ExportButton({ data, isComparison = false }: ExportButtonProps) {
  const [exported, setExported] = useState(false)

  const exportToCsv = () => {
    const results = Array.isArray(data) ? data : [data]
    const validResults = results.filter(result => !result.error && result.toneDimensions)

    if (validResults.length === 0) return

    // CSV headers
    const headers = [
      'URL',
      'Label',
      'Formality',
      'Seriousness', 
      'Enthusiasm',
      'Respectfulness',
      'Dominant_Traits',
      'Analysis_Mode',
      'Timestamp'
    ]

    // CSV rows
    const rows = validResults.map(result => {
      const dimensions = result.toneDimensions || []
      const dimensionMap = dimensions.reduce((acc, dim) => {
        acc[dim.dimension] = dim.score
        return acc
      }, {} as Record<string, number>)

      const dominantTraits = dimensions.map(dim => dim.dominantTerm).join('; ')

      return [
        result.url,
        result.label || new URL(result.url).hostname,
        dimensionMap['Formality'] || '',
        dimensionMap['Seriousness'] || '',
        dimensionMap['Enthusiasm'] || '',
        dimensionMap['Respectfulness'] || '',
        dominantTraits,
        result.analysisMode || 'ai',
        new Date().toISOString()
      ]
    })

    // Create CSV content
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', 
      `tone-analysis-${isComparison ? 'comparison' : 'single'}-${new Date().toISOString().slice(0, 10)}.csv`
    )
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Show success state
    setExported(true)
    setTimeout(() => setExported(false), 2000)
  }

  return (
    <button
      onClick={exportToCsv}
      className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
      title="Export dimension scores to CSV"
    >
      {exported ? (
        <>
          <Check className="w-4 h-4" />
          Exported
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Export CSV
        </>
      )}
    </button>
  )
}