import React from 'react';

const UserSection = ({ isLoggedIn, username, onLogin, onLogout }) => {
  if (!isLoggedIn) {
    return (
      <div style={styles.userSection}>
        <button style={styles.loginButton} onClick={onLogin}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div style={styles.userSection}>
      <div style={styles.userButton}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            {username.substring(0, 2).toUpperCase()}
          </div>
          <span style={styles.userName}>{username}</span>
        </div>
        <button onClick={onLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  userSection: {
    padding: '16px',
    borderTop: '1px solid #2d3748'
  },
  userButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    borderRadius: '10px',
    backgroundColor: 'transparent'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  avatar: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    color: '#fff'
  },
  userName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff'
  },
  loginButton: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  logoutButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2d3748',
    color: '#fff',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '500'
  }
};

export default UserSection;