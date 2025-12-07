import React from 'react';
import ChatMessage from './ChatMessage';
import ThinkingIndicator from './ThinkingIndicator';
import { ChatViewProps } from '../../types';
import { SparklesIcon } from '../Icons';

const ChatView: React.FC<ChatViewProps> = ({
  messages,
  thinkingSteps,
  streamingContent,
  isStreaming,
  isTyping,
  messagesEndRef,
}) => {
  return (
    <div className="flex-1 flex flex-col w-full">
      {messages.map((message, index) => (
        <React.Fragment key={message.id || index}>
          {/* Show thinking steps BEFORE assistant message */}
          {message.role === 'assistant' &&
            message.thinkingSteps &&
            message.thinkingSteps.length > 0 && (
              <div className="max-w-3xl mx-auto w-full px-4">
                <ThinkingIndicator steps={message.thinkingSteps} isStreaming={false} />
              </div>
            )}
          <ChatMessage message={message} />
        </React.Fragment>
      ))}

      {/* Live thinking steps during streaming */}
      {isStreaming && thinkingSteps.length > 0 && (
        <div className="max-w-3xl mx-auto w-full px-4">
          <ThinkingIndicator steps={thinkingSteps} isStreaming={true} />
        </div>
      )}

      {/* Streaming content */}
      {isStreaming && streamingContent && (
        <div className="w-full py-6">
          <div className="max-w-3xl mx-auto px-4 flex gap-4">
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-text-primary mb-1">
                BI Agent
              </div>
              <div className="text-text-secondary text-base leading-relaxed whitespace-pre-wrap">
                {streamingContent}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Basic typing indicator */}
      {isTyping && !isStreaming && (
        <div className="w-full py-6">
          <div className="max-w-3xl mx-auto px-4 flex gap-4">
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-text-primary mb-1">
                BI Agent
              </div>
              <div className="flex gap-1.5 items-center py-1">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatView;
