import React from 'react';
import { FileAttachmentProps, API_BASE_URL } from '../../types';

const FileAttachment: React.FC<FileAttachmentProps> = ({ files }) => {
  const getFileUrl = (filePath: string): string => {
    if (filePath.startsWith('http')) {
      return filePath;
    }
    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  const getFileName = (filePath: string): string => {
    return filePath.split('/').pop() || 'Download File';
  };

  const getFileType = (filePath: string): string => {
    const extension = filePath.split('.').pop()?.toUpperCase();
    return extension || 'FILE';
  };

  const getFileIcon = (filePath: string): string => {
    const ext = filePath.split('.').pop()?.toLowerCase();
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
    return iconMap[ext || ''] || '📎';
  };

  return (
    <div className="mt-4 flex flex-col gap-2.5 pt-4 border-t border-border">
      {files.map((file, idx) => {
        const filePath = typeof file === 'string' ? file : (file as { url: string }).url;
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
            className="flex items-center gap-3.5 p-3.5 bg-primary rounded-xl border border-border no-underline text-text-secondary transition-all cursor-pointer hover:border-accent-purple hover:bg-secondary"
          >
            <div className="w-12 h-12 flex items-center justify-center text-3xl bg-secondary rounded-lg border border-border">
              <span className="leading-none">{fileIcon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold mb-1 text-white overflow-hidden text-ellipsis whitespace-nowrap">
                {fileName}
              </div>
              <div className="text-xs text-text-subtle font-medium">
                {fileType}
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
