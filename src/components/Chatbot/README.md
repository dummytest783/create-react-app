# Financial Assistant Chatbot

A modern, professional chatbot interface for Stocklele that helps users learn about financial concepts and stock market metrics.

## 🎨 Features

- **Modern UI**: Glassmorphism design matching Stocklele's purple/teal theme
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Context-Aware**: Can be enhanced to reference user's selected stocks
- **Session Management**: Maintains conversation history with localStorage persistence
- **AI-Powered**: Uses Groq Llama 3.3 70B for intelligent responses
- **Suggested Questions**: Quick access to common financial queries
- **Professional Animations**: Smooth transitions, typing indicators, and micro-interactions

## 📁 Component Structure

```
Chatbot/
├── index.js                    # Main container with state management
├── ChatbotButton.js            # Floating action button (FAB)
├── ChatbotWindow.js            # Chat window with header, body, footer
├── MessageList.js              # Scrollable message container
├── MessageBubble.js            # Individual message bubbles
├── InputBar.js                 # Text input with send button
├── SuggestedQuestions.js       # Quick question chips
├── chatbot.scss                # Complete styling
└── utils/
    └── chatbotService.js       # API integration functions
```

## 🚀 Usage

The chatbot is already integrated into `App.js` and will appear on all pages as a floating button in the bottom-right corner.

### Basic Integration (Already Done)

```jsx
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <div className="App">
      {/* Your routes */}
      <Chatbot />
    </div>
  );
}
```

### Advanced: Pass Context to Chatbot

You can enhance the chatbot with user context:

```jsx
<Chatbot
  selectedTickers={['AAPL', 'MSFT']}
  currentPage="home"
/>
```

## 🎯 API Integration

The chatbot communicates with your backend at `http://localhost:8000`.

### API Endpoints Used

1. **Send Message**: `POST /chat/financial-assistant`
   ```json
   Request: {
     "session_id": "uuid",
     "message": "What is P/E ratio?"
   }

   Response: {
     "session_id": "uuid",
     "response": "The P/E ratio...",
     "timestamp": "2026-01-15T...",
     "model": "llama-3.3-70b-versatile",
     "conversation_turns": 1
   }
   ```

2. **Get History**: `GET /chat/sessions/{session_id}/history`
3. **Clear Session**: `DELETE /chat/sessions/{session_id}`
4. **Get Stats**: `GET /chat/sessions/stats`

## 🎨 Theming

The chatbot uses Stocklele's design system:

- **Primary Background**: `#28174E` (Deep purple)
- **Accent Color**: `#5AC3BF` (Teal)
- **Glassmorphism**: `backdrop-filter: blur(20px)`
- **Border Radius**: 12-16px for modern card design
- **Shadows**: Consistent with existing UI components

## 📱 Responsive Breakpoints

- **Desktop (>1024px)**: 380px × 600px floating window
- **Tablet (768-1024px)**: 400px width, adjusted height
- **Mobile (<480px)**: Full-screen overlay

## 🔧 Customization

### Change API Endpoint

Edit `utils/chatbotService.js`:

```javascript
const API_BASE_URL = 'https://your-api.com';
```

### Modify Suggested Questions

Edit `SuggestedQuestions.js`:

```javascript
const SUGGESTED_QUESTIONS = [
  "Your custom question 1",
  "Your custom question 2",
  // ...
];
```

### Adjust Colors

Edit `chatbot.scss` variables:

```scss
$color-accent-teal: #5AC3BF;
$color-primary-bg: #28174E;
// ...
```

## 🧪 Testing

### Start Backend Server

```bash
# Make sure your backend is running
python your_backend_server.py
# Should be available at http://localhost:8000
```

### Start React App

```bash
cd create-react-app
npm start
```

### Test Flow

1. Click the teal chat button (bottom-right)
2. Try a suggested question or type your own
3. Verify API connection and response
4. Test "Clear Chat" and "Close" buttons
5. Test on mobile (resize browser)

## 🐛 Troubleshooting

### Chatbot button not appearing
- Check browser console for errors
- Verify `import Chatbot from "./components/Chatbot"` in App.js
- Ensure all component files exist

### API connection errors
- Verify backend is running at `http://localhost:8000`
- Check CORS settings on backend
- Open browser DevTools → Network tab to inspect requests

### Styling issues
- Clear browser cache
- Check that `chatbot.scss` is importing correctly
- Verify SASS is installed: `npm list sass`

## 🎓 Educational Focus

The chatbot is designed to explain:
- Financial metrics (P/E, ROE, profit margins, etc.)
- Stock market concepts
- Warren Buffett investing principles
- How to read financial statements
- Valuation methods

**Important**: The chatbot provides educational information only, not investment advice.

## 📊 Session Management

- Each user gets a unique session ID (UUID v4)
- Conversation history persists in localStorage
- Sessions are maintained across page refreshes
- Use "Clear Chat" to start a new conversation

## 🚀 Future Enhancements

Ideas for extending the chatbot:

1. **Context Awareness**: Reference user's selected stocks in responses
2. **Rich Messages**: Display financial tables, charts, or metric cards
3. **Voice Input**: Add speech-to-text capability
4. **Multi-language**: Support for multiple languages
5. **Premium Features**: Gated advanced analysis for paid users
6. **Analytics**: Track popular questions to improve content
7. **Proactive Help**: Suggest relevant information based on page context

## 📝 License

Part of the Stocklele project.
