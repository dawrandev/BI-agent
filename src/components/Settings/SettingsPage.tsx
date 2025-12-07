import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsSection, SettingsPageProps } from '../../types';
import { ArrowLeftIcon, SettingsIcon, KeyIcon, DatabaseIcon, SparklesIcon, UserIcon } from '../Icons';
import GeneralSettings from './sections/GeneralSettings';
import ApiKeysSettings from './sections/ApiKeysSettings';
import DatabaseSettings from './sections/DatabaseSettings';
import CustomInstructions from './sections/CustomInstructions';
import AccountSettings from './sections/AccountSettings';

const SettingsPage: React.FC<SettingsPageProps> = ({
  config,
  databaseConfig,
  customInstructions,
  configForm,
  onConfigFormChange,
  onSaveApiKeys,
  onSaveDatabase,
  onSaveCustomInstructions,
  onClose,
  username,
  onLogout,
}) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = () => {
    onClose();
    navigate('/');
  };

  const navItems: { id: SettingsSection; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <SettingsIcon className="w-4 h-4" /> },
    { id: 'api-keys', label: 'API Keys', icon: <KeyIcon className="w-4 h-4" /> },
    { id: 'database', label: 'Database', icon: <DatabaseIcon className="w-4 h-4" /> },
    { id: 'custom-instructions', label: 'Custom Instructions', icon: <SparklesIcon className="w-4 h-4" /> },
    { id: 'account', label: 'Account', icon: <UserIcon className="w-4 h-4" /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettings />;
      case 'api-keys':
        return (
          <ApiKeysSettings
            config={config}
            configForm={configForm}
            onConfigFormChange={onConfigFormChange}
            onSave={async () => {
              setIsSaving(true);
              await onSaveApiKeys();
              setIsSaving(false);
            }}
            isSaving={isSaving}
          />
        );
      case 'database':
        return (
          <DatabaseSettings
            databaseConfig={databaseConfig}
            onSave={async (data) => {
              setIsSaving(true);
              await onSaveDatabase(data);
              setIsSaving(false);
            }}
            isSaving={isSaving}
          />
        );
      case 'custom-instructions':
        return (
          <CustomInstructions
            customInstructions={customInstructions}
            onSave={async (data) => {
              setIsSaving(true);
              await onSaveCustomInstructions(data);
              setIsSaving(false);
            }}
            isSaving={isSaving}
          />
        );
      case 'account':
        return (
          <AccountSettings
            username={username}
            onLogout={onLogout}
          />
        );
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="flex h-screen bg-primary">
      {/* Left Navigation */}
      <nav className="w-64 bg-sidebar border-r border-border flex flex-col">
        {/* Back button */}
        <div className="p-4 border-b border-border">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-all text-sm"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back to chat</span>
          </button>
        </div>

        {/* Title */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-text-primary">Settings</h2>
        </div>

        {/* Navigation items */}
        <div className="flex-1 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`settings-nav-item ${activeSection === item.id ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Right Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
