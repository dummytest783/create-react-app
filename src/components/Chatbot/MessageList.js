import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <MessageBubble
          key={index}
          message={msg.text}
          isUser={msg.isUser}
          timestamp={msg.timestamp}
        />
      ))}
      {isLoading && (
        <div className="message-bubble message-bubble--bot">
          <div className="message-bubble__avatar">
            <FontAwesomeIcon icon={faRobot} />
          </div>
          <div className="message-bubble__content">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
