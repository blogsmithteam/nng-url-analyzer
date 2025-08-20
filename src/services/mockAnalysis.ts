import { AnalysisData } from '@/types/analysis'

// Mock analysis service for demo purposes
export async function mockAnalyzeUrl(url: string, label?: string): Promise<AnalysisData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))

  // Generate realistic mock data based on URL
  const hostname = new URL(url).hostname
  const isEcommerce = hostname.includes('shop') || hostname.includes('store') || hostname.includes('buy')
  const isTech = hostname.includes('tech') || hostname.includes('dev') || hostname.includes('ai')
  const isNews = hostname.includes('news') || hostname.includes('blog') || hostname.includes('post')

  // Base scores with some variation
  let formalityScore = 50 + (Math.random() - 0.5) * 40
  let seriousnessScore = 50 + (Math.random() - 0.5) * 40
  let enthusiasmScore = 50 + (Math.random() - 0.5) * 40
  let respectfulnessScore = 70 + (Math.random() - 0.5) * 20

  // Adjust based on domain type
  if (isEcommerce) {
    enthusiasmScore += 20
    formalityScore -= 10
  }
  if (isTech) {
    formalityScore += 15
    seriousnessScore += 10
  }
  if (isNews) {
    seriousnessScore += 15
    respectfulnessScore += 10
  }

  // Clamp scores to 0-100
  formalityScore = Math.max(0, Math.min(100, formalityScore))
  seriousnessScore = Math.max(0, Math.min(100, seriousnessScore))
  enthusiasmScore = Math.max(0, Math.min(100, enthusiasmScore))
  respectfulnessScore = Math.max(0, Math.min(100, respectfulnessScore))

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
    url,
    label: label || hostname,
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
        dimension: 'Brand Voice Analysis',
        explanation: `The website demonstrates a ${getDominantTerm(formalityScore, 'Formality').toLowerCase()} approach to communication, with ${getDominantTerm(enthusiasmScore, 'Enthusiasm').toLowerCase()} energy levels. The content maintains a ${getDominantTerm(respectfulnessScore, 'Respectfulness').toLowerCase()} tone throughout.`,
        examples: [
          'Welcome to our platform - we\'re excited to help you succeed',
          'Our team is dedicated to providing exceptional service',
          'Join thousands of satisfied customers who trust our solutions'
        ]
      },
      {
        dimension: 'Content Strategy',
        explanation: `The messaging strategy focuses on ${isEcommerce ? 'conversion and customer engagement' : isTech ? 'technical expertise and innovation' : 'information delivery and credibility'}. The tone supports the brand's positioning in the market.`,
        examples: [
          'Discover the difference our approach makes',
          'Built with industry-leading technology and expertise',
          'Your success is our priority - let us show you how'
        ]
      }
    ],
    writingTips: [
      {
        tip: `Maintain the ${getDominantTerm(formalityScore, 'Formality').toLowerCase()} tone across all communications`,
        example: 'Keep your messaging consistent with the established voice'
      },
      {
        tip: `Leverage the ${getDominantTerm(enthusiasmScore, 'Enthusiasm').toLowerCase()} energy to engage your audience`,
        example: 'Use dynamic language that matches your brand personality'
      },
      {
        tip: 'Focus on clear, benefit-driven messaging',
        example: 'Highlight how your solution solves specific customer problems'
      },
      {
        tip: 'Use social proof to build credibility',
        example: 'Include testimonials and case studies that resonate with your tone'
      }
    ],
    brandWords: [
      {
        word: 'Professional',
        description: 'Conveys expertise and reliability',
        examples: ['industry-leading', 'expert guidance', 'proven solutions']
      },
      {
        word: 'Innovative',
        description: 'Emphasizes forward-thinking approach',
        examples: ['cutting-edge technology', 'next-generation features', 'breakthrough solutions']
      },
      {
        word: 'Trustworthy',
        description: 'Builds confidence and credibility',
        examples: ['secure platform', 'reliable service', 'trusted by thousands']
      },
      {
        word: 'Customer-focused',
        description: 'Shows dedication to user success',
        examples: ['your success matters', 'dedicated support', 'tailored solutions']
      }
    ],
    fullText: `Sample content from ${hostname}:\n\nWelcome to our platform where innovation meets reliability. We're committed to delivering exceptional results that exceed your expectations.\n\nOur team of experts has developed cutting-edge solutions that help businesses like yours achieve their goals. With industry-leading technology and personalized support, we make success accessible to everyone.\n\nJoin thousands of satisfied customers who have transformed their operations with our proven approach. Experience the difference that dedicated service and innovative thinking can make for your business.\n\nReady to get started? Contact our team today and discover how we can help you reach new heights of success.`,
    analysisMode: 'ai' as const,
    tokenUsage: 1250,
    sampleSize: 850
  }
}