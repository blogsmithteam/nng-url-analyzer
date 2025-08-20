import OpenAI from 'openai'
import { AnalysisData, AnalysisRequest } from '@/types/analysis'

// Multiple CORS proxies for better reliability
const CORS_PROXIES = [
  'https://api.allorigins.win/get?url=',
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/',
  'https://thingproxy.freeboard.io/fetch/'
]

export class AnalysisService {
  private openai: OpenAI | null = null
  private apiKey: string | null = null

  setApiKey(key: string, keyType: 'product' | 'user') {
    this.apiKey = key
    this.openai = new OpenAI({
      apiKey: key,
      dangerouslyAllowBrowser: true
    })
  }

  async analyzeUrl(request: AnalysisRequest): Promise<AnalysisData> {
    if (!this.openai || !this.apiKey) {
      throw new Error('OpenAI client not initialized')
    }

    try {
      // Fetch and clean content
      const content = await this.fetchAndCleanContent(request.url)
      
      // Analyze with OpenAI
      const analysis = await this.performAIAnalysis(content, request.url)
      
      return {
        url: request.url,
        label: request.label || new URL(request.url).hostname,
        ...analysis,
        analysisMode: 'ai'
      }
    } catch (error) {
      console.error('Analysis error:', error)
      
      // Fallback to heuristic analysis
      try {
        const content = await this.fetchAndCleanContent(request.url)
        const fallbackAnalysis = this.performFallbackAnalysis(content)
        
        return {
          url: request.url,
          label: request.label || new URL(request.url).hostname,
          ...fallbackAnalysis,
          analysisMode: 'fallback'
        }
      } catch (fallbackError) {
        return {
          url: request.url,
          label: request.label || new URL(request.url).hostname,
          error: error instanceof Error ? error.message : 'Analysis failed',
          analysisMode: 'error'
        }
      }
    }
  }

  private async fetchAndCleanContent(url: string): Promise<string> {
    let lastError: Error | null = null
    
    // Try each CORS proxy in sequence
    for (let i = 0; i < CORS_PROXIES.length; i++) {
      try {
        const proxy = CORS_PROXIES[i]
        let proxyUrl: string
        let response: Response
        
        // Different proxies have different URL formats
        if (proxy.includes('allorigins.win')) {
          proxyUrl = `${proxy}${encodeURIComponent(url)}`
          response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            }
          })
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }
          
          const data = await response.json()
          if (!data.contents) {
            throw new Error('No content returned')
          }
          
          const cleanedContent = this.cleanHtmlContent(data.contents)
          if (cleanedContent.length < 100) {
            throw new Error('Insufficient content found')
          }
          
          return cleanedContent
        } else {
          // For other proxies, try direct fetch
          proxyUrl = `${proxy}${url}`
          response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'User-Agent': 'Mozilla/5.0 (compatible; ToneAnalyzer/1.0)'
            }
          })
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }
          
          const html = await response.text()
          const cleanedContent = this.cleanHtmlContent(html)
          
          if (cleanedContent.length < 100) {
            throw new Error('Insufficient content found')
          }
          
          return cleanedContent
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        console.warn(`CORS proxy ${i + 1} failed:`, lastError.message)
        
        // If this isn't the last proxy, continue to the next one
        if (i < CORS_PROXIES.length - 1) {
          continue
        }
      }
    }
    
    // If all proxies failed, throw the last error
    throw new Error(`Failed to fetch content from ${url} using all available proxies. Last error: ${lastError?.message || 'Unknown error'}`)
  }

  private cleanHtmlContent(html: string): string {
    // Create a temporary DOM element to parse HTML
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    
    // Remove script and style elements
    const scripts = doc.querySelectorAll('script, style, noscript')
    scripts.forEach(el => el.remove())
    
    // Get text content
    const textContent = doc.body?.textContent || doc.textContent || ''
    
    // Clean up whitespace and normalize
    return textContent
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim()
      .substring(0, 8000) // Limit content length
  }

  private async performAIAnalysis(content: string, url: string) {
    const prompt = `Analyze the tone of voice for this website content using Nielsen Norman Group's methodology. 

Content from ${url}:
${content}

Provide analysis in this exact JSON format:
{
  "toneDimensions": [
    {"dimension": "Formality", "score": 0-100, "dominantTerm": "Very Casual|Casual|Neutral|Formal|Very Formal"},
    {"dimension": "Seriousness", "score": 0-100, "dominantTerm": "Very Funny|Funny|Neutral|Serious|Very Serious"},
    {"dimension": "Enthusiasm", "score": 0-100, "dominantTerm": "Very Subdued|Subdued|Neutral|Lively|Very Lively"},
    {"dimension": "Respectfulness", "score": 0-100, "dominantTerm": "Irreverent|Casual|Neutral|Respectful|Very Respectful"}
  ],
  "detailedAnalysis": [
    {"dimension": "Formality Analysis", "explanation": "detailed explanation of formality score", "examples": ["quote1", "quote2"]},
    {"dimension": "Seriousness Analysis", "explanation": "detailed explanation of seriousness score", "examples": ["quote1", "quote2"]},
    {"dimension": "Enthusiasm Analysis", "explanation": "detailed explanation of enthusiasm score", "examples": ["quote1", "quote2"]},
    {"dimension": "Respectfulness Analysis", "explanation": "detailed explanation of respectfulness score", "examples": ["quote1", "quote2"]}
  ],
  "writingTips": [
    {"tip": "actionable tip", "example": "example usage"},
    {"tip": "another tip", "example": "example usage"}
  ],
  "brandWords": [
    {"word": "keyword", "description": "why it matters", "examples": ["usage1", "usage2"]},
    {"word": "another word", "description": "explanation", "examples": ["usage1", "usage2"]}
  ]
}

Focus on actual quotes from the content for examples. Be specific and actionable.`

    const response = await this.openai!.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert brand tone analyst. Analyze website content using Nielsen Norman methodology and return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    })

    const analysisText = response.choices[0]?.message?.content
    if (!analysisText) {
      throw new Error('No analysis returned from OpenAI')
    }

    try {
      const analysis = JSON.parse(analysisText)
      return {
        ...analysis,
        fullText: content,
        tokenUsage: response.usage?.total_tokens || 0,
        sampleSize: content.length
      }
    } catch (parseError) {
      throw new Error('Failed to parse AI analysis response')
    }
  }

  private performFallbackAnalysis(content: string) {
    // Heuristic analysis based on content patterns
    const words = content.toLowerCase().split(/\s+/)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    
    // Calculate basic metrics
    const avgWordsPerSentence = words.length / sentences.length
    const exclamationCount = (content.match(/!/g) || []).length
    const questionCount = (content.match(/\?/g) || []).length
    const capsCount = (content.match(/[A-Z]/g) || []).length
    
    // Heuristic scoring
    const formalityScore = Math.min(100, Math.max(0, 
      50 + (avgWordsPerSentence - 15) * 2 - exclamationCount * 5
    ))
    
    const enthusiasmScore = Math.min(100, Math.max(0,
      30 + exclamationCount * 10 + (content.includes('amazing') ? 10 : 0) + (content.includes('excited') ? 10 : 0)
    ))
    
    const seriousnessScore = Math.min(100, Math.max(0,
      50 + (avgWordsPerSentence - 12) * 3 - exclamationCount * 3
    ))
    
    const respectfulnessScore = Math.min(100, Math.max(0,
      70 + (content.includes('please') ? 5 : 0) + (content.includes('thank') ? 5 : 0) - (capsCount / words.length > 0.1 ? 20 : 0)
    ))

    const getDominantTerm = (score: number, dimension: string) => {
      const position = Math.round((score / 100) * 4)
      const labels = {
        'Formality': ['Very Casual', 'Casual', 'Neutral', 'Formal', 'Very Formal'],
        'Seriousness': ['Very Funny', 'Funny', 'Neutral', 'Serious', 'Very Serious'],
        'Enthusiasm': ['Very Subdued', 'Subdued', 'Neutral', 'Lively', 'Very Lively'],
        'Respectfulness': ['Irreverent', 'Casual', 'Neutral', 'Respectful', 'Very Respectful']
      }
      return labels[dimension as keyof typeof labels]?.[position] || 'Neutral'
    }

    return {
      toneDimensions: [
        {
          dimension: 'Formality',
          score: Math.round(formalityScore),
          dominantTerm: getDominantTerm(formalityScore, 'Formality')
        },
        {
          dimension: 'Seriousness', 
          score: Math.round(seriousnessScore),
          dominantTerm: getDominantTerm(seriousnessScore, 'Seriousness')
        },
        {
          dimension: 'Enthusiasm',
          score: Math.round(enthusiasmScore),
          dominantTerm: getDominantTerm(enthusiasmScore, 'Enthusiasm')
        },
        {
          dimension: 'Respectfulness',
          score: Math.round(respectfulnessScore),
          dominantTerm: getDominantTerm(respectfulnessScore, 'Respectfulness')
        }
      ],
      detailedAnalysis: [
        {
          dimension: 'Content Analysis',
          explanation: `Based on heuristic analysis of ${words.length} words across ${sentences.length} sentences. Average sentence length suggests ${avgWordsPerSentence > 15 ? 'formal' : 'casual'} communication style.`,
          examples: sentences.slice(0, 2).map(s => s.trim()).filter(s => s.length > 0)
        }
      ],
      writingTips: [
        {
          tip: 'Maintain consistent tone across all content',
          example: 'Use similar sentence structures and vocabulary choices'
        },
        {
          tip: 'Consider your audience when adjusting formality',
          example: 'Professional services may benefit from more formal language'
        }
      ],
      brandWords: [
        {
          word: 'Consistent',
          description: 'Maintains steady tone throughout',
          examples: ['reliable messaging', 'predictable voice']
        }
      ],
      fullText: content.substring(0, 2000),
      sampleSize: content.length
    }
  }
}

export const analysisService = new AnalysisService()