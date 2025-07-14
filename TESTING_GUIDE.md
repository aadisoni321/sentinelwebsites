# 🧪 SentinelApp Testing Guide

This guide provides comprehensive instructions for pressure-testing the SentinelApp end-to-end flow to ensure all components work correctly in production.

## 🚀 Quick Start Testing

### 1. Access the Testing Dashboard

Navigate to `/test` in your browser to access the comprehensive testing dashboard.

### 2. Run Full End-to-End Test

Click "🚀 Run Full End-to-End Test" to execute all system tests automatically.

## 📋 Manual Testing Checklist

### Phase 1: Connection Testing

#### Gmail Connection
- [ ] **OAuth Flow**: Test Gmail OAuth initiation and callback
- [ ] **Token Validation**: Verify access token is valid and not expired
- [ ] **Email Fetching**: Test fetching last 20 emails from Gmail
- [ ] **Error Handling**: Test with invalid/expired tokens

**Test Commands:**
```bash
# Test Gmail connection specifically
curl -X POST http://localhost:3000/api/test/end-to-end \
  -H "Content-Type: application/json" \
  -d '{"testSpecificStep": "gmail"}'
```

#### Plaid Connection
- [ ] **Link Token Creation**: Test Plaid link token generation
- [ ] **OAuth Flow**: Test Plaid OAuth initiation and token exchange
- [ ] **Transaction Fetching**: Test fetching transactions from Plaid
- [ ] **Sandbox Testing**: Use Plaid Sandbox for $1/$0 test charges

**Test Commands:**
```bash
# Test Plaid connection specifically
curl -X POST http://localhost:3000/api/test/end-to-end \
  -H "Content-Type: application/json" \
  -d '{"testSpecificStep": "plaid"}'
```

#### Google Calendar Connection
- [ ] **OAuth Flow**: Test Google Calendar OAuth
- [ ] **Event Creation**: Test creating calendar events
- [ ] **Event Updates**: Test updating existing events
- [ ] **Event Deletion**: Test removing events

### Phase 2: Trial Detection Testing

#### Email Parsing
- [ ] **Real Gmail Data**: Test with actual trial confirmation emails
- [ ] **Mock Data**: Test with generated mock emails
- [ ] **Pattern Matching**: Verify regex patterns catch different email formats
- [ ] **False Positives**: Check for incorrect trial detections
- [ ] **Missed Detections**: Verify no real trials are missed

**Test Commands:**
```bash
# Test email parsing with real Gmail data
curl -X POST http://localhost:3000/api/test/email-parsing \
  -H "Content-Type: application/json" \
  -d '{"useRealGmail": true, "saveToDatabase": true}'

# Test email parsing with mock data
curl -X POST http://localhost:3000/api/test/email-parsing \
  -H "Content-Type: application/json" \
  -d '{"useMockData": true, "saveToDatabase": true}'
```

#### Financial Transaction Detection
- [ ] **Real Plaid Data**: Test with actual bank transactions
- [ ] **Mock Data**: Test with generated mock transactions
- [ ] **Trial Amount Detection**: Verify $0.99, $1.00, $0.00 charges are detected
- [ ] **Merchant Name Matching**: Test service name extraction
- [ ] **Trial Period Estimation**: Verify 30-day trial period calculation

**Test Commands:**
```bash
# Test Plaid transactions with real data
curl -X POST http://localhost:3000/api/test/plaid-transactions \
  -H "Content-Type: application/json" \
  -d '{"useRealPlaid": true, "saveToDatabase": true}'

# Test Plaid transactions with mock data
curl -X POST http://localhost:3000/api/test/plaid-transactions \
  -H "Content-Type: application/json" \
  -d '{"useMockData": true, "saveToDatabase": true}'
```

### Phase 3: Data Management Testing

#### Duplicate Detection
- [ ] **Same Service Detection**: Test detecting multiple trials for same service
- [ ] **Date Proximity**: Test trials with similar end dates
- [ ] **Confidence Scoring**: Verify confidence scores are calculated correctly
- [ ] **Manual Review**: Test manual trial entry and conflict resolution

#### Database Operations
- [ ] **Trial Storage**: Verify trials are saved correctly
- [ ] **Data Integrity**: Check all required fields are populated
- [ ] **Updates**: Test trial status updates
- [ ] **Deletions**: Test trial removal

### Phase 4: Calendar Integration Testing

#### Event Creation
- [ ] **Automatic Events**: Test automatic calendar event creation
- [ ] **Reminder Timing**: Verify 48-hour reminder events
- [ ] **Event Details**: Check event title, description, and timing
- [ ] **External IDs**: Verify Google Calendar event IDs are stored

#### Event Management
- [ ] **Event Updates**: Test updating existing calendar events
- [ ] **Event Deletion**: Test removing events when trials are cancelled
- [ ] **Sync Status**: Verify calendar sync status tracking

### Phase 5: Notification Testing

#### Email Notifications
- [ ] **Trial Reminders**: Test 48-hour reminder emails
- [ ] **Trial Expired**: Test expired trial notifications
- [ ] **Cancellation Success**: Test successful cancellation confirmations
- [ ] **Template Rendering**: Verify HTML email templates render correctly

**Test Commands:**
```bash
# Test email notifications
curl -X POST http://localhost:3000/api/test/notifications \
  -H "Content-Type: application/json" \
  -d '{"testEmail": true, "customMessage": "Test notification"}'
```

#### SMS Notifications
- [ ] **SMS Delivery**: Test SMS sending via Twilio
- [ ] **Message Formatting**: Verify SMS message length and formatting
- [ ] **Phone Number Validation**: Test with valid/invalid phone numbers

#### Push Notifications
- [ ] **Push Delivery**: Test push notifications via OneSignal
- [ ] **Notification Data**: Verify trial data is included
- [ ] **User Targeting**: Test user-specific notifications

### Phase 6: Security Testing

#### Row Level Security (RLS)
- [ ] **User Isolation**: Verify users can only access their own data
- [ ] **Cross-User Access**: Test accessing another user's data (should fail)
- [ ] **Admin Access**: Test admin user permissions if applicable

**Test Commands:**
```bash
# Test RLS security
curl -X POST http://localhost:3000/api/test/end-to-end \
  -H "Content-Type: application/json" \
  -d '{"testSpecificStep": "security"}'
```

#### Authentication
- [ ] **Login Flow**: Test user authentication
- [ ] **Session Management**: Verify session persistence
- [ ] **Logout**: Test user logout and session cleanup

## 🔧 Testing Tools

### 1. Testing Dashboard
Access the comprehensive testing dashboard at `/test` for:
- Full end-to-end testing
- Individual component testing
- Mock data management
- Test result analysis

### 2. API Endpoints
Use these endpoints for programmatic testing:

```bash
# Full end-to-end test
POST /api/test/end-to-end

# Individual component tests
POST /api/test/end-to-end {"testSpecificStep": "gmail"}
POST /api/test/end-to-end {"testSpecificStep": "plaid"}
POST /api/test/end-to-end {"testSpecificStep": "calendar"}
POST /api/test/end-to-end {"testSpecificStep": "trials"}
POST /api/test/end-to-end {"testSpecificStep": "duplicates"}
POST /api/test/end-to-end {"testSpecificStep": "calendar-sync"}
POST /api/test/end-to-end {"testSpecificStep": "notifications"}
POST /api/test/end-to-end {"testSpecificStep": "security"}

# Mock data management
POST /api/test/mock-data
DELETE /api/test/mock-data

# Component-specific testing
POST /api/test/email-parsing
POST /api/test/plaid-transactions
POST /api/test/notifications
```

### 3. Supabase Dashboard
Use Supabase dashboard to:
- View database records
- Check RLS policies
- Monitor real-time logs
- Verify data integrity

### 4. External Testing Tools

#### Gmail Testing
- Use Gmail sandbox or test accounts
- Send fake trial confirmation emails
- Test with various email formats

#### Plaid Testing
- Use Plaid Sandbox environment
- Create test transactions with $1/$0 amounts
- Test with different merchant names

#### Notification Testing
- Use test email addresses
- Use test phone numbers for SMS
- Verify notification delivery

## 🐛 Common Issues & Solutions

### Gmail Connection Issues
**Problem**: OAuth token expired
**Solution**: Implement token refresh logic

**Problem**: Rate limiting
**Solution**: Add exponential backoff and retry logic

### Plaid Connection Issues
**Problem**: Link token expired
**Solution**: Generate new link token before each connection

**Problem**: Sandbox data not available
**Solution**: Use mock data for testing

### Database Issues
**Problem**: RLS blocking legitimate access
**Solution**: Check RLS policy definitions

**Problem**: Duplicate trials
**Solution**: Implement better duplicate detection logic

### Notification Issues
**Problem**: Email not delivered
**Solution**: Check Resend API configuration and rate limits

**Problem**: SMS not sent
**Solution**: Verify Twilio credentials and phone number format

## 📊 Performance Testing

### Load Testing
- Test with multiple concurrent users
- Verify database performance under load
- Check API response times

### Stress Testing
- Test with large numbers of trials
- Verify notification system under load
- Check memory usage and cleanup

## 🔍 Monitoring & Logging

### Key Metrics to Monitor
- Trial detection accuracy
- Notification delivery rates
- API response times
- Error rates by component
- User engagement metrics

### Log Analysis
- Check application logs for errors
- Monitor external API responses
- Track user actions and flows
- Verify data consistency

## 🚀 Production Deployment Checklist

Before deploying to production:

- [ ] All end-to-end tests pass
- [ ] Security tests verify RLS is working
- [ ] Notification tests confirm delivery
- [ ] Performance tests meet requirements
- [ ] Error handling is comprehensive
- [ ] Monitoring and logging are configured
- [ ] Environment variables are set correctly
- [ ] External API credentials are valid
- [ ] Database migrations are applied
- [ ] SSL certificates are configured

## 📝 Test Report Template

After completing testing, document:

1. **Test Environment**: OS, Node version, database version
2. **Test Results**: Pass/fail status for each component
3. **Issues Found**: Description, severity, and resolution
4. **Performance Metrics**: Response times, throughput
5. **Security Verification**: RLS, authentication, authorization
6. **Recommendations**: Improvements for production

## 🎯 Success Criteria

A successful test run should achieve:

- ✅ All connection tests pass
- ✅ Trial detection accuracy > 90%
- ✅ No false positives in duplicate detection
- ✅ All notifications delivered successfully
- ✅ RLS security blocks unauthorized access
- ✅ API response times < 2 seconds
- ✅ No critical errors in logs
- ✅ Database operations complete successfully

## 🔄 Continuous Testing

Set up automated testing for:

- Daily end-to-end test runs
- Weekly security audits
- Monthly performance benchmarks
- Quarterly user acceptance testing

This comprehensive testing approach ensures SentinelApp is robust, secure, and ready for production use. 