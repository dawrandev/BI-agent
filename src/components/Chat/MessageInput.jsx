import React, { useState } from 'react';

const MessageInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div style={styles.inputArea}>
      <form onSubmit={handleSubmit} style={styles.inputForm}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about your business data..."
          style={styles.input}
          disabled={disabled}
        />
        <button 
          type="submit" 
          style={{
            ...styles.sendButton,
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer'
          }} 
          disabled={disabled}
        >
          <span style={styles.sendIcon}>→</span>
        </button>
      </form>
    </div>
  );
};

const styles = {
  inputArea: {
    padding: '24px 32px',
    borderTop: '1px solid #2d3748',
    backgroundColor: '#1a1f2e'
  },
  inputForm: {
    display: 'flex',
    gap: '12px',
    maxWidth: '900px',
    margin: '0 auto'
  },
  input: {
    flex: 1,
    padding: '16px 20px',
    borderRadius: '12px',
    border: '1px solid #2d3748',
    backgroundColor: '#0f1419',
    color: '#fff',
    fontSize: '15px',
    outline: 'none'
  },
  sendButton: {
    padding: '16px 28px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '20px',
    fontWeight: 'bold',
    transition: 'transform 0.2s'
  },
  sendIcon: {
    display: 'inline-block'
  }
};

export default MessageInput;