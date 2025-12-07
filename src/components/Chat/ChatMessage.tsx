import React, { useState } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import FileAttachment from './FileAttachment';
import CopyButton from './CopyButton';
import { ChatMessageProps } from '../../types';
import { SparklesIcon } from '../Icons';

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isUser = message.role === 'user';

  if (isUser) {
    // User message - right aligned with subtle bubble
    return (
      <div className="w-full py-3">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="flex justify-end">
            <div className="max-w-[75%]">
              <div className="bg-secondary rounded-2xl px-4 py-3">
                <p className="text-text-primary text-base whitespace-pre-wrap break-words leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AI message - clean, no box
  return (
    <div
      className="w-full py-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="flex gap-4">
          {/* AI Avatar */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Message content */}
            <div className="text-text-primary text-base leading-relaxed">
              <div data-color-mode="dark">
                <MarkdownPreview
                  source={message.content}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#ececec',
                    fontSize: '15px',
                    lineHeight: '1.75',
                    fontFamily: 'inherit',
                  }}
                  wrapperElement={{
                    'data-color-mode': 'dark',
                  }}
                />
              </div>
            </div>

            {/* Files attachment */}
            {message.files && message.files.length > 0 && (
              <div className="mt-4">
                <FileAttachment files={message.files} />
              </div>
            )}

            {/* Action buttons - show on hover */}
            <div
              className={`mt-3 transition-opacity duration-200 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <CopyButton text={message.content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
