import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';

const MessageBubble = ({ message, isUser, timestamp }) => {
  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--bot'}`}>
      {!isUser && (
        <div className="message-bubble__avatar">
          <FontAwesomeIcon icon={faRobot} />
        </div>
      )}
      <div className="message-bubble__content">
        <div className="message-bubble__text">
          {message}
        </div>
        {timestamp && (
          <div className="message-bubble__timestamp">
            {formatTime(timestamp)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
