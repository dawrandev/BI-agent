import React from 'react';
import ChatHistory from './ChatHistory';
import UserSection from './UserSection';
import { SidebarProps } from '../../types';

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
        bg-secondary flex flex-col transition-all duration-300
        ${isOpen ? 'w-sidebar min-w-sidebar border-r border-border' : 'w-0 min-w-0 p-0 border-none overflow-hidden'}
      `}
    >
      <div className="w-sidebar flex flex-col h-full">
        {/* Logo */}
        <div className="p-5 border-b border-border flex items-center gap-3">
          <div className="w-7 h-7 bg-gradient-accent rounded-md flex-shrink-0" />
          <span className="font-bold text-lg tracking-tight text-white whitespace-nowrap">
            BI Agent
          </span>
        </div>

        {/* Menu Items */}
        <div className="flex-1 p-4 overflow-y-auto">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-transparent text-white cursor-pointer text-sm mb-2 font-medium transition-all whitespace-nowrap hover:bg-border"
            onClick={onNewChat}
          >
            <span className="text-xl font-bold">+</span>
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
          onSettings={onSettings}
        />
      </div>
    </div>
  );
};

export default Sidebar;
