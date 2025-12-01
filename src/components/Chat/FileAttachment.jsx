import React from 'react';

const FileAttachment = ({ files }) => {
  const API_BASE_URL = 'https://localagent.diyarbek.uz';
  
  // Convert file paths array to proper URLs
  const getFileUrl = (filePath) => {
    if (filePath.startsWith('http')) {
      return filePath;
    }
    // Remove leading slash if exists
    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  const getFileName = (filePath) => {
    return filePath.split('/').pop() || 'Download File';
  };

  const getFileType = (filePath) => {
    const extension = filePath.split('.').pop()?.toUpperCase();
    return extension || 'FILE';
  };

  const getFileIcon = (filePath) => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    const iconMap = {
      'pdf': '📄',
      'xlsx': '📊',
      'xls': '📊',
      'csv': '📊',
      'doc': '📝',
      'docx': '📝',
      'txt': '📝',
      'png': '🖼️',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'zip': '📦',
    };
    return iconMap[ext] || '📎';
  };

  return (
    <div style={styles.filesList}>
      {files.map((file, idx) => {
        const filePath = typeof file === 'string' ? file : file.url;
        const fileUrl = getFileUrl(filePath);
        const fileName = getFileName(filePath);
        const fileType = getFileType(filePath);
        const fileIcon = getFileIcon(filePath);

        return (
          <a 
            key={idx} 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.fileCard}
          >
            <div style={styles.fileIcon}>
              <span style={styles.iconText}>{fileIcon}</span>
            </div>
            <div style={styles.fileInfo}>
              <div style={styles.fileName}>{fileName}</div>
              <div style={styles.fileType}>{fileType}</div>
            </div>
            <div style={styles.downloadIcon}>↓</div>
          </a>
        );
      })}
    </div>
  );
};

const styles = {
  filesList: {
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    paddingTop: '16px',
    borderTop: '1px solid #2d3748'
  },
  fileCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 16px',
    backgroundColor: '#0f1419',
    borderRadius: '12px',
    border: '1px solid #2d3748',
    textDecoration: 'none',
    color: '#e2e8f0',
    transition: 'all 0.2s',
    cursor: 'pointer'
  },
  fileIcon: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    backgroundColor: '#1a1f2e',
    borderRadius: '10px',
    border: '1px solid #2d3748'
  },
  iconText: {
    lineHeight: 1
  },
  fileInfo: {
    flex: 1,
    minWidth: 0
  },
  fileName: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '4px',
    color: '#fff',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  fileType: {
    fontSize: '12px',
    color: '#718096',
    fontWeight: '500'
  },
  downloadIcon: {
    fontSize: '20px',
    color: '#667eea',
    fontWeight: 'bold'
  }
};

export default FileAttachment;