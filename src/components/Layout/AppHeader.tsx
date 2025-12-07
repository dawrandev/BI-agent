import React from 'react';
import { AppHeaderProps } from '../../types';
import { SidebarIcon, MenuIcon } from '../Icons';

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  sidebarOpen,
  onToggleSidebar,
}) => {
  return (
    <div className="h-14 flex items-center justify-between px-4 bg-primary border-b border-border">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-secondary text-text-muted hover:text-text-primary transition-all"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? (
            <SidebarIcon className="w-5 h-5" />
          ) : (
            <MenuIcon className="w-5 h-5" />
          )}
        </button>
        <h1 className="text-base font-normal text-text-primary">
          {title || 'BI Agent'}
        </h1>
      </div>
    </div>
  );
};

export default AppHeader;
