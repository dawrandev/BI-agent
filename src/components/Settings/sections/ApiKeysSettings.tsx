import React from 'react';
import { AgentConfig, ConfigFormData } from '../../../types';
import { CheckIcon } from '../../Icons';

interface ApiKeysSettingsProps {
  config: AgentConfig | null;
  configForm: ConfigFormData;
  onConfigFormChange: (updates: Partial<ConfigFormData>) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

const ApiKeysSettings: React.FC<ApiKeysSettingsProps> = ({
  config,
  configForm,
  onConfigFormChange,
  onSave,
  isSaving,
}) => {
  return (
    <div>
      <h3 className="settings-section-title">API Keys</h3>
      <p className="text-text-muted text-sm mb-6">
        Configure your API keys for external services. These are stored securely and never exposed.
      </p>

      <div className="settings-section">
        <div className="flex items-center justify-between mb-2">
          <label className="settings-label mb-0">Telegram Bot Token</label>
          {config?.has_telegram_token && (
            <span className="flex items-center gap-1 text-xs text-success">
              <CheckIcon className="w-3 h-3" />
              Configured
            </span>
          )}
        </div>
        <input
          type="password"
          placeholder={config?.has_telegram_token ? '••••••••••••••••' : 'Enter your Telegram Bot Token'}
          value={configForm.telegram_bot_token}
          onChange={(e) => onConfigFormChange({ telegram_bot_token: e.target.value })}
          className="input-field"
        />
        <p className="text-xs text-text-muted mt-2">
          Get your bot token from @BotFather on Telegram
        </p>
      </div>

      <div className="settings-section">
        <div className="flex items-center justify-between mb-2">
          <label className="settings-label mb-0">Anthropic API Key</label>
          {config?.has_anthropic_key && (
            <span className="flex items-center gap-1 text-xs text-success">
              <CheckIcon className="w-3 h-3" />
              Configured
            </span>
          )}
        </div>
        <input
          type="password"
          placeholder={config?.has_anthropic_key ? '••••••••••••••••' : 'Enter your Anthropic API Key'}
          value={configForm.anthropic_api_key}
          onChange={(e) => onConfigFormChange({ anthropic_api_key: e.target.value })}
          className="input-field"
        />
        <p className="text-xs text-text-muted mt-2">
          Get your API key from console.anthropic.com
        </p>
      </div>

      <div className="settings-section">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={configForm.is_active}
              onChange={(e) => onConfigFormChange({ is_active: e.target.checked })}
              className="w-4 h-4 accent-accent"
            />
            <span className="text-sm text-text-secondary">Agent Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={configForm.auto_start}
              onChange={(e) => onConfigFormChange({ auto_start: e.target.checked })}
              className="w-4 h-4 accent-accent"
            />
            <span className="text-sm text-text-secondary">Auto-start</span>
          </label>
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={isSaving}
        className="btn-primary mt-4"
      >
        {isSaving ? 'Saving...' : 'Save API Keys'}
      </button>
    </div>
  );
};

export default ApiKeysSettings;
