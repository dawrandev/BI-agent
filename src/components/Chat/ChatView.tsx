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
              <div className="w-full py-2">
                <div className="max-w-5xl mx-auto px-4 md:px-8">
                  <ThinkingIndicator steps={message.thinkingSteps} isStreaming={false} />
                </div>
              </div>
            )}
          <ChatMessage message={message} />
        </React.Fragment>
      ))}

      {/* Live thinking steps during streaming */}
      {isStreaming && thinkingSteps.length > 0 && (
        <div className="w-full py-2">
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <ThinkingIndicator steps={thinkingSteps} isStreaming={true} />
          </div>
        </div>
      )}

      {/* Streaming content - clean, no box */}
      {isStreaming && streamingContent && (
        <div className="w-full py-5">
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-text-primary text-base leading-relaxed whitespace-pre-wrap">
                  {streamingContent}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Basic typing indicator - clean */}
      {isTyping && !isStreaming && (
        <div className="w-full py-5">
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex gap-1.5 items-center py-2">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
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
