import React from 'react';
import { ConfigModalProps, ConfigFormData } from '../../types';

const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  error,
  configForm,
  onConfigFormChange,
  onSubmit,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleChange = (field: keyof ConfigFormData, value: string | boolean) => {
    onConfigFormChange({ [field]: value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Odoo Configuration</h2>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={onSubmit}>
          <input
            type="url"
            placeholder="Odoo URL (e.g., https://mycompany.odoo.com)"
            value={configForm.odoo_url}
            onChange={(e) => handleChange('odoo_url', e.target.value)}
            className="input-field mb-4"
          />

          <input
            type="text"
            placeholder="Database Name"
            value={configForm.odoo_db}
            onChange={(e) => handleChange('odoo_db', e.target.value)}
            className="input-field mb-4"
          />

          <input
            type="text"
            placeholder="Odoo Username"
            value={configForm.odoo_username}
            onChange={(e) => handleChange('odoo_username', e.target.value)}
            className="input-field mb-4"
          />

          <input
            type="password"
            placeholder="Odoo Password"
            value={configForm.odoo_password}
            onChange={(e) => handleChange('odoo_password', e.target.value)}
            className="input-field mb-4"
          />

          <input
            type="password"
            placeholder="Telegram Bot Token"
            value={configForm.telegram_bot_token}
            onChange={(e) => handleChange('telegram_bot_token', e.target.value)}
            className="input-field mb-4"
          />

          <input
            type="password"
            placeholder="OpenAI API Key"
            value={configForm.openai_api_key}
            onChange={(e) => handleChange('openai_api_key', e.target.value)}
            className="input-field mb-4"
          />

          <div className="flex gap-4 mb-4 text-text-tertiary">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={configForm.is_active}
                onChange={(e) => handleChange('is_active', e.target.checked)}
                className="w-4 h-4"
              />
              Active
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={configForm.auto_start}
                onChange={(e) => handleChange('auto_start', e.target.checked)}
                className="w-4 h-4"
              />
              Auto-start
            </label>
          </div>

          <button type="submit" className="btn-primary w-full mb-4">
            Save Configuration
          </button>
        </form>

        <button
          className="bg-transparent border-none text-accent-purple cursor-pointer text-sm font-semibold underline w-full text-center"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ConfigModal;
