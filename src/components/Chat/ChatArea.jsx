import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ThinkingIndicator from './ThinkingIndicator';

const ChatArea = ({ messages, isTyping, isLoggedIn, currentSession, streamingData }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingData]);

  if (!isLoggedIn) {
    return (
      <div style={styles.chatArea}>
        <div style={styles.welcomeContainer}>
          <h1 style={styles.welcomeTitle}>Welcome to BI Agent</h1>
          <p style={styles.welcomeSubtitle}>Chat with your Odoo ERP data</p>
        </div>
      </div>
    );
  }

  if (!currentSession) {
    return (
      <div style={styles.chatArea}>
        <div style={styles.welcomeContainer}>
          <h1 style={styles.welcomeTitle}>Start a new conversation</h1>
          <p style={styles.welcomeSubtitle}>Ask about your business data...</p>
        </div>
      </div>
    );
  }

 return (
    <div style={styles.chatArea}>
      <div style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <ChatMessage key={message.id || index} message={message} />
        ))}
        
        {(streamingData.thinking || streamingData.step) && (
          <ThinkingIndicator 
            thinking={streamingData.thinking} 
            step={streamingData.step} 
          />
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

const styles = {
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    padding: '24px',
    backgroundColor: '#0f1419'
  },
  welcomeContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  welcomeTitle: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  welcomeSubtitle: {
    fontSize: '18px',
    color: '#718096',
    marginBottom: '32px'
  },
  messagesContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    width: '100%'
  },
  aiMessageWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '12px',
    alignItems: 'flex-start'
  },
  aiAvatar: {
    width: '36px',
    height: '36px',
    minWidth: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    marginTop: '4px',
    color: '#fff'
  },
  aiMessage: {
    maxWidth: '80%',
    padding: '16px 20px',
    borderRadius: '18px',
    backgroundColor: '#1a1f2e',
    border: '1px solid #2d3748',
    color: '#e2e8f0',
    fontSize: '15px',
    lineHeight: '1.6'
  },
  typingIndicator: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    padding: '4px 0'
  },
  typingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#718096',
    animation: 'typing 1.4s infinite'
  }
};

export default ChatArea;