import React from 'react';
import ChatHistory from './ChatHistory';
import UserSection from './UserSection';

const Sidebar = ({ 
  isLoggedIn, 
  username, 
  sessions, 
  currentSessionId, 
  onNewChat, 
  onSelectSession, 
  onDeleteSession,
  onLogin,
  onLogout 
}) => {
  return (
    <div style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}></div>
        <span style={styles.logoText}>BI Agent</span>
      </div>

      {/* Menu Items */}
      <div style={styles.menu}>
        <button style={styles.menuItem} onClick={onNewChat}>
          <span style={styles.icon}>+</span>
          <span>New Chat</span>
        </button>

        <ChatHistory
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={onSelectSession}
          onDeleteSession={onDeleteSession}
        />
      </div>

      <UserSection
        isLoggedIn={isLoggedIn}
        username={username}
        onLogin={onLogin}
        onLogout={onLogout}
      />
    </div>
  );
};

const styles = {
  sidebar: {
    width: '280px',
    backgroundColor: '#1a1f2e',
    borderRight: '1px solid #2d3748',
    display: 'flex',
    flexDirection: 'column'
  },
  logo: {
    padding: '20px',
    borderBottom: '1px solid #2d3748',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logoIcon: {
    width: '28px',
    height: '28px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '6px'
  },
  logoText: {
    fontWeight: '700',
    fontSize: '18px',
    letterSpacing: '-0.5px',
    color: '#fff'
  },
  menu: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto'
  },
  menuItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #2d3748',
    backgroundColor: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '8px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  icon: {
    fontSize: '20px',
    fontWeight: 'bold'
  }
};

export default Sidebar;