#!/bin/bash

echo "🚀 SentinelApp Environment Setup"
echo "================================"
echo ""

# Generate a random JWT secret
JWT_SECRET=$(openssl rand -base64 32)

echo "📝 Creating minimal .env.local configuration..."
echo ""

# Create a minimal .env.local file
cat > .env.local << EOF
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (REQUIRED - Get these from https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google APIs (Optional for testing - needed for Gmail and Calendar)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Email Services (Optional for testing - needed for notifications)
RESEND_API_KEY=your_resend_api_key
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token

# SMS Services (Optional for testing - needed for SMS notifications)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Push Notifications (Optional for testing - needed for push notifications)
ONESIGNAL_APP_ID=your_onesignal_app_id
ONESIGNAL_API_KEY=your_onesignal_api_key

# Financial Services (Optional for testing - needed for Plaid integration)
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox

# AI Services (Optional)
OPENAI_API_KEY=your_openai_api_key

# Encryption (Generated automatically)
JWT_SECRET=${JWT_SECRET}
EOF

echo "✅ .env.local file created with minimal configuration!"
echo ""
echo "🔑 Generated JWT_SECRET: ${JWT_SECRET}"
echo ""
echo "📋 Next Steps:"
echo "1. Get Supabase credentials from https://supabase.com"
echo "2. Update the Supabase variables in .env.local"
echo "3. Run: npm run dev"
echo "4. Visit: http://localhost:3000/test"
echo ""
echo "💡 For full functionality, you'll also need:"
echo "   - Google OAuth credentials (for Gmail/Calendar)"
echo "   - Plaid credentials (for transaction detection)"
echo "   - Resend API key (for email notifications)"
echo "   - Twilio credentials (for SMS notifications)"
echo "" 