import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const InputBar = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="input-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="input-bar__field"
        placeholder="Ask about any financial concept..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        maxLength={500}
      />
      <button
        type="submit"
        className="input-bar__send"
        disabled={disabled || !input.trim()}
        aria-label="Send message"
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </form>
  );
};

export default InputBar;
