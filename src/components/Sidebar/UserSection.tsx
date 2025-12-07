import React, { useState } from 'react';
import { UserSectionProps } from '../../types';

const UserSection: React.FC<UserSectionProps> = ({
  isLoggedIn,
  username,
  onLogin,
  onLogout,
  onSettings,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="p-4 border-t border-border relative">
        <button
          className="w-full py-3 rounded-lg border-none bg-gradient-accent text-white text-sm font-semibold cursor-pointer"
          onClick={onLogin}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-border relative">
      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Overlay to close dropdown when clicking outside */}
          <div
            className="fixed inset-0 z-[998] bg-transparent"
            onClick={() => setIsDropdownOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute bottom-20 left-4 right-4 dropdown-menu">
            <button
              className="dropdown-item"
              onClick={() => {
                setIsDropdownOpen(false);
                onSettings();
              }}
            >
              <span className="text-lg">⚙️</span>
              <span>Settings</span>
            </button>

            <div className="h-px bg-border mx-2 my-1" />

            <button
              className="dropdown-item"
              onClick={() => {
                setIsDropdownOpen(false);
                onLogout();
              }}
            >
              <span className="text-lg">→</span>
              <span>Logout</span>
            </button>
          </div>
        </>
      )}

      {/* User Button - Click to toggle dropdown */}
      <button
        className="w-full flex items-center justify-between p-3 rounded-lg bg-transparent border border-border cursor-pointer transition-all text-white hover:bg-border/30"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="flex items-center gap-2.5">
          <div className="avatar-user avatar-lg">
            {username.substring(0, 2).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-white">{username}</span>
        </div>

        {/* Dropdown Arrow */}
        <span
          className={`text-[10px] text-text-subtle transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          ▼
        </span>
      </button>
    </div>
  );
};

export default UserSection;
