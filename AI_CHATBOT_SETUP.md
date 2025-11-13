# AI Chatbot Setup Guide

## Overview
This AI chatbot uses **Groq AI** with the **llama-3.3-70b-versatile** model to provide intelligent shopping assistance. It searches your product database and provides contextual recommendations based on customer queries.

## Features
- 🤖 **Intelligent Product Search**: Searches products by category, brand, price, and specifications
- 💬 **Natural Language Understanding**: Understands budget constraints and preferences
- 🎯 **Contextual Recommendations**: Only suggests relevant products matching user criteria
- 🔄 **Dual Mode**: Toggle between AI Assistant and Human Support
- 📦 **Product Display**: Shows related products with images and prices
- ⚡ **Fast Response**: Powered by Groq's high-speed inference

## Setup Steps

### 1. Get Free Groq API Key
1. Go to https://console.groq.com
2. Sign up for a free account
3. Navigate to API Keys section
4. Click "Create API Key"
5. Copy the generated API key (starts with `gsk_`)

### 2. Configure Backend
Add to your `.env` file:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Test the API
Start your backend server:
```bash
cd backend
npm run dev
```

Test with curl:
```bash
curl -X POST http://localhost:8000/api/ai-chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What laptops do you have?"}'
```

### 4. Frontend Integration
The AI chatbot is integrated into the support chat component:
- Located in: `frontend/src/components/chat/UserChat.js`
- Accessible via the "💬 Support" button (bottom-right corner)
- Toggle between AI Assistant and Human Support modes
- AI mode is enabled by default

## How It Works

### 1. User Query Processing
- User sends a message through the chat interface
- Backend extracts keywords from the query
- Searches database for matching products by:
  - Category name
  - Product name
  - Brand
  - Description

### 2. AI Context Building
- Fetches up to 50 relevant products from database
- Builds comprehensive context with:
  - Product names
  - Categories
  - Brands
  - Prices
  - Stock status
  - Descriptions

### 3. AI Response Generation
- Sends context + user query to Groq AI
- AI analyzes and generates helpful response
- Follows strict rules:
  - Only mention products matching user criteria
  - Respect budget constraints
  - Don't suggest unrelated products
  - Be concise (2-3 sentences)

### 4. Product Matching
- Extracts product names mentioned in AI response
- Returns matching products with:
  - Product ID
  - Name
  - Price
  - Images
- Displays products in chat interface

## API Endpoint
**POST** `/api/ai-chat/message`

Request:
```json
{
  "message": "Do you have gaming laptops?"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "message": "AI generated response...",
    "relatedProducts": [...]
  }
}
```

## Usage Examples

### Example 1: Budget-Based Query
**User**: "I need earphones under 2000 taka"

**AI Response**: "We have several earphones under 2000 taka including the TWS Earbuds at ৳1,500 and Wired Earphones at ৳800."

**Products Shown**: Only earphones with price ≤ 2000

### Example 2: Category Query
**User**: "Show me smartwatches"

**AI Response**: "We have smartwatches available in our wearables section. Check out our latest models with fitness tracking features."

**Products Shown**: All smartwatches in stock

### Example 3: Greeting
**User**: "Hello"

**AI Response**: "Hello! How can I help you find the perfect gadget today?"

**Products Shown**: None (just greeting)

## Configuration

### AI Model Settings
Located in: `backend/controllers/aiChatController.js`

```javascript
const completion = await groq.chat.completions.create({
  model: 'llama-3.3-70b-versatile',  // Model name
  temperature: 0.3,                   // Lower = more focused
  max_tokens: 300                     // Response length limit
});
```

### Customization Options

1. **Change Product Limit**:
   ```javascript
   const allProducts = await Product.findAll({
     limit: 50  // Change this number
   });
   ```

2. **Adjust AI Temperature**:
   - `0.0-0.3`: Very focused, consistent responses
   - `0.4-0.7`: Balanced creativity
   - `0.8-1.0`: More creative, varied responses

3. **Modify System Prompt**:
   Edit the `websiteContext` variable to change AI behavior

## Troubleshooting

### Issue: AI not responding
**Solution**: 
- Check if `GROQ_API_KEY` is set in `.env`
- Verify API key is valid at https://console.groq.com
- Check backend logs for errors

### Issue: Wrong products suggested
**Solution**:
- Review system prompt in `aiChatController.js`
- Adjust temperature (lower = more accurate)
- Check product matching logic

### Issue: Slow responses
**Solution**:
- Reduce product limit in database query
- Decrease `max_tokens` value
- Check database indexing

### Issue: API rate limit exceeded
**Solution**:
- Groq free tier: 30 requests/minute
- Implement request throttling
- Add caching for common queries

## API Limits (Groq Free Tier)

- **Requests**: 30 per minute
- **Tokens**: 14,400 per minute
- **Models**: Access to all models
- **Cost**: Free forever

## Advanced Features

### 1. Chat History
The chat maintains conversation history in the UI, but each API call is stateless. To add memory:

```javascript
// Store conversation in session/database
const messages = [
  { role: 'system', content: websiteContext },
  { role: 'user', content: previousMessage },
  { role: 'assistant', content: previousResponse },
  { role: 'user', content: currentMessage }
];
```

### 2. Product Filtering
Enhance filtering by adding more criteria:

```javascript
const products = await Product.findAll({
  where: {
    price: { [Op.lte]: maxBudget },
    category: requestedCategory,
    inStock: true
  }
});
```

### 3. Analytics
Track chatbot usage:

```javascript
// Log queries for analysis
await ChatLog.create({
  userId: user.id,
  query: message,
  response: aiResponse,
  productsShown: relatedProducts.length
});
```

## Alternative AI Providers

If you want to switch from Groq:

### OpenAI GPT-4
```bash
npm install openai
```
```javascript
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const completion = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [{ role: 'user', content: message }]
});
```

### Anthropic Claude
```bash
npm install @anthropic-ai/sdk
```
```javascript
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const message = await anthropic.messages.create({
  model: 'claude-3-sonnet-20240229',
  messages: [{ role: 'user', content: message }]
});
```

## Best Practices

1. **Always validate user input** before sending to AI
2. **Implement rate limiting** to prevent abuse
3. **Cache common queries** to reduce API calls
4. **Monitor API usage** to stay within limits
5. **Sanitize AI responses** before displaying to users
6. **Log errors** for debugging and improvement
7. **Test with various queries** to ensure accuracy
8. **Update product context** regularly for accuracy

## Support

For issues with:
- **Groq API**: https://console.groq.com/docs
- **Implementation**: Create GitHub issue
- **Feature requests**: Open discussion on GitHub
