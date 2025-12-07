import React from 'react';
import { ChatHistoryProps } from '../../types';

const ChatHistory: React.FC<ChatHistoryProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
}) => {
  if (sessions.length === 0) {
    return (
      <div className="mt-6 px-4 text-sm text-text-subtle leading-relaxed">
        Please login to see your chat history
      </div>
    );
  }

  return (
    <div className="mt-6">
      {sessions.map((session) => (
        <div
          key={session.id}
          className={`
            flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer
            transition-colors mb-1
            ${currentSessionId === session.id ? 'bg-border' : 'bg-transparent hover:bg-border/50'}
          `}
          onClick={() => onSelectSession(session.id)}
        >
          <span className="text-sm overflow-hidden text-ellipsis whitespace-nowrap flex-1 text-text-tertiary">
            {session.title || 'Untitled Chat'}
          </span>
          <button
            className="bg-transparent border-none text-text-subtle text-2xl cursor-pointer px-1 opacity-60 transition-opacity hover:opacity-100"
            onClick={(e) => onDeleteSession(session.id, e)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
