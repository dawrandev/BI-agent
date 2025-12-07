import React, { useRef, useEffect, useState } from 'react';
import { MessageInputProps } from '../../types';

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  value,
  onChange,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = newHeight + 'px';
    }
  }, [value]);

  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (value && value.trim() && !disabled) {
      onSendMessage(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canSend = value && value.trim() && !disabled;

  return (
    <div className="w-full max-w-chat mx-auto px-6 pb-6 pt-4">
      <div
        className={`
          flex items-end gap-3 p-3 px-4 rounded-3xl border bg-secondary transition-all
          ${isFocused ? 'border-accent-purple shadow-focus' : 'border-border'}
        `}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask about your business data..."
          className="flex-1 py-2 border-none bg-transparent text-white text-base leading-normal outline-none resize-none min-h-[24px] max-h-[200px] font-sans overflow-auto placeholder:text-text-subtle"
          disabled={disabled}
          rows={1}
        />
        <button
          onClick={handleSubmit}
          className={`
            w-10 h-10 rounded-full border-none bg-gradient-accent text-white
            flex items-center justify-center transition-all flex-shrink-0
            ${canSend ? 'opacity-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
          `}
          disabled={!canSend}
          type="button"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        </button>
      </div>
      <p className="mt-2 text-xs text-text-muted text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
};

export default MessageInput;
