import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faRedo, faTimes } from '@fortawesome/free-solid-svg-icons';
import MessageList from './MessageList';
import InputBar from './InputBar';
import SuggestedQuestions from './SuggestedQuestions';

const ChatbotWindow = ({
  messages,
  isLoading,
  onSendMessage,
  onClose,
  onClearChat,
  showSuggestions
}) => {
  return (
    <div className="chatbot-window">
      {/* Header */}
      <div className="chatbot-window__header">
        <div className="chatbot-window__header-content">
          <div className="chatbot-window__icon">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="chatbot-window__title">
            <h3>Financial Assistant</h3>
          </div>
        </div>
        <div className="chatbot-window__actions">
          <button
            className="chatbot-window__action-btn"
            onClick={onClearChat}
            aria-label="Clear chat"
            title="Start new conversation"
          >
            <FontAwesomeIcon icon={faRedo} />
          </button>
          <button
            className="chatbot-window__action-btn chatbot-window__action-btn--close"
            onClick={onClose}
            aria-label="Close chat"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chatbot-window__body">
        <MessageList messages={messages} isLoading={isLoading} />
        {showSuggestions && messages.length <= 1 && (
          <SuggestedQuestions onQuestionClick={onSendMessage} />
        )}
      </div>

      {/* Input */}
      <div className="chatbot-window__footer">
        <InputBar onSend={onSendMessage} disabled={isLoading} />
        <div className="chatbot-window__disclaimer">
          Educational information only. Not investment advice.
        </div>
      </div>
    </div>
  );
};

export default ChatbotWindow;
