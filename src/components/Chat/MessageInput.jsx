import React, { useRef, useEffect, useState } from 'react';

const MessageInput = ({ onSendMessage, disabled = false, value, onChange }) => {
  const textareaRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = newHeight + 'px';
    }
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value && value.trim() && !disabled) {
      onSendMessage(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canSend = value && value.trim() && !disabled;

  return (
    <div style={styles.inputContainer}>
      <div style={{
        ...styles.inputWrapper,
        ...(isFocused ? styles.inputWrapperFocused : {})
      }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask about your business data..."
          style={styles.textarea}
          disabled={disabled}
          rows={1}
        />
        <button
          onClick={handleSubmit}
          style={{
            ...styles.sendButton,
            opacity: canSend ? 1 : 0.5,
            cursor: canSend ? 'pointer' : 'not-allowed'
          }}
          disabled={!canSend}
          type="button"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        </button>
      </div>
      <p style={styles.hint}>Press Enter to send, Shift+Enter for new line</p>
    </div>
  );
};

const styles = {
  inputContainer: {
    width: '100%',
    maxWidth: '768px',
    margin: '0 auto',
    padding: '16px 24px 24px'
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '24px',
    border: '1px solid #2d3748',
    backgroundColor: '#1a1f2e',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  },
  inputWrapperFocused: {
    borderColor: '#667eea',
    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)'
  },
  textarea: {
    flex: 1,
    padding: '8px 0',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: '15px',
    lineHeight: '1.5',
    outline: 'none',
    resize: 'none',
    minHeight: '24px',
    maxHeight: '200px',
    fontFamily: 'inherit',
    overflow: 'auto'
  },
  sendButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s, opacity 0.2s',
    flexShrink: 0
  },
  hint: {
    marginTop: '8px',
    fontSize: '12px',
    color: '#6b7280',
    textAlign: 'center'
  }
};

export default MessageInput;
