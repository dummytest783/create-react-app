import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes } from '@fortawesome/free-solid-svg-icons';
import './chatbot.scss';

const ChatbotButton = ({ onClick, isOpen, hasUnread }) => {
  return (
    <button
      className={`chatbot-fab ${isOpen ? 'chatbot-fab--open' : ''}`}
      onClick={onClick}
      aria-label="Open Financial Assistant"
    >
      {isOpen ? (
        <FontAwesomeIcon icon={faTimes} />
      ) : (
        <>
          <FontAwesomeIcon icon={faComments} />
          {hasUnread && <span className="chatbot-fab__badge"></span>}
        </>
      )}
    </button>
  );
};

export default ChatbotButton;
