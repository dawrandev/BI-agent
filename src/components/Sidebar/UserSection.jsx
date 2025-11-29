import React, { useState } from 'react';

const UserSection = ({ isLoggedIn, username, onLogin, onLogout, onSettings }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Overlay to close dropdown when clicking outside */}
          <div 
            style={styles.overlay} 
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div style={styles.dropdownMenu}>
            <button 
              style={styles.dropdownItem}
              onClick={() => {
                setIsDropdownOpen(false);
                onSettings();
              }}
            >
              <span style={styles.dropdownIcon}>⚙️</span>
              <span>Settings</span>
            </button>
            
            <div style={styles.divider} />
            
            <button 
  style={styles.dropdownItem}
  onClick={() => {
    setIsDropdownOpen(false);
    onLogout();
  }}
>
  <span style={styles.dropdownIcon}>→</span>
  <span>Logout</span>
</button>
          </div>
        </>
      )}

      {/* User Button - Click to toggle dropdown */}
      <button 
        style={styles.userButton}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            {username.substring(0, 2).toUpperCase()}
          </div>
          <span style={styles.userName}>{username}</span>
        </div>
        
        {/* Dropdown Arrow */}
        <span style={{
          ...styles.arrow,
          transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>
          ▼
        </span>
      </button>
    </div>
  );
};

const styles = {
  userSection: {
    padding: '16px',
    borderTop: '1px solid #2d3748',
    position: 'relative'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 998,
    backgroundColor: 'transparent'
  },
  dropdownMenu: {
    position: 'absolute',
    bottom: '80px',
    left: '16px',
    right: '16px',
    backgroundColor: '#1a1f2e',
    border: '1px solid #2d3748',
    borderRadius: '12px',
    padding: '8px',
    zIndex: 999,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
  },
  dropdownItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    textAlign: 'left'
  },
  dropdownIcon: {
    fontSize: '18px'
  },
  divider: {
    height: '1px',
    backgroundColor: '#2d3748',
    margin: '4px 8px'
  },
  userButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    borderRadius: '10px',
    backgroundColor: 'transparent',
    border: '1px solid #2d3748',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#fff'
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
  arrow: {
    fontSize: '10px',
    color: '#718096',
    transition: 'transform 0.2s'
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
  }
};

export default UserSection;