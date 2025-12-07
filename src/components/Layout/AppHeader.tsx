import React from 'react';
import { AppHeaderProps } from '../../types';

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  isLoggedIn,
  sidebarOpen,
  onToggleSidebar,
}) => {
  return (
    <div className="h-[70px] border-b border-border flex items-center justify-between px-8 bg-secondary">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-transparent text-text-muted cursor-pointer transition-all hover:bg-border hover:text-white"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {sidebarOpen ? (
              <path d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
        <span className="font-semibold text-base text-white">{title}</span>
      </div>

      {isLoggedIn && (
        <div className="status-badge">
          <div className="status-dot" />
          <span>Connected</span>
        </div>
      )}
    </div>
  );
};

export default AppHeader;
