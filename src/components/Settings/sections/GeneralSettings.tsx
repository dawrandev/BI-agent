import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { SunIcon, MoonIcon } from '../../Icons';

const GeneralSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <h3 className="settings-section-title">General</h3>

      <div className="settings-section">
        <label className="settings-label">Theme</label>
        <div className="flex gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              theme === 'light'
                ? 'bg-accent text-white'
                : 'bg-secondary border border-border text-text-secondary hover:bg-sidebar-hover'
            }`}
          >
            <SunIcon className="w-4 h-4" />
            Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              theme === 'dark'
                ? 'bg-accent text-white'
                : 'bg-secondary border border-border text-text-secondary hover:bg-sidebar-hover'
            }`}
          >
            <MoonIcon className="w-4 h-4" />
            Dark
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
