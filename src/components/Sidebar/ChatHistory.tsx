import React from 'react';
import { ChatHistoryProps, Session } from '../../types';
import { ChatBubbleIcon, TrashIcon } from '../Icons';

// Helper to group sessions by date
const groupSessionsByDate = (sessions: Session[]): Record<string, Session[]> => {
  const groups: Record<string, Session[]> = {};
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  sessions.forEach((session) => {
    const sessionDate = new Date(session.created_at || session.updated_at || Date.now());
    const sessionDay = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());

    let group: string;
    if (sessionDay.getTime() >= today.getTime()) {
      group = 'Today';
    } else if (sessionDay.getTime() >= yesterday.getTime()) {
      group = 'Yesterday';
    } else if (sessionDay.getTime() >= weekAgo.getTime()) {
      group = 'Previous 7 Days';
    } else {
      group = 'Older';
    }

    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(session);
  });

  return groups;
};

const ChatHistory: React.FC<ChatHistoryProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
}) => {
  if (sessions.length === 0) {
    return (
      <div className="mt-4 px-3 text-sm text-text-muted">
        No conversations yet
      </div>
    );
  }

  const groupedSessions = groupSessionsByDate(sessions);
  const groupOrder = ['Today', 'Yesterday', 'Previous 7 Days', 'Older'];

  return (
    <div className="space-y-4 mt-2">
      {groupOrder.map((group) => {
        const groupSessions = groupedSessions[group];
        if (!groupSessions || groupSessions.length === 0) return null;

        return (
          <div key={group}>
            {/* Date group label */}
            <div className="px-3 py-2 text-xs font-medium text-text-muted">
              {group}
            </div>

            {/* Sessions in group */}
            {groupSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 rounded-lg
                  text-sm text-left transition-all group cursor-pointer border-none
                  ${currentSessionId === session.id
                    ? 'bg-sidebar-hover text-text-primary'
                    : 'bg-transparent text-text-secondary hover:bg-sidebar-hover hover:text-text-primary'}
                `}
              >
                <ChatBubbleIcon className="w-4 h-4 text-text-muted flex-shrink-0" />
                <span className="flex-1 truncate">
                  {session.title || 'New chat'}
                </span>

                {/* Delete button - appears on hover */}
                <button
                  onClick={(e) => onDeleteSession(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-primary rounded transition-all border-none bg-transparent cursor-pointer"
                >
                  <TrashIcon className="w-4 h-4 text-text-muted hover:text-error" />
                </button>
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default ChatHistory;
