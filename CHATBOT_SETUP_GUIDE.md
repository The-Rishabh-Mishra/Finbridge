# AI Banking Chatbot Integration Guide

## Overview

Your MERN application now includes an advanced AI-powered Banking Assistant chatbot. It's available globally on all pages as a floating chat button in the bottom-right corner.

## Features

### ✨ UI/UX Features
- **Floating Chat Button**: Modern circular button with animation in the bottom-right corner
- **Chat Window**: Clean, modern design with smooth animations
- **Message Bubbles**: Distinct styling for user vs bot messages with timestamps
- **Typing Indicator**: Shows "Bot is typing..." animation
- **Suggested Questions**: Quick buttons for common banking questions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode Support**: Automatically adapts to system preferences

### 🧠 AI Features
- **Banking-Focused Responses**: Only answers banking and finance-related questions
- **Smart Routing**: Redirects off-topic questions with helpful message
- **Conversation History**: Maintains context across messages
- **Rate Limiting**: Prevents spam (20 messages/hour per user)
- **Input Sanitization**: Protects against malicious input

### 📋 Supported Topics
- CIBIL Score (definition, improvement, factors)
- Credit Score (importance, building, fixing)
- Loans (personal, home, auto, business)
- Interest Rates (calculation, types, APR/APY)
- EMI (Equated Monthly Installment)
- Savings Accounts (types, ROI, benefits)
- Investments (strategy, diversification)
- Debt Management (clearing debt, credit utilization)
- Banking Terms (DPD, LTV, etc.)

---

## Setup Instructions

### Step 1: Install OpenAI API Key

The chatbot uses OpenAI's GPT-3.5 Turbo model. You need to configure your API key:

1. **Create OpenAI Account**:
   - Go to [https://platform.openai.com](https://platform.openai.com)
   - Sign up or log in

2. **Get API Key**:
   - Navigate to API Keys section
   - Create a new secret key
   - Copy the key (starts with `sk-`)

3. **Add to .env file** (server/.env):
   ```env
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

### Step 2: Install Dependencies

**Frontend** (already done):
```bash
cd client
npm install tesseract.js  # For OCR (if using document extraction)
```

**Backend**:
```bash
cd server
npm install axios  # For API calls (should already be installed)
# Already have all dependencies if Express and others are installed
```

### Step 3: Restart Server

```bash
cd server
npm start
```

The chatbot API will be available at `/api/chatbot/query`

---

## API Endpoints

### Post User Message
**Endpoint**: `POST /api/chatbot/query`

**Authentication**: Required (JWT token)

**Request Body**:
```json
{
  "message": "What is CIBIL score?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi there! How can I help?"
    }
  ]
}
```

**Response Success**:
```json
{
  "success": true,
  "response": "CIBIL score is a credit score between 300-900 that represents..."
}
```

**Response Error**:
```json
{
  "success": false,
  "error": "Too many messages. Please wait before sending another message."
}
```

### Check Chatbot Health
**Endpoint**: `GET /api/chatbot/health`

**Response**:
```json
{
  "success": true,
  "status": "operational",
  "message": "Banking Assistant is ready"
}
```

---

## Frontend Implementation

### Component Location
`client/src/components/Chatbot.jsx`

### How It Works

1. **Floating Button**: Always visible in bottom-right corner
2. **Click to Open**: Smooth animation slides up chat window
3. **Send Message**: User types and presses Enter or clicks send button
4. **API Call**: Message is sent to backend with conversation history
5. **Bot Response**: AI-generated response is displayed in chat
6. **Suggested Questions**: Initial view shows 3 suggested banking questions

### Integration
The Chatbot component is automatically integrated in `App.jsx`:

```jsx
import Chatbot from './components/Chatbot';

// In AppContent component:
<>
  <Router>
    {/* Routes */}
  </Router>
  
  {/* Chatbot available on all pages */}
  <Chatbot />
</>
```

### Styling
All chatbot styles are in `client/src/styles/chatbot.css`:
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Smooth animations
- Accessibility features (focus states, ARIA labels)

---

## Backend Implementation

### Service Layer
**File**: `server/utils/chatbotService.js`

Key Functions:
- `queryBankingChatbot(message, history)` - Main AI query function
- `isBankingRelated(message)` - Validates banking topic
- `checkRateLimit(userId, maxMsg, windowMs)` - Rate limiting
- `sanitizeMessage(message)` - Input validation

### Routes
**File**: `server/routes/chatbotRoutes.js`

- `POST /chatbot/query` - Process message
- `GET /chatbot/health` - Health check

---

## Configuration

### System Prompt
The chatbot follows this instruction system prompt:

```
You are a Banking and Finance Assistant for FinBridge.
- Only answer banking/finance questions
- Redirect off-topic questions politely
- Keep responses concise (2-3 sentences)
- Use simple language
- Include practical examples
```

### Rate Limiting
- **Default**: 20 messages per hour per user
- **Customizable**: Edit `checkRateLimit()` in chatbotService.js

### Message Limits
- **Max Length**: 500 characters per message
- **Max Tokens**: 200 tokens in response (configurable)

---

## Usage Examples

### Example 1: CIBIL Score Question
**User**: "What is CIBIL score?"
**Bot**: "CIBIL score is a credit score between 300-900 that represents your credit history. A higher score indicates lower credit risk..."

### Example 2: Off-Topic Question
**User**: "What's your favorite movie?"
**Bot**: "I specialize in banking and finance topics. Please ask me about credit scores, loans, interest rates, savings, or other banking-related questions! 🏦"

### Example 3: Multi-Turn Conversation
**User 1**: "How to improve my credit score?"
**Bot 1**: "You can improve your credit score by paying bills on time, reducing credit card usage, and correcting errors in your credit report..."
**User 2**: "What's a good CIBIL score?"
**Bot 2**: "A CIBIL score above 750 is considered good, above 800 is excellent..."

---

## Troubleshooting

### Issue: "API Key not configured"
**Solution**: 
- Verify `OPENAI_API_KEY` is in `.env`
- Restart server after adding key
- Check key is valid at [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)

### Issue: "Too many requests" error
**Solution**: 
- This is rate limiting - wait 1 hour
- Or modify rate limit in `chatbotService.js`

### Issue: Chatbot not appearing
**Solution**: 
- Check browser console for errors
- Clear browser cache
- Verify Chatbot import in App.jsx
- Check if CSS file is loaded

### Issue: Messages not sending
**Solution**: 
- Check if user is authenticated (JWT token required)
- Verify API endpoint at `/api/chatbot/query`
- Check network tab in DevTools
- Ensure OpenAI API key is set

### Issue: Slow responses
**Solution**: 
- OpenAI API may have latency (usually 1-3 seconds)
- Check your network connection
- Verify OpenAI account has credit

---

## Customization

### Change Suggested Questions
Edit `SUGGESTED_QUESTIONS` array in `Chatbot.jsx`:

```jsx
const SUGGESTED_QUESTIONS = [
  'What is CIBIL score?',
  'How to improve credit score?',
  // Add your own...
];
```

### Change Chatbot Name/Avatar
In `Chatbot.jsx` header section:

```jsx
<h3 className="chatbot-title">Banking Assistant</h3>
<div className="chatbot-avatar">🤖</div>
```

### Change Colors
Edit color variables in `chatbot.css`:
- Primary Gradient: `#667eea` to `#764ba2`
- Success Color: `#10b981`
- Error Color: `#ef4444`

### Add Custom Instructions
Modify `BANKING_SYSTEM_PROMPT` in `chatbotService.js` to add domain-specific knowledge

---

## Performance Optimization

### Lazy Loading (Optional)
To load chatbot only on demand:

```jsx
const Chatbot = lazy(() => import('./components/Chatbot'));

<Suspense fallback={null}>
  <Chatbot />
</Suspense>
```

### Message Limit
Limit conversation history to prevent memory issues:

```jsx
// In Chatbot.jsx
const conversationHistory = messages.slice(-10); // Last 10 messages only
```

---

## Security Considerations

1. **Authentication Required**: All chatbot queries require JWT token
2. **Input Sanitization**: Messages are sanitized before processing
3. **Rate Limiting**: 20 messages/hour prevents abuse
4. **API Key**: Never expose your OpenAI API key (keep in .env)
5. **Content Filtering**: Off-topic questions are filtered

---

## Monitoring

### Check Chatbot Status
```bash
curl http://localhost:5001/api/chatbot/health
```

### View Request Logs
Check server console for detailed logs:
```
POST /api/chatbot/query
User ID: xxx
Message: "What is EMI?"
Response: "EMI stands for..."
```

---

## Future Enhancements

1. **Multi-language Support**: Add Hindi, regional languages
2. **Persistent History**: Save chat history to database
3. **Admin Analytics**: Track popular questions, user sentiment
4. **Document Search**: Search knowledge base instead of AI
5. **Voice Chat**: Add speech recognition and synthesis
6. **Email Export**: Send chat transcript via email
7. **Feedback System**: Users rate response quality
8. **Custom Knowledge Base**: Train on company-specific docs

---

## Resources

- **OpenAI Documentation**: https://platform.openai.com/docs
- **React Hooks**: https://react.dev/reference/react
- **Express.js**: https://expressjs.com/
- **Axios**: https://axios-http.com/

---

## Support

For issues:
1. Check troubleshooting section above
2. Review console logs (browser and server)
3. Verify .env configuration
4. Test API endpoint directly with Postman/curl
5. Contact OpenAI support for API issues

---

**Version**: 1.0.0
**Last Updated**: March 24, 2026
**Status**: Production Ready ✅

