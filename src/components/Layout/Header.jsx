import React from 'react';

const Header = ({ currentSession, isLoggedIn }) => {
  return (
    <div style={styles.header}>
      <span style={styles.headerText}>
        {currentSession ? currentSession.title : 'BI Agent'}
      </span>
      {isLoggedIn && (
        <div style={styles.statusBadge}>
          <div style={styles.statusDot}></div>
          <span>Connected</span>
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    height: '70px',
    borderBottom: '1px solid #2d3748',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    backgroundColor: '#1a1f2e'
  },
  headerText: {
    fontWeight: '600',
    fontSize: '16px',
    color: '#fff'
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: '#065f46',
    fontSize: '13px',
    color: '#6ee7b7',
    fontWeight: '500'
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981'
  }
};

export default Header;