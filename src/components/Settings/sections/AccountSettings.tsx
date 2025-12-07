import React from 'react';
import { LogoutIcon } from '../../Icons';

interface AccountSettingsProps {
  username: string;
  onLogout: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({
  username,
  onLogout,
}) => {
  return (
    <div>
      <h3 className="settings-section-title">Account</h3>

      <div className="settings-section">
        <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg border border-border">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white text-lg font-medium">
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-text-primary font-medium">{username}</div>
            <div className="text-sm text-text-muted">Logged in</div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h4 className="text-sm font-medium text-text-primary mb-3">Danger Zone</h4>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-error text-error hover:bg-error/10 transition-all text-sm"
        >
          <LogoutIcon className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;
