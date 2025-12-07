import React, { useState } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import FileAttachment from './FileAttachment';
import CopyButton from './CopyButton';
import { ChatMessageProps } from '../../types';
import { SparklesIcon } from '../Icons';

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isUser = message.role === 'user';

  return (
    <div
      className="w-full py-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-3xl mx-auto px-4 flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-medium">
              U
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Role label */}
          <div className="text-sm font-semibold text-text-primary mb-1">
            {isUser ? 'You' : 'BI Agent'}
          </div>

          {/* Message content */}
          <div className="text-text-secondary text-base leading-relaxed">
            {isUser ? (
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            ) : (
              <div data-color-mode="dark">
                <MarkdownPreview
                  source={message.content}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#c5c5d2',
                    fontSize: '15px',
                    lineHeight: '1.7',
                    fontFamily: 'inherit',
                  }}
                  wrapperElement={{
                    'data-color-mode': 'dark',
                  }}
                />
              </div>
            )}
          </div>

          {/* Files attachment */}
          {message.files && message.files.length > 0 && (
            <FileAttachment files={message.files} />
          )}

          {/* Action buttons - show on hover for AI messages */}
          {!isUser && (
            <div
              className={`mt-3 transition-opacity duration-200 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <CopyButton text={message.content} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
