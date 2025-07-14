import { Trial } from '@/types/database'

export interface TrialConfidenceFactors {
  hasEmailSource: boolean
  hasFinancialSource: boolean
  hasManualSource: boolean
  hasCancelUrl: boolean
  hasSubscriptionAmount: boolean
  hasKnownService: boolean
  hasRecentDate: boolean
  emailConfidence?: number
  financialConfidence?: number
}

export interface ConfidenceScore {
  overall: number
  factors: TrialConfidenceFactors
  reasoning: string[]
  recommendation: 'high' | 'medium' | 'low'
}

// Known reliable services that typically have accurate trial information
const RELIABLE_SERVICES = [
  'netflix', 'spotify', 'amazon', 'apple', 'disney', 'hulu', 
  'youtube', 'adobe', 'microsoft', 'google', 'dropbox'
]

export function calculateTrialConfidence(trial: Trial): ConfidenceScore {
  const factors: TrialConfidenceFactors = {
    hasEmailSource: trial.source === 'email',
    hasFinancialSource: trial.source === 'financial',
    hasManualSource: trial.source === 'manual',
    hasCancelUrl: !!trial.cancel_url,
    hasSubscriptionAmount: !!trial.subscription_amount,
    hasKnownService: RELIABLE_SERVICES.some(service => 
      trial.service_name.toLowerCase().includes(service)
    ),
    hasRecentDate: isRecentDate(trial.trial_end),
    emailConfidence: trial.source === 'email' ? trial.confidence : undefined,
    financialConfidence: trial.source === 'financial' ? trial.confidence : undefined,
  }

  let score = 0
  const reasoning: string[] = []

  // Base confidence from original detection
  if (trial.confidence) {
    score = trial.confidence
    reasoning.push(`Base detection confidence: ${(trial.confidence * 100).toFixed(0)}%`)
  }

  // Source-based scoring
  if (factors.hasEmailSource && factors.hasFinancialSource) {
    score = 1.0
    reasoning.push('Perfect match: Both email and financial confirmation found')
  } else if (factors.hasEmailSource) {
    score = Math.max(score, 0.8)
    reasoning.push('Strong: Email confirmation detected')
  } else if (factors.hasFinancialSource) {
    score = Math.max(score, 0.6)
    reasoning.push('Moderate: Financial transaction detected')
  } else if (factors.hasManualSource) {
    score = Math.max(score, 0.9)
    reasoning.push('High: Manually verified by user')
  }

  // Boost for additional reliable indicators
  if (factors.hasCancelUrl) {
    score = Math.min(score + 0.1, 1.0)
    reasoning.push('Cancel URL available (+10%)')
  }

  if (factors.hasSubscriptionAmount) {
    score = Math.min(score + 0.05, 1.0)
    reasoning.push('Subscription amount identified (+5%)')
  }

  if (factors.hasKnownService) {
    score = Math.min(score + 0.1, 1.0)
    reasoning.push('Known reliable service (+10%)')
  }

  // Date validation
  if (!factors.hasRecentDate) {
    score = Math.max(score - 0.2, 0.1)
    reasoning.push('Trial date seems outdated (-20%)')
  }

  // Ensure minimum confidence
  score = Math.max(score, 0.1)
  score = Math.min(score, 1.0)

  // Determine recommendation
  let recommendation: 'high' | 'medium' | 'low'
  if (score >= 0.8) {
    recommendation = 'high'
  } else if (score >= 0.5) {
    recommendation = 'medium'
  } else {
    recommendation = 'low'
  }

  return {
    overall: score,
    factors,
    reasoning,
    recommendation,
  }
}

export function combineTrialSources(
  emailTrial?: Trial,
  financialTrial?: Trial
): TrialConfidenceFactors & { combinedConfidence: number } {
  const factors: TrialConfidenceFactors = {
    hasEmailSource: !!emailTrial,
    hasFinancialSource: !!financialTrial,
    hasManualSource: false,
    hasCancelUrl: !!(emailTrial?.cancel_url || financialTrial?.cancel_url),
    hasSubscriptionAmount: !!(emailTrial?.subscription_amount || financialTrial?.subscription_amount),
    hasKnownService: RELIABLE_SERVICES.some(service => {
      const emailMatch = emailTrial?.service_name.toLowerCase().includes(service)
      const financialMatch = financialTrial?.service_name.toLowerCase().includes(service)
      return emailMatch || financialMatch
    }),
    hasRecentDate: isRecentDate(emailTrial?.trial_end || financialTrial?.trial_end || ''),
    emailConfidence: emailTrial?.confidence,
    financialConfidence: financialTrial?.confidence,
  }

  let combinedConfidence = 0

  if (factors.hasEmailSource && factors.hasFinancialSource) {
    // Perfect match
    combinedConfidence = 1.0
  } else if (factors.hasEmailSource) {
    combinedConfidence = factors.emailConfidence || 0.8
  } else if (factors.hasFinancialSource) {
    combinedConfidence = factors.financialConfidence || 0.6
  }

  // Apply modifiers
  if (factors.hasCancelUrl) combinedConfidence = Math.min(combinedConfidence + 0.1, 1.0)
  if (factors.hasSubscriptionAmount) combinedConfidence = Math.min(combinedConfidence + 0.05, 1.0)
  if (factors.hasKnownService) combinedConfidence = Math.min(combinedConfidence + 0.1, 1.0)
  if (!factors.hasRecentDate) combinedConfidence = Math.max(combinedConfidence - 0.2, 0.1)

  return {
    ...factors,
    combinedConfidence: Math.max(Math.min(combinedConfidence, 1.0), 0.1),
  }
}

function isRecentDate(dateString: string): boolean {
  if (!dateString) return false
  
  const date = new Date(dateString)
  const now = new Date()
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  
  const oneYearFromNow = new Date()
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
  
  // Date should be between 6 months ago and 1 year from now
  return date >= sixMonthsAgo && date <= oneYearFromNow
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return 'text-green-600'
  if (confidence >= 0.5) return 'text-yellow-600'
  return 'text-red-600'
}

export function getConfidenceBadge(confidence: number): {
  text: string
  color: string
  bgColor: string
} {
  if (confidence >= 0.8) {
    return {
      text: 'High Confidence',
      color: 'text-green-800',
      bgColor: 'bg-green-100',
    }
  }
  if (confidence >= 0.5) {
    return {
      text: 'Medium Confidence',
      color: 'text-yellow-800',
      bgColor: 'bg-yellow-100',
    }
  }
  return {
    text: 'Low Confidence',
    color: 'text-red-800',
    bgColor: 'bg-red-100',
  }
}

export function shouldShowTrialToUser(trial: Trial): boolean {
  const confidence = calculateTrialConfidence(trial)
  
  // Show high and medium confidence trials
  // For low confidence, only show if they have cancel URLs or are manual entries
  return confidence.overall >= 0.5 || 
         trial.cancel_url !== null || 
         trial.source === 'manual'
} 