import { useEffect, useRef } from 'react'
import { AnalysisData } from '@/types/analysis'

interface ComparisonChartProps {
  results: AnalysisData[]
}

const COLORS = [
  'rgb(59, 130, 246)',   // blue
  'rgb(16, 185, 129)',   // green
  'rgb(147, 51, 234)',   // purple
  'rgb(245, 158, 11)',   // orange
  'rgb(239, 68, 68)'     // red
]

export function ComparisonChart({ results }: ComparisonChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const size = Math.min(400, window.innerWidth - 100)
    canvas.width = size
    canvas.height = size
    
    const centerX = size / 2
    const centerY = size / 2
    const radius = Math.min(size / 2 - 60, 150)

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Get all dimensions (assume 4 dimensions: Formality, Seriousness, Enthusiasm, Respectfulness)
    const dimensions = ['Formality', 'Seriousness', 'Enthusiasm', 'Respectfulness']
    const angleStep = (2 * Math.PI) / dimensions.length

    // Draw grid circles
    ctx.strokeStyle = '#E5E7EB'
    ctx.lineWidth = 1
    for (let i = 1; i <= 5; i++) {
      const gridRadius = (radius * i) / 5
      ctx.beginPath()
      ctx.arc(centerX, centerY, gridRadius, 0, 2 * Math.PI)
      ctx.stroke()
    }

    // Draw axis lines and labels
    ctx.strokeStyle = '#9CA3AF'
    ctx.fillStyle = '#374151'
    ctx.font = '12px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    dimensions.forEach((dimension, index) => {
      const angle = index * angleStep - Math.PI / 2 // Start from top
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      
      // Draw axis line
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()
      
      // Draw label
      const labelX = centerX + (radius + 20) * Math.cos(angle)
      const labelY = centerY + (radius + 20) * Math.sin(angle)
      ctx.fillText(dimension, labelX, labelY)
    })

    // Draw scale labels
    ctx.fillStyle = '#6B7280'
    ctx.font = '10px system-ui'
    for (let i = 1; i <= 5; i++) {
      const gridRadius = (radius * i) / 5
      const value = i * 20
      ctx.fillText(value.toString(), centerX + gridRadius + 5, centerY - 5)
    }

    // Draw data for each result
    results.forEach((result, resultIndex) => {
      if (!result.toneDimensions) return
      
      const color = COLORS[resultIndex % COLORS.length]
      const points: { x: number; y: number }[] = []
      
      // Calculate points for this result
      dimensions.forEach((dimensionName, index) => {
        const dimension = result.toneDimensions?.find(d => d.dimension === dimensionName)
        const score = dimension ? dimension.score : 50 // Default to middle if not found
        const normalizedScore = score / 100 // Convert to 0-1
        
        const angle = index * angleStep - Math.PI / 2
        const distance = radius * normalizedScore
        const x = centerX + distance * Math.cos(angle)
        const y = centerY + distance * Math.sin(angle)
        
        points.push({ x, y })
      })
      
      // Draw filled polygon
      if (points.length > 0) {
        ctx.fillStyle = color.replace('rgb', 'rgba').replace(')', ', 0.1)')
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        
        // Draw data points
        ctx.fillStyle = color
        points.forEach(point => {
          ctx.beginPath()
          ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI)
          ctx.fill()
        })
      }
    })
  }, [results])

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Tone Profile Radar Chart</h3>
      
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        {/* Chart */}
        <div className="flex-shrink-0">
          <canvas
            ref={canvasRef}
            className="border border-gray-200 rounded-lg"
          />
        </div>
        
        {/* Legend */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Legend</h4>
          {results.map((result, index) => (
            <div key={`${result.url}-legend`} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm text-gray-700 truncate max-w-48">
                {result.label}
              </span>
            </div>
          ))}
          
          <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p className="font-medium mb-1">How to read this chart:</p>
            <ul className="space-y-1 text-xs">
              <li>• Each colored area represents one website's tone profile</li>
              <li>• Larger areas indicate stronger presence across dimensions</li>
              <li>• Compare shapes to see tone positioning differences</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}