import React, { useState, useEffect } from 'react';
import ChatbotButton from './ChatbotButton';
import ChatbotWindow from './ChatbotWindow';
import { sendMessage, generateSessionId, clearSession } from './utils/chatbotService';
import './chatbot.scss';

const WELCOME_MESSAGE = {
  text: `Hello! I'm your Financial Assistant. I can help you understand stock market concepts and financial metrics.

Remember: I provide educational information only, not investment advice.`,
  isUser: false,
  timestamp: new Date().toISOString()
};

const Chatbot = ({ selectedTickers = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [hasUnread, setHasUnread] = useState(false);

  // Initialize session on mount
  useEffect(() => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);

    // Load messages from localStorage if available
    const savedMessages = localStorage.getItem(`chatbot_messages_${newSessionId}`);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Error loading saved messages:', e);
      }
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      localStorage.setItem(`chatbot_messages_${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  // Show unread badge when new message arrives and chat is closed
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.isUser) {
        setHasUnread(true);
      }
    }
  }, [messages, isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  const handleSendMessage = async (userMessage) => {
    if (!sessionId) return;

    // Add user message
    const userMsg = {
      text: userMessage,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Send to API
      const response = await sendMessage(sessionId, userMessage);

      // Add bot response
      const botMsg = {
        text: response.response,
        isUser: false,
        timestamp: response.timestamp
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      // Error handling
      const errorMsg = {
        text: "I'm sorry, I'm having trouble connecting right now. Please make sure the backend server is running at http://localhost:8000 and try again.",
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (!sessionId) return;

    try {
      await clearSession(sessionId);
    } catch (error) {
      console.error('Error clearing session:', error);
    }

    // Generate new session and reset messages
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    setMessages([WELCOME_MESSAGE]);
    localStorage.removeItem(`chatbot_messages_${sessionId}`);
  };

  return (
    <div className="chatbot-container">
      <ChatbotButton
        onClick={handleToggle}
        isOpen={isOpen}
        hasUnread={hasUnread}
      />
      {isOpen && (
        <ChatbotWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onClose={handleToggle}
          onClearChat={handleClearChat}
          showSuggestions={true}
        />
      )}
    </div>
  );
};

export default Chatbot;
