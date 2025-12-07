import React from 'react';
import { AuthModalProps } from '../../types';

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  isRegisterMode,
  error,
  username,
  password,
  email,
  passwordConfirm,
  onUsernameChange,
  onPasswordChange,
  onEmailChange,
  onPasswordConfirmChange,
  onLogin,
  onRegister,
  onToggleMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">
          {isRegisterMode ? 'Create Account' : 'Login to BI Agent'}
        </h2>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={isRegisterMode ? onRegister : onLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            className="input-field mb-4"
            autoFocus
          />

          {isRegisterMode && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="input-field mb-4"
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="input-field mb-4"
          />

          {isRegisterMode && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={passwordConfirm}
              onChange={(e) => onPasswordConfirmChange(e.target.value)}
              className="input-field mb-4"
            />
          )}

          <button type="submit" className="btn-primary w-full mb-4">
            {isRegisterMode ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="text-center text-sm text-text-subtle">
          {isRegisterMode ? (
            <span>
              Already have an account?{' '}
              <button
                className="bg-transparent border-none text-accent-purple cursor-pointer text-sm font-semibold underline"
                onClick={onToggleMode}
              >
                Login
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                className="bg-transparent border-none text-accent-purple cursor-pointer text-sm font-semibold underline"
                onClick={onToggleMode}
              >
                Register
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
