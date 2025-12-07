import React, { useState, useEffect } from 'react';
import { DatabaseConfig } from '../../../types';
import { CheckIcon } from '../../Icons';

interface DatabaseSettingsProps {
  databaseConfig: DatabaseConfig | null;
  onSave: (data: DatabaseConfig) => Promise<void>;
  isSaving: boolean;
}

const DatabaseSettings: React.FC<DatabaseSettingsProps> = ({
  databaseConfig,
  onSave,
  isSaving,
}) => {
  const [formData, setFormData] = useState<DatabaseConfig>({
    host: '',
    port: 5432,
    username: '',
    password: '',
    database_name: '',
  });

  useEffect(() => {
    if (databaseConfig) {
      setFormData({
        ...databaseConfig,
        password: '', // Don't show password
      });
    }
  }, [databaseConfig]);

  const handleChange = (field: keyof DatabaseConfig, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await onSave(formData);
  };

  return (
    <div>
      <h3 className="settings-section-title">Database Connection</h3>
      <p className="text-text-muted text-sm mb-6">
        Configure your database connection for SQL queries and data analysis.
      </p>

      {databaseConfig?.is_connected && (
        <div className="flex items-center gap-2 mb-6 p-3 bg-success-bg rounded-lg">
          <CheckIcon className="w-4 h-4 text-success" />
          <span className="text-sm text-success">Database connected</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="settings-section col-span-2 sm:col-span-1">
          <label className="settings-label">Host</label>
          <input
            type="text"
            placeholder="localhost or IP address"
            value={formData.host}
            onChange={(e) => handleChange('host', e.target.value)}
            className="input-field"
          />
        </div>

        <div className="settings-section col-span-2 sm:col-span-1">
          <label className="settings-label">Port</label>
          <input
            type="number"
            placeholder="5432"
            value={formData.port}
            onChange={(e) => handleChange('port', parseInt(e.target.value) || 5432)}
            className="input-field"
          />
        </div>
      </div>

      <div className="settings-section">
        <label className="settings-label">Database Name</label>
        <input
          type="text"
          placeholder="my_database"
          value={formData.database_name}
          onChange={(e) => handleChange('database_name', e.target.value)}
          className="input-field"
        />
      </div>

      <div className="settings-section">
        <label className="settings-label">Username</label>
        <input
          type="text"
          placeholder="postgres"
          value={formData.username}
          onChange={(e) => handleChange('username', e.target.value)}
          className="input-field"
        />
      </div>

      <div className="settings-section">
        <label className="settings-label">Password</label>
        <input
          type="password"
          placeholder={databaseConfig ? '••••••••' : 'Enter password'}
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          className="input-field"
        />
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="btn-primary"
        >
          {isSaving ? 'Saving...' : 'Save & Test Connection'}
        </button>
      </div>
    </div>
  );
};

export default DatabaseSettings;
