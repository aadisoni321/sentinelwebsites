import cron from 'node-cron'
import { checkTrialsForReminders } from './notifications'

// Run notification checks every 6 hours
export function startNotificationCron() {
  console.log('Starting notification cron job...')
  
  // Check for trial reminders every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    console.log('Running trial reminder check:', new Date().toISOString())
    
    try {
      const result = await checkTrialsForReminders()
      console.log('Trial reminder check completed:', result)
    } catch (error) {
      console.error('Error in trial reminder check:', error)
    }
  }, {
    scheduled: true,
    timezone: 'UTC'
  })

  // Health check every hour
  cron.schedule('0 * * * *', () => {
    console.log('Notification cron job is healthy:', new Date().toISOString())
  }, {
    scheduled: true,
    timezone: 'UTC'
  })
}

// Manual trigger for testing
export async function runNotificationCheck() {
  console.log('Running manual notification check...')
  return await checkTrialsForReminders()
} 