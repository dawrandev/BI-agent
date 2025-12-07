import React from 'react';
import MessageInput from '../Chat/MessageInput';
import { EmptyStateProps, SUGGESTION_CARDS } from '../../types';

const EmptyState: React.FC<EmptyStateProps> = ({
  error,
  inputMessage,
  isTyping,
  onInputChange,
  onSendMessage,
  onSuggestionClick,
}) => {
  return (
    <div className="flex flex-col items-center text-center w-full max-w-[800px]">
      <div className="text-6xl mb-4">📊</div>
      <h1 className="text-3xl font-bold mb-3 text-white">BI Agent Ready</h1>
      <p className="text-base text-text-muted mb-10 max-w-[600px] leading-relaxed">
        Ask questions about your Odoo data. I can analyze sales, inventory, customers, and
        generate reports.
      </p>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-2 gap-4 max-w-[700px] w-full">
        {SUGGESTION_CARDS.map((card, index) => (
          <button
            key={index}
            className="suggestion-card"
            onClick={() => onSuggestionClick(card.prompt)}
          >
            <div className="text-3xl mb-1">{card.icon}</div>
            <div className="text-base font-semibold text-white">{card.title}</div>
            <div className="text-sm text-text-muted">{card.subtitle}</div>
          </button>
        ))}
      </div>

      {/* Centered Input for empty state */}
      <div className="w-full mt-8">
        {error && <div className="error-banner">{error}</div>}
        <MessageInput
          onSendMessage={onSendMessage}
          disabled={isTyping}
          value={inputMessage}
          onChange={onInputChange}
        />
      </div>
    </div>
  );
};

export default EmptyState;
