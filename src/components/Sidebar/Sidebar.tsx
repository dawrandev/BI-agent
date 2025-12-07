import React from 'react';
import ChatHistory from './ChatHistory';
import UserSection from './UserSection';
import { SidebarProps } from '../../types';
import { PlusIcon } from '../Icons';

const Sidebar: React.FC<SidebarProps> = ({
  isLoggedIn,
  username,
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onLogin,
  onLogout,
  onSettings,
  isOpen = true,
}) => {
  return (
    <div
      className={`
        bg-sidebar flex flex-col transition-all duration-300 h-full
        ${isOpen ? 'w-[260px] min-w-[260px]' : 'w-0 min-w-0 overflow-hidden'}
      `}
    >
      <div className="w-[260px] flex flex-col h-full">
        {/* New Chat Button - Top */}
        <div className="p-3">
          <button
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg border border-border bg-transparent text-text-primary cursor-pointer text-sm font-medium transition-all hover:bg-sidebar-hover"
            onClick={onNewChat}
          >
            <PlusIcon className="w-4 h-4" />
            <span>New chat</span>
          </button>
        </div>

        {/* Chat History - Scrollable Middle */}
        <div className="flex-1 overflow-y-auto px-2">
          <ChatHistory
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSelectSession={onSelectSession}
            onDeleteSession={onDeleteSession}
          />
        </div>

        {/* User Section - Bottom */}
        <UserSection
          isLoggedIn={isLoggedIn}
          username={username}
          onLogin={onLogin}
          onLogout={onLogout}
          onSettings={onSettings}
        />
      </div>
    </div>
  );
};

export default Sidebar;
