import React from 'react';
import { ConfigFormData } from '../../../types';

interface AIConfigSettingsProps {
  configForm: ConfigFormData;
  onConfigFormChange: (updates: Partial<ConfigFormData>) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

const MODEL_OPTIONS = [
  { value: 'claude-haiku-3-5-20241022', label: 'Haiku (Fast, Cheap)' },
  { value: 'claude-sonnet-4-20250514', label: 'Sonnet (Balanced)' },
  { value: 'claude-opus-4-20250514', label: 'Opus (Smart, Expensive)' },
];

const AIConfigSettings: React.FC<AIConfigSettingsProps> = ({
  configForm,
  onConfigFormChange,
  onSave,
  isSaving,
}) => {
  return (
    <div>
      <h3 className="settings-section-title">AI Configuration</h3>
      <p className="text-text-muted text-sm mb-6">
        Configure AI model settings for Business Intelligence and SQL generation.
      </p>

      {/* Model Selection */}
      <div className="settings-section">
        <h4 className="text-sm font-medium text-text-primary mb-4">Model Selection</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="settings-label">BI Agent Model</label>
            <select
              value={configForm.bi_model}
              onChange={(e) => onConfigFormChange({ bi_model: e.target.value })}
              className="input-field"
            >
              {MODEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-text-muted mt-1">
              Model for analysis and insights (Sonnet recommended)
            </p>
          </div>
          <div>
            <label className="settings-label">SQL Agent Model</label>
            <select
              value={configForm.sql_model}
              onChange={(e) => onConfigFormChange({ sql_model: e.target.value })}
              className="input-field"
            >
              {MODEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-text-muted mt-1">
              Model for SQL generation (Haiku recommended)
            </p>
          </div>
        </div>
      </div>

      {/* Generation Parameters */}
      <div className="settings-section">
        <h4 className="text-sm font-medium text-text-primary mb-4">Generation Parameters</h4>
        <div className="space-y-4">
          <div>
            <label className="settings-label">Temperature</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={configForm.temperature}
                onChange={(e) => onConfigFormChange({ temperature: parseFloat(e.target.value) })}
                className="flex-1 accent-accent"
              />
              <span className="text-sm text-text-secondary w-12 text-right">
                {configForm.temperature.toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1">
              AI creativity (0.0 = deterministic, 1.0 = creative)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="settings-label">Max Agent Steps</label>
              <input
                type="number"
                min="5"
                max="30"
                value={configForm.recursion_limit}
                onChange={(e) => onConfigFormChange({ recursion_limit: parseInt(e.target.value) || 15 })}
                className="input-field"
              />
              <p className="text-xs text-text-muted mt-1">
                Maximum steps per query (5-30). Higher = more complex queries but higher cost
              </p>
            </div>
            <div>
              <label className="settings-label">Max SQL Retries</label>
              <input
                type="number"
                min="0"
                max="5"
                value={configForm.max_sql_retries}
                onChange={(e) => onConfigFormChange({ max_sql_retries: parseInt(e.target.value) || 2 })}
                className="input-field"
              />
              <p className="text-xs text-text-muted mt-1">
                Retry attempts when SQL fails (0-5)
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={isSaving}
        className="btn-primary mt-4"
      >
        {isSaving ? 'Saving...' : 'Save AI Configuration'}
      </button>
    </div>
  );
};

export default AIConfigSettings;
