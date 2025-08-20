export interface ToneDimension {
  dimension: string
  score: number
  dominantTerm: string
}

export interface DetailedAnalysisItem {
  dimension: string
  explanation: string
  examples?: string[]
}

export interface WritingTip {
  tip: string
  example?: string
}

export interface BrandWord {
  word: string
  description: string
  examples?: string[]
}

export interface AnalysisData {
  url: string
  label?: string
  toneDimensions?: ToneDimension[]
  detailedAnalysis?: DetailedAnalysisItem[]
  writingTips?: WritingTip[]
  brandWords?: BrandWord[]
  fullText?: string
  analysisMode?: 'ai' | 'fallback' | 'error'
  error?: string
  tokenUsage?: number
  sampleSize?: number
}

export interface AnalysisRequest {
  url: string
  label?: string
  apiKeyType: 'product' | 'user'
  userKey?: string
}

export interface AnalysisResponse extends AnalysisData {
  correlationId: string
}