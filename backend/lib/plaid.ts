import { 
  Configuration, 
  PlaidApi, 
  PlaidEnvironments,
  LinkTokenCreateRequest,
  ItemPublicTokenExchangeRequest,
  TransactionsGetRequest,
  Transaction,
  CountryCode,
  Products,
} from 'plaid'
import { createServerSupabaseClient } from './supabase'
import { InsertTrial } from '@/types/database'

// Plaid configuration
const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV as keyof typeof PlaidEnvironments || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
})

export const plaidClient = new PlaidApi(configuration)

// Known trial-related merchants and patterns
const TRIAL_MERCHANTS = {
  netflix: ['NETFLIX', 'NETFLIX.COM'],
  spotify: ['SPOTIFY', 'SPOTIFY USA'],
  amazon: ['AMAZON PRIME', 'AMZN', 'AMAZON'],
  apple: ['APPLE.COM/BILL', 'APPLE SERVICES', 'ITUNES'],
  disney: ['DISNEY PLUS', 'DISNEYPLUS'],
  hulu: ['HULU', 'HULU.COM'],
  youtube: ['GOOGLE YOUTUBE', 'YOUTUBE PREMIUM'],
  adobe: ['ADOBE', 'ADOBE SYSTEMS'],
  microsoft: ['MICROSOFT', 'MSFT', 'OFFICE 365'],
  google: ['GOOGLE', 'GSUITE', 'GOOGLE WORKSPACE'],
  dropbox: ['DROPBOX'],
  notion: ['NOTION'],
  slack: ['SLACK'],
  zoom: ['ZOOM'],
  canva: ['CANVA'],
  figma: ['FIGMA'],
}

const TRIAL_AMOUNT_PATTERNS = [
  0.00, // Free trial with $0 charge
  1.00, // $1 trial
  0.99, // 99 cent trial
  2.99, // Common trial amounts
  4.99,
  9.99,
]

export interface PlaidTrialTransaction {
  serviceName: string
  merchantName: string
  amount: number
  date: Date
  transactionId: string
  accountId: string
  confidence: number
  estimatedTrialStart: Date
  estimatedTrialEnd?: Date
  rawTransaction: Partial<Transaction>
}

export async function createLinkToken(userId: string): Promise<string> {
  const request: LinkTokenCreateRequest = {
    user: {
      client_user_id: userId,
    },
    client_name: 'SentinelApp',
    products: [Products.Transactions],
    country_codes: [CountryCode.Us],
    language: 'en',
    webhook: `${process.env.NEXT_PUBLIC_APP_URL}/api/plaid/webhook`,
  }

  const response = await plaidClient.linkTokenCreate(request)
  return response.data.link_token
}

export async function exchangePublicToken(publicToken: string): Promise<string> {
  const request: ItemPublicTokenExchangeRequest = {
    public_token: publicToken,
  }

  const response = await plaidClient.itemPublicTokenExchange(request)
  return response.data.access_token
}

export async function getAccountInfo(accessToken: string) {
  const accountsResponse = await plaidClient.accountsGet({
    access_token: accessToken,
  })

  const itemResponse = await plaidClient.itemGet({
    access_token: accessToken,
  })

  return {
    accounts: accountsResponse.data.accounts,
    item: itemResponse.data.item,
  }
}

function identifyServiceFromMerchant(merchantName: string): string | null {
  const normalizedMerchant = merchantName.toUpperCase()
  
  for (const [service, patterns] of Object.entries(TRIAL_MERCHANTS)) {
    for (const pattern of patterns) {
      if (normalizedMerchant.includes(pattern)) {
        return service.charAt(0).toUpperCase() + service.slice(1)
      }
    }
  }
  
  return null
}

function isLikelyTrialTransaction(transaction: Transaction): boolean {
  const amount = Math.abs(transaction.amount)
  
  // Check for trial amount patterns
  const isTrialAmount = TRIAL_AMOUNT_PATTERNS.some(pattern => 
    Math.abs(amount - pattern) < 0.01
  )
  
  // Check for known trial merchants
  const isTrialMerchant = identifyServiceFromMerchant(
    transaction.merchant_name || transaction.account_owner || ''
  ) !== null
  
  // Check transaction categories for subscriptions
  const hasSubscriptionCategory = transaction.category?.some(cat => 
    cat.toLowerCase().includes('subscription') || 
    cat.toLowerCase().includes('entertainment') ||
    cat.toLowerCase().includes('software')
  )
  
  return isTrialAmount || isTrialMerchant || (hasSubscriptionCategory && amount < 15)
}

function estimateTrialPeriod(transaction: Transaction, serviceName: string): { start: Date, end?: Date } {
  const transactionDate = new Date(transaction.date)
  
  // Most trials start on the transaction date
  const start = transactionDate
  
  // Estimate trial length based on service
  const trialLengths: Record<string, number> = {
    netflix: 30,
    spotify: 30,
    amazon: 30,
    apple: 7,
    disney: 7,
    hulu: 30,
    youtube: 30,
    adobe: 7,
    microsoft: 30,
    google: 14,
    dropbox: 30,
    notion: 30,
    slack: 30,
    zoom: 30,
    canva: 30,
    figma: 30,
  }
  
  const days = trialLengths[serviceName.toLowerCase()] || 14 // Default 14 days
  const end = new Date(transactionDate)
  end.setDate(end.getDate() + days)
  
  return { start, end }
}

export async function fetchTransactions(
  userId: string, 
  daysPast: number = 90
): Promise<PlaidTrialTransaction[]> {
  const supabase = createServerSupabaseClient()
  
  // Get user's Plaid account
  const { data: account } = await supabase
    .from('connected_accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('provider', 'plaid')
    .eq('is_active', true)
    .single()

  if (!account) {
    throw new Error('No active Plaid account found')
  }

  const accessToken = account.access_token!
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - daysPast)
  const endDate = new Date()

  const request: TransactionsGetRequest = {
    access_token: accessToken,
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate.toISOString().split('T')[0],
    count: 500,
  }

  const response = await plaidClient.transactionsGet(request)
  const transactions = response.data.transactions

  const trialTransactions: PlaidTrialTransaction[] = []

  for (const transaction of transactions) {
    if (isLikelyTrialTransaction(transaction)) {
      const serviceName = identifyServiceFromMerchant(
        transaction.merchant_name || transaction.account_owner || 'Unknown Service'
      )
      
      if (serviceName) {
        const { start, end } = estimateTrialPeriod(transaction, serviceName)
        let confidence = 0.6
        
        // Increase confidence for known merchants
        if (transaction.merchant_name && identifyServiceFromMerchant(transaction.merchant_name)) {
          confidence += 0.2
        }
        
        // Increase confidence for trial amounts
        const amount = Math.abs(transaction.amount)
        if (TRIAL_AMOUNT_PATTERNS.some(pattern => Math.abs(amount - pattern) < 0.01)) {
          confidence += 0.2
        }

        trialTransactions.push({
          serviceName,
          merchantName: transaction.merchant_name || transaction.account_owner || 'Unknown',
          amount: Math.abs(transaction.amount),
          date: new Date(transaction.date),
          transactionId: transaction.transaction_id,
          accountId: transaction.account_id,
          confidence: Math.min(confidence, 1.0),
          estimatedTrialStart: start,
          estimatedTrialEnd: end,
          rawTransaction: {
            transaction_id: transaction.transaction_id,
            account_id: transaction.account_id,
            amount: transaction.amount,
            date: transaction.date,
            merchant_name: transaction.merchant_name,
            category: transaction.category,
          }
        })
      }
    }
  }

  return trialTransactions
}

export async function saveTrialsFromTransactions(
  userId: string, 
  transactions: PlaidTrialTransaction[]
): Promise<string[]> {
  const supabase = createServerSupabaseClient()
  const trialIds: string[] = []

  for (const transaction of transactions) {
    try {
      const trialData: InsertTrial = {
        user_id: userId,
        source: 'financial',
        service_name: transaction.serviceName,
        trial_start: transaction.estimatedTrialStart.toISOString().split('T')[0],
        trial_end: transaction.estimatedTrialEnd?.toISOString().split('T')[0] || 
          new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 14 days
        subscription_amount: transaction.amount,
        confidence: transaction.confidence,
        raw_data: {
          merchant_name: transaction.merchantName,
          transaction_id: transaction.transactionId,
          account_id: transaction.accountId,
          transaction_date: transaction.date.toISOString(),
          raw_transaction: transaction.rawTransaction,
        },
      }

      // Check if trial already exists to avoid duplicates
      const { data: existingTrial } = await supabase
        .from('trials')
        .select('id')
        .eq('user_id', userId)
        .eq('service_name', transaction.serviceName)
        .eq('source', 'financial')
        .eq('trial_start', trialData.trial_start)
        .single()

      if (existingTrial) {
        console.log(`Trial already exists for ${transaction.serviceName}`)
        continue
      }

      const { data, error } = await supabase
        .from('trials')
        .insert(trialData)
        .select()
        .single()

      if (error) {
        console.error('Error saving trial from transaction:', error)
        continue
      }

      trialIds.push(data.id)
    } catch (error) {
      console.error('Error processing trial transaction:', error)
    }
  }

  return trialIds
} 