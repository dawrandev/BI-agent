import React from 'react';
import ChatMessage from './ChatMessage';
import ThinkingIndicator from './ThinkingIndicator';
import { ChatViewProps } from '../../types';

const ChatView: React.FC<ChatViewProps> = ({
  messages,
  thinkingSteps,
  streamingContent,
  isStreaming,
  isTyping,
  messagesEndRef,
}) => {
  return (
    <div className="flex-1 flex flex-col gap-6 max-w-chat mx-auto w-full px-6">
      {messages.map((message, index) => (
        <React.Fragment key={message.id || index}>
          {/* Show thinking steps BEFORE assistant message */}
          {message.role === 'assistant' &&
            message.thinkingSteps &&
            message.thinkingSteps.length > 0 && (
              <ThinkingIndicator steps={message.thinkingSteps} isStreaming={false} />
            )}
          <ChatMessage message={message} />
        </React.Fragment>
      ))}

      {/* Live thinking steps during streaming */}
      {isStreaming && <ThinkingIndicator steps={thinkingSteps} isStreaming={true} />}

      {/* Streaming content */}
      {isStreaming && streamingContent && (
        <div className="flex justify-start gap-3 items-start pb-6">
          <div className="avatar-ai">AI</div>
          <div className="flex-1 py-1 text-text-secondary text-base leading-relaxed">
            <div className="prose-dark">{streamingContent}</div>
          </div>
        </div>
      )}

      {/* Basic typing indicator */}
      {isTyping && !isStreaming && (
        <div className="flex justify-start gap-3 items-start pb-6">
          <div className="avatar-ai">AI</div>
          <div className="flex-1 py-1 text-text-secondary text-base leading-relaxed">
            <div className="flex gap-1.5 items-center py-1">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatView;
