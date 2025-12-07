import React, { useState } from 'react';
import { CopyButtonProps } from '../../types';

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        inline-flex items-center gap-1.5 px-3.5 py-2
        border rounded-lg text-text-secondary text-sm font-medium
        cursor-pointer transition-all outline-none font-sans
        ${copied
          ? 'bg-success-bg border-success'
          : 'bg-secondary border-border hover:bg-border hover:border-accent-purple'
        }
      `}
    >
      <span className="text-sm leading-none">
        {copied ? '✓' : '📋'}
      </span>
      <span className="select-none leading-none">
        {copied ? 'Copied' : 'Copy'}
      </span>
    </button>
  );
};

export default CopyButton;
