import React, { useState } from 'react';

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        ...styles.button,
        backgroundColor: copied ? '#065f46' : '#1a1f2e',
        borderColor: copied ? '#10b981' : '#2d3748'
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          e.currentTarget.style.backgroundColor = '#2d3748';
          e.currentTarget.style.borderColor = '#667eea';
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          e.currentTarget.style.backgroundColor = '#1a1f2e';
          e.currentTarget.style.borderColor = '#2d3748';
        }
      }}
    >
      <span style={styles.icon}>
        {copied ? '✓' : '📋'}
      </span>
      <span style={styles.text}>
        {copied ? 'Copied' : 'Copy'}
      </span>
    </button>
  );
};

const styles = {
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    border: '1px solid',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  icon: {
    fontSize: '14px',
    lineHeight: 1
  },
  text: {
    userSelect: 'none',
    lineHeight: 1
  }
};

export default CopyButton;
