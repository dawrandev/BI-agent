import React, { useState } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import FileAttachment from './FileAttachment';
import CopyButton from './CopyButton';

const ChatMessage = ({ message }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isUser = message.role === 'user';

  if (isUser) {
    // User message - RIGHT aligned, avatar on right
    return (
      <div style={styles.userMessageWrapper}>
        <div style={styles.userMessageContainer}>
          <div style={styles.userMessage}>
            <div style={styles.messageText}>{message.content}</div>
          </div>
        </div>
        <div style={styles.userAvatar}>U</div>
      </div>
    );
  }


  return (
    <div
      style={styles.aiMessageWrapper}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.aiAvatar}>AI</div>
      <div style={styles.aiMessageContainer}>
        <div style={styles.aiMessage} data-color-mode="dark">
          <MarkdownPreview
            source={message.content}
            style={styles.markdownPreview}
            wrapperElement={{
              "data-color-mode": "dark"
            }}
          />
        </div>

        {message.file_paths && message.file_paths.length > 0 && (
          <FileAttachment files={message.file_paths} />
        )}

        <div style={{
          ...styles.copyButtonWrapper,
          opacity: isHovered ? 1 : 0,
          pointerEvents: isHovered ? 'auto' : 'none'
        }}>
          <CopyButton text={message.content} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  // User message - RIGHT aligned
  userMessageWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    alignItems: 'flex-start',
    paddingBottom: '24px'
  },
  userMessageContainer: {
    maxWidth: '70%'
  },
  userMessage: {
    padding: '12px 16px',
    backgroundColor: '#2d3748',
    borderRadius: '18px',
    borderBottomRightRadius: '4px',
    color: '#fff',
    fontSize: '15px',
    lineHeight: '1.6'
  },
  userAvatar: {
    width: '28px',
    height: '28px',
    minWidth: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    marginTop: '2px',
    color: '#fff'
  },

  // AI message - LEFT aligned
  aiMessageWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '12px',
    alignItems: 'flex-start',
    paddingBottom: '24px'
  },
  aiMessageContainer: {
    flex: 1,
    maxWidth: '100%',
    overflow: 'hidden'
  },
  aiMessage: {
    padding: '4px 0',
    color: '#e2e8f0',
    fontSize: '15px',
    lineHeight: '1.7'
  },
  aiAvatar: {
    width: '28px',
    height: '28px',
    minWidth: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    marginTop: '2px',
    color: '#fff'
  },

  messageText: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  markdownPreview: {
    backgroundColor: 'transparent',
    color: '#e2e8f0',
    fontSize: '15px',
    lineHeight: '1.7',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  copyButtonWrapper: {
    marginTop: '8px',
    transition: 'opacity 0.2s'
  }
};

export default ChatMessage;
