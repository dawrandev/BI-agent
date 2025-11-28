import React from 'react';

const ChatHistory = ({ sessions, currentSessionId, onSelectSession, onDeleteSession }) => {
  if (sessions.length === 0) {
    return (
      <div style={styles.historyText}>
        Please login to see your chat history
      </div>
    );
  }

  return (
    <div style={styles.chatHistory}>
      {sessions.map(session => (
        <div
          key={session.id}
          style={{
            ...styles.chatHistoryItem,
            ...(currentSessionId === session.id ? styles.chatHistoryItemActive : {})
          }}
          onClick={() => onSelectSession(session.id)}
        >
          <span style={styles.chatHistoryText}>
            {session.title || 'Untitled Chat'}
          </span>
          <button
            style={styles.deleteButton}
            onClick={(e) => onDeleteSession(session.id, e)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

const styles = {
  chatHistory: {
    marginTop: '24px'
  },
  historyText: {
    marginTop: '24px',
    padding: '0 16px',
    fontSize: '13px',
    color: '#718096',
    lineHeight: '1.6'
  },
  chatHistoryItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginBottom: '4px',
    backgroundColor: 'transparent'
  },
  chatHistoryItemActive: {
    backgroundColor: '#2d3748'
  },
  chatHistoryText: {
    fontSize: '14px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
    color: '#cbd5e0'
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    color: '#718096',
    fontSize: '22px',
    cursor: 'pointer',
    padding: '0 4px',
    opacity: 0.6,
    transition: 'opacity 0.2s'
  }
};

export default ChatHistory;