import React, { useState } from 'react';
import { UserSectionProps } from '../../types';
import { SettingsIcon, LogoutIcon, EllipsisIcon } from '../Icons';

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
      <div className="p-3 border-t border-border">
        <button
          className="w-full py-3 rounded-lg border-none bg-accent hover:bg-accent-hover text-white text-sm font-medium cursor-pointer transition-all"
          onClick={onLogin}
        >
          Log in
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-border p-2 relative">
      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Overlay to close dropdown when clicking outside */}
          <div
            className="fixed inset-0 z-[998]"
            onClick={() => setIsDropdownOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute bottom-16 left-2 right-2 dropdown-menu z-[999]">
            <button
              className="dropdown-item"
              onClick={() => {
                setIsDropdownOpen(false);
                onSettings();
              }}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <div className="h-px bg-border mx-1 my-1" />

            <button
              className="dropdown-item"
              onClick={() => {
                setIsDropdownOpen(false);
                onLogout();
              }}
            >
              <LogoutIcon className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </>
      )}

      {/* User Button */}
      <button
        className="w-full flex items-center gap-3 p-3 rounded-lg bg-transparent cursor-pointer transition-all text-left hover:bg-sidebar-hover"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
          {username.charAt(0).toUpperCase()}
        </div>

        {/* Username */}
        <span className="flex-1 text-sm text-text-primary truncate">
          {username}
        </span>

        {/* Ellipsis icon */}
        <EllipsisIcon className="w-5 h-5 text-text-muted" />
      </button>
    </div>
  );
};

export default UserSection;
