import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { simpleParser, ParsedMail } from 'mailparser'
import { createServerSupabaseClient } from './supabase'
import { InsertTrial } from '@/types/database'

// Gmail OAuth2 configuration
const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

export function createGmailOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
}

export function getGmailAuthUrl() {
  const oauth2Client = createGmailOAuth2Client()
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: GMAIL_SCOPES,
    prompt: 'consent'
  })
}

export async function exchangeCodeForTokens(code: string) {
  const oauth2Client = createGmailOAuth2Client()
  const { tokens } = await oauth2Client.getTokens(code)
  return tokens
}

export async function refreshAccessToken(refreshToken: string) {
  const oauth2Client = createGmailOAuth2Client()
  oauth2Client.setCredentials({ refresh_token: refreshToken })
  const { credentials } = await oauth2Client.refreshAccessToken()
  return credentials
}

export async function getGmailClient(accessToken: string) {
  const oauth2Client = createGmailOAuth2Client()
  oauth2Client.setCredentials({ access_token: accessToken })
  return google.gmail({ version: 'v1', auth: oauth2Client })
}

// Email parsing patterns for trial detection
const TRIAL_PATTERNS = {
  subject: [
    /free trial/i,
    /trial period/i,
    /start.*trial/i,
    /trial.*started/i,
    /welcome.*trial/i,
    /confirm.*subscription/i,
    /subscription.*confirmation/i,
    /premium.*trial/i,
    /pro.*trial/i,
    /trial.*expires?/i,
    /trial.*ending/i,
  ],
  body: [
    /trial period/i,
    /free trial/i,
    /trial ends?/i,
    /trial expires?/i,
    /cancel.*before/i,
    /automatic.*billing/i,
    /subscription.*auto.*renew/i,
    /\$\d+.*after.*trial/i,
    /charged.*\$\d+.*on/i,
    /cancel.*anytime/i,
    /no.*charge.*trial/i,
  ]
}

const SERVICE_PATTERNS = {
  netflix: /netflix/i,
  spotify: /spotify/i,
  amazon: /amazon.*prime/i,
  apple: /apple.*music|icloud/i,
  disney: /disney\+?/i,
  hulu: /hulu/i,
  youtube: /youtube.*premium/i,
  adobe: /adobe.*creative/i,
  microsoft: /microsoft.*365|office.*365/i,
  google: /google.*workspace|g.*suite/i,
  dropbox: /dropbox/i,
  notion: /notion/i,
  slack: /slack/i,
  zoom: /zoom/i,
  canva: /canva/i,
  figma: /figma/i,
}

const DATE_PATTERNS = [
  /trial.*ends?.*(\d{1,2}\/\d{1,2}\/\d{2,4})/i,
  /expires?.*(\d{1,2}\/\d{1,2}\/\d{2,4})/i,
  /(\d{1,2}\/\d{1,2}\/\d{2,4}).*trial.*ends?/i,
  /cancel.*before.*(\d{1,2}\/\d{1,2}\/\d{2,4})/i,
  /billing.*starts?.*(\d{1,2}\/\d{1,2}\/\d{2,4})/i,
  /trial.*ends?.*(\w+\s+\d{1,2},?\s+\d{4})/i,
  /expires?.*(\w+\s+\d{1,2},?\s+\d{4})/i,
  /(\w+\s+\d{1,2},?\s+\d{4}).*trial.*ends?/i,
  /cancel.*before.*(\w+\s+\d{1,2},?\s+\d{4})/i,
  /billing.*starts?.*(\w+\s+\d{1,2},?\s+\d{4})/i,
]

const CANCEL_URL_PATTERNS = [
  /href="([^"]*cancel[^"]*subscription[^"]*)"/i,
  /href="([^"]*unsubscribe[^"]*)"/i,
  /href="([^"]*manage[^"]*subscription[^"]*)"/i,
  /href="([^"]*account[^"]*settings[^"]*)"/i,
  /href="([^"]*billing[^"]*)"/i,
]

const AMOUNT_PATTERNS = [
  /\$(\d+\.?\d*)\s*(?:per\s+month|\/month|monthly)/i,
  /(\d+\.?\d*)\s*USD\s*(?:per\s+month|\/month|monthly)/i,
  /\$(\d+\.?\d*)\s*after.*trial/i,
  /charged\s*\$(\d+\.?\d*)/i,
]

export interface ParsedTrialEmail {
  serviceName: string
  trialStart?: Date
  trialEnd?: Date
  cancelUrl?: string
  subscriptionAmount?: number
  confidence: number
  rawData: {
    subject: string
    from: string
    date: Date
    body: string
    messageId: string
  }
}

export function parseTrialEmail(email: ParsedMail): ParsedTrialEmail | null {
  const subject = email.subject || ''
  const from = email.from?.text || ''
  const body = email.text || email.html || ''
  const date = email.date || new Date()
  const messageId = email.messageId || ''

  // Check if email is likely a trial confirmation
  const isTrialEmail = 
    TRIAL_PATTERNS.subject.some(pattern => pattern.test(subject)) ||
    TRIAL_PATTERNS.body.some(pattern => pattern.test(body))

  if (!isTrialEmail) {
    return null
  }

  // Extract service name
  let serviceName = 'Unknown Service'
  let confidence = 0.6

  for (const [service, pattern] of Object.entries(SERVICE_PATTERNS)) {
    if (pattern.test(from) || pattern.test(subject) || pattern.test(body)) {
      serviceName = service.charAt(0).toUpperCase() + service.slice(1)
      confidence += 0.2
      break
    }
  }

  // Extract dates
  let trialEnd: Date | undefined
  for (const pattern of DATE_PATTERNS) {
    const match = body.match(pattern) || subject.match(pattern)
    if (match && match[1]) {
      const dateStr = match[1]
      const parsedDate = new Date(dateStr)
      if (!isNaN(parsedDate.getTime())) {
        trialEnd = parsedDate
        confidence += 0.1
        break
      }
    }
  }

  // Extract cancel URL
  let cancelUrl: string | undefined
  const htmlBody = email.html || ''
  for (const pattern of CANCEL_URL_PATTERNS) {
    const match = htmlBody.match(pattern)
    if (match && match[1]) {
      cancelUrl = match[1]
      confidence += 0.1
      break
    }
  }

  // Extract subscription amount
  let subscriptionAmount: number | undefined
  for (const pattern of AMOUNT_PATTERNS) {
    const match = body.match(pattern) || subject.match(pattern)
    if (match && match[1]) {
      const amount = parseFloat(match[1])
      if (!isNaN(amount)) {
        subscriptionAmount = amount
        confidence += 0.1
        break
      }
    }
  }

  return {
    serviceName,
    trialStart: date,
    trialEnd,
    cancelUrl,
    subscriptionAmount,
    confidence: Math.min(confidence, 1.0),
    rawData: {
      subject,
      from,
      date,
      body: body.substring(0, 2000), // Limit body size
      messageId,
    }
  }
}

export async function fetchRecentEmails(userId: string, limit: number = 20): Promise<ParsedTrialEmail[]> {
  const supabase = createServerSupabaseClient()
  
  // Get user's Gmail account
  const { data: account } = await supabase
    .from('connected_accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('provider', 'gmail')
    .eq('is_active', true)
    .single()

  if (!account) {
    throw new Error('No active Gmail account found')
  }

  // Refresh token if needed
  let accessToken = account.access_token
  if (account.expires_at && new Date(account.expires_at) <= new Date()) {
    const refreshedTokens = await refreshAccessToken(account.refresh_token!)
    accessToken = refreshedTokens.access_token!
    
    // Update stored tokens
    await supabase
      .from('connected_accounts')
      .update({
        access_token: refreshedTokens.access_token,
        expires_at: refreshedTokens.expiry_date ? new Date(refreshedTokens.expiry_date).toISOString() : null,
      })
      .eq('id', account.id)
  }

  // Fetch emails
  const gmail = await getGmailClient(accessToken!)
  
  // Search for emails in the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const query = `after:${Math.floor(thirtyDaysAgo.getTime() / 1000)}`
  
  const { data: messages } = await gmail.users.messages.list({
    userId: 'me',
    q: query,
    maxResults: limit,
  })

  if (!messages.messages) {
    return []
  }

  const parsedEmails: ParsedTrialEmail[] = []

  // Process emails in batches to avoid rate limits
  for (const message of messages.messages) {
    try {
      const { data: email } = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!,
        format: 'raw',
      })

      if (email.raw) {
        const buffer = Buffer.from(email.raw, 'base64')
        const parsed = await simpleParser(buffer)
        const trialEmail = parseTrialEmail(parsed)
        
        if (trialEmail) {
          parsedEmails.push(trialEmail)
        }
      }
    } catch (error) {
      console.error(`Error processing email ${message.id}:`, error)
    }
  }

  return parsedEmails
}

export async function saveTrialsFromEmails(userId: string, emails: ParsedTrialEmail[]): Promise<string[]> {
  const supabase = createServerSupabaseClient()
  const trialIds: string[] = []

  for (const email of emails) {
    try {
      const trialData: InsertTrial = {
        user_id: userId,
        source: 'email',
        service_name: email.serviceName,
        trial_start: email.trialStart?.toISOString().split('T')[0],
        trial_end: email.trialEnd?.toISOString().split('T')[0] || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 7 days from now
        cancel_url: email.cancelUrl,
        subscription_amount: email.subscriptionAmount,
        confidence: email.confidence,
        raw_data: email.rawData,
      }

      const { data, error } = await supabase
        .from('trials')
        .insert(trialData)
        .select()
        .single()

      if (error) {
        console.error('Error saving trial:', error)
        continue
      }

      trialIds.push(data.id)
    } catch (error) {
      console.error('Error processing trial email:', error)
    }
  }

  return trialIds
} 