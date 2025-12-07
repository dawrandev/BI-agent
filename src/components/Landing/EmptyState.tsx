import React from 'react';
import MessageInput from '../Chat/MessageInput';
import { EmptyStateProps, SUGGESTION_CARDS } from '../../types';
import { SparklesIcon } from '../Icons';

const EmptyState: React.FC<EmptyStateProps> = ({
  error,
  inputMessage,
  isTyping,
  onInputChange,
  onSendMessage,
  onSuggestionClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto px-4">
      {/* Logo/Icon */}
      <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-8">
        <SparklesIcon className="w-8 h-8 text-white" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold text-text-primary mb-2">
        How can I help you today?
      </h1>

      <p className="text-base text-text-muted mb-8 text-center max-w-lg">
        Ask questions about your business data. I can analyze sales, inventory, customers, and generate reports.
      </p>

      {/* Suggestion cards - 2x2 grid */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-2xl">
        {SUGGESTION_CARDS.map((card, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(card.prompt)}
            className="suggestion-card"
          >
            <span className="text-2xl flex-shrink-0">{card.icon}</span>
            <div className="text-left">
              <div className="text-sm font-medium text-text-primary">
                {card.title}
              </div>
              <div className="text-xs text-text-muted mt-0.5">
                {card.subtitle}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Input at bottom */}
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
