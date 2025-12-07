import React from 'react';

const GeneralSettings: React.FC = () => {
  return (
    <div>
      <h3 className="settings-section-title">General</h3>

      <div className="settings-section">
        <label className="settings-label">Theme</label>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium">
            Dark
          </button>
          <button className="px-4 py-2 rounded-lg bg-secondary border border-border text-text-secondary text-sm font-medium cursor-not-allowed opacity-50">
            Light (Coming soon)
          </button>
        </div>
      </div>

      <div className="settings-section">
        <label className="settings-label">Language</label>
        <select
          className="input-field bg-secondary cursor-not-allowed opacity-50"
          disabled
          defaultValue="en"
        >
          <option value="en">English</option>
          <option value="uz">O'zbek</option>
          <option value="ru">Русский</option>
        </select>
        <p className="text-xs text-text-muted mt-2">Language selection coming soon</p>
      </div>
    </div>
  );
};

export default GeneralSettings;
