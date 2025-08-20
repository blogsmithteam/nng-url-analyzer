import { Activity, Zap } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 text-balance">
                URL Brand Tone Analyzer
              </h1>
              <p className="text-sm text-gray-600">
                Nielsen Norman methodology with AI insights
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">v1.0</span>
          </div>
        </div>
      </div>
    </header>
  )
}