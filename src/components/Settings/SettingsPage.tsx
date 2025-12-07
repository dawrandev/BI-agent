import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsSection, SettingsPageProps } from '../../types';
import {
  ArrowLeftIcon,
  SettingsIcon,
  KeyIcon,
  CpuIcon,
  DatabaseIcon,
  SparklesIcon,
  UserIcon,
} from '../Icons';
import GeneralSettings from './sections/GeneralSettings';
import ApiKeysSettings from './sections/ApiKeysSettings';
import AIConfigSettings from './sections/AIConfigSettings';
import ConnectionsSettings from './sections/ConnectionsSettings';
import InstructionsSettings from './sections/InstructionsSettings';
import TableSchemasSettings from './sections/TableSchemasSettings';
import AccountSettings from './sections/AccountSettings';

// Table icon component
const TableIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const SettingsPage: React.FC<SettingsPageProps> = ({
  // API Keys
  config,
  configForm,
  onConfigFormChange,
  onSaveApiKeys,
  isSavingApiKeys,

  // Connections
  connections,
  onCreateConnection,
  onUpdateConnection,
  onDeleteConnection,
  onSetDefaultConnection,
  onTestConnection,
  isSavingConnection,

  // Instructions
  instructions,
  onCreateInstruction,
  onUpdateInstruction,
  onDeleteInstruction,
  isSavingInstruction,

  // Tables
  tables,
  onUpdateTable,
  isSavingTable,
  isLoadingTables,
  onRefreshTables,

  // Navigation & User
  onClose,
  username,
  onLogout,
}) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SettingsSection>('api-keys');

  const handleBack = () => {
    onClose();
    navigate('/');
  };

  const navItems: { id: SettingsSection; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <SettingsIcon className="w-4 h-4" /> },
    { id: 'api-keys', label: 'API Keys', icon: <KeyIcon className="w-4 h-4" /> },
    { id: 'ai-config', label: 'AI Config', icon: <CpuIcon className="w-4 h-4" /> },
    { id: 'connections', label: 'Connections', icon: <DatabaseIcon className="w-4 h-4" /> },
    { id: 'instructions', label: 'Instructions', icon: <SparklesIcon className="w-4 h-4" /> },
    { id: 'tables', label: 'Table Schemas', icon: <TableIcon className="w-4 h-4" /> },
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
            onSave={onSaveApiKeys}
            isSaving={isSavingApiKeys}
          />
        );

      case 'ai-config':
        return (
          <AIConfigSettings
            configForm={configForm}
            onConfigFormChange={onConfigFormChange}
            onSave={onSaveApiKeys}
            isSaving={isSavingApiKeys}
          />
        );

      case 'connections':
        return (
          <ConnectionsSettings
            connections={connections}
            onCreateConnection={onCreateConnection}
            onUpdateConnection={onUpdateConnection}
            onDeleteConnection={onDeleteConnection}
            onSetDefaultConnection={onSetDefaultConnection}
            onTestConnection={onTestConnection}
            isSaving={isSavingConnection}
          />
        );

      case 'instructions':
        return (
          <InstructionsSettings
            instructions={instructions}
            onCreateInstruction={onCreateInstruction}
            onUpdateInstruction={onUpdateInstruction}
            onDeleteInstruction={onDeleteInstruction}
            isSaving={isSavingInstruction}
          />
        );

      case 'tables':
        return (
          <TableSchemasSettings
            tables={tables}
            onUpdateTable={onUpdateTable}
            isSaving={isSavingTable}
            isLoading={isLoadingTables}
            onRefresh={onRefreshTables}
          />
        );

      case 'account':
        return <AccountSettings username={username} onLogout={onLogout} />;

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
        <div className="max-w-3xl">{renderContent()}</div>
      </main>
    </div>
  );
};

export default SettingsPage;
