import React, { useRef, useEffect, useState } from 'react';
import { MessageInputProps } from '../../types';
import { ArrowUpIcon } from '../Icons';

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
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      <div
        className={`
          relative flex items-end gap-3 p-3 rounded-2xl border transition-all
          ${isFocused ? 'border-accent shadow-focus bg-secondary' : 'border-border bg-secondary'}
        `}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Message BI Agent..."
          className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted resize-none outline-none text-base max-h-52 min-h-6 py-1.5 font-sans"
          disabled={disabled}
          rows={1}
        />

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={!canSend}
          className={`
            p-2 rounded-lg transition-all flex-shrink-0 border-none cursor-pointer
            ${canSend
              ? 'bg-accent text-white hover:bg-accent-hover'
              : 'bg-secondary text-text-muted cursor-not-allowed'}
          `}
          type="button"
          aria-label="Send message"
        >
          <ArrowUpIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Footer text */}
      <p className="mt-2 text-xs text-text-muted text-center">
        BI Agent can make mistakes. Consider checking important information.
      </p>
    </div>
  );
};

export default MessageInput;
