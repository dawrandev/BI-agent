import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import FileAttachment from './FileAttachment';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const API_BASE_URL = 'https://localagent.diyarbek.uz';

  const processImageUrl = (url) => {
    if (url.startsWith('http')) return url;
    const cleanPath = url.startsWith('/') ? url.substring(1) : url;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  return (
    <div style={isUser ? styles.userMessageWrapper : styles.aiMessageWrapper}>
      {!isUser && <div style={styles.aiAvatar}>AI</div>}

      <div style={isUser ? styles.userMessage : styles.aiMessage}>
        {isUser ? (
          <div style={styles.messageText}>{message.content}</div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({node, ...props}) => {
                const imageUrl = processImageUrl(props.src);
                return (
                  <img
                    {...props}
                    src={imageUrl}
                    alt={props.alt || 'Image'}
                    style={styles.chartImage}
                  />
                );
              },
              a: ({node, ...props}) => (
                <a {...props} target="_blank" rel="noopener noreferrer" />
              )
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}

        {message.file_paths && message.file_paths.length > 0 && (
          <FileAttachment files={message.file_paths} />
        )}
      </div>

      {isUser && <div style={styles.userAvatar}>U</div>}
    </div>
  );
};

const styles = {
  userMessageWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    alignItems: 'flex-start'
  },
  aiMessageWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '12px',
    alignItems: 'flex-start'
  },
  userMessage: {
    maxWidth: '65%',
    padding: '14px 18px',
    borderRadius: '18px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    fontSize: '15px',
    lineHeight: '1.5'
  },
  aiMessage: {
    maxWidth: '80%',
    padding: '16px 20px',
    borderRadius: '18px',
    backgroundColor: '#1a1f2e',
    border: '1px solid #2d3748',
    color: '#e2e8f0',
    fontSize: '15px',
    lineHeight: '1.6'
  },
  aiAvatar: {
    width: '36px',
    height: '36px',
    minWidth: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    marginTop: '4px',
    color: '#fff'
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    minWidth: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    marginTop: '4px',
    color: '#fff'
  },
  messageText: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  chartImage: {
    width: '100%',
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '12px',
    border: '1px solid #2d3748',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    backgroundColor: '#fff',
    display: 'block',
    margin: '16px 0'
  }
};

export default ChatMessage;
