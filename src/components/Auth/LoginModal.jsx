import React, { useState } from 'react';

const LoginModal = ({ onLogin, onClose, onSwitchToRegister, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h2 style={styles.modalTitle}>Login to BI Agent</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.modalInput}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.modalInput}
          />
          <button type="submit" style={styles.modalButton}>
            Login
          </button>
        </form>
        <div style={styles.toggleAuth}>
          Don't have an account?{' '}
          <button style={styles.toggleButton} onClick={onSwitchToRegister}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#1a1f2e',
    padding: '40px',
    borderRadius: '16px',
    border: '1px solid #2d3748',
    minWidth: '420px'
  },
  modalTitle: {
    fontSize: '26px',
    fontWeight: '700',
    marginBottom: '28px',
    textAlign: 'center',
    color: '#fff'
  },
  modalInput: {
    width: '100%',
    padding: '16px 20px',
    borderRadius: '12px',
    border: '1px solid #2d3748',
    backgroundColor: '#0f1419',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    marginBottom: '16px'
  },
  modalButton: {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '16px'
  },
  toggleAuth: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#718096'
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'underline'
  },
  error: {
    backgroundColor: '#dc2626',
    color: '#fff',
    padding: '14px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'center'
  }
};

export default LoginModal;