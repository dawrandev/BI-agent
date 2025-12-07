import React, { useState } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import FileAttachment from './FileAttachment';
import CopyButton from './CopyButton';
import { ChatMessageProps } from '../../types';

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 items-start pb-6">
        <div className="max-w-[70%]">
          <div className="message-bubble-user">
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
          </div>
        </div>
        <div className="avatar-user mt-0.5">U</div>
      </div>
    );
  }

  return (
    <div
      className="flex justify-start gap-3 items-start pb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="avatar-ai mt-0.5">AI</div>
      <div className="flex-1 max-w-full overflow-hidden">
        <div className="py-1 text-text-secondary text-base leading-relaxed" data-color-mode="dark">
          <MarkdownPreview
            source={message.content}
            style={{
              backgroundColor: 'transparent',
              color: '#e2e8f0',
              fontSize: '15px',
              lineHeight: '1.7',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
            wrapperElement={{
              'data-color-mode': 'dark',
            }}
          />
        </div>

        {message.file_paths && message.file_paths.length > 0 && (
          <FileAttachment files={message.file_paths} />
        )}

        <div
          className={`mt-2 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <CopyButton text={message.content} />
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
