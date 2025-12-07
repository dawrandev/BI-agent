import React from 'react';
import { FileAttachmentProps, FileInfo, API_BASE_URL } from '../../types';

const FileAttachment: React.FC<FileAttachmentProps> = ({ files }) => {
  const getFileUrl = (file: FileInfo): string => {
    if (file.url.startsWith('http')) {
      return file.url;
    }
    const cleanPath = file.url.startsWith('/') ? file.url.substring(1) : file.url;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  const getFileIcon = (type: string): string => {
    const ext = type.toLowerCase();
    const iconMap: Record<string, string> = {
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

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="mt-4 flex flex-col gap-2.5 pt-4 border-t border-border">
      {files.map((file, idx) => {
        const fileUrl = getFileUrl(file);
        const fileIcon = getFileIcon(file.type);

        return (
          <a
            key={idx}
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 p-3.5 bg-primary rounded-xl border border-border no-underline text-text-secondary transition-all cursor-pointer hover:border-accent-purple hover:bg-secondary"
          >
            <div className="w-12 h-12 flex items-center justify-center text-3xl bg-secondary rounded-lg border border-border">
              <span className="leading-none">{fileIcon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold mb-1 text-white overflow-hidden text-ellipsis whitespace-nowrap">
                {file.name}
              </div>
              <div className="text-xs text-text-subtle font-medium">
                {file.type.toUpperCase()} • {formatFileSize(file.size)}
              </div>
            </div>
            <div className="text-xl text-accent-purple font-bold">↓</div>
          </a>
        );
      })}
    </div>
  );
};

export default FileAttachment;
