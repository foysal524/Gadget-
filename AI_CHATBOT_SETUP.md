# AI Chatbot Setup Guide

## Overview
This AI chatbot uses Google's Gemini API (free tier) to answer customer queries about products in your database.

## Setup Steps

### 1. Get Free Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Backend
Add to your `.env` file:
```
GEMINI_API_KEY=your_actual_api_key_here
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
Import and use the AIChatbot component:
```jsx
import AIChatbot from './components/AIChatbot';

// Add to your main layout
<AIChatbot />
```

## Features
- ✅ Searches products by keywords
- ✅ Provides AI-generated responses
- ✅ Returns related products
- ✅ Free tier (60 requests/minute)

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

## Alternative Free APIs
- **OpenAI GPT-3.5**: Free tier with limits
- **Hugging Face**: Free inference API
- **Cohere**: Free tier available
