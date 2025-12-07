import React, { useState } from 'react';
import {
  DatabaseConnection,
  DatabaseConnectionCreate,
  DatabaseDialect,
  ConnectionTestResult,
} from '../../../types';
import { TrashIcon, DatabaseIcon, PlusIcon, ChevronDownIcon, EyeIcon, EyeOffIcon } from '../../Icons';

interface ConnectionsSettingsProps {
  connections: DatabaseConnection[];
  onCreateConnection: (data: DatabaseConnectionCreate) => Promise<void>;
  onUpdateConnection: (id: number, data: Partial<DatabaseConnectionCreate>) => Promise<void>;
  onDeleteConnection: (id: number) => Promise<void>;
  onSetDefaultConnection: (id: number) => Promise<void>;
  onTestConnection: (id: number) => Promise<ConnectionTestResult>;
  isSaving: boolean;
}

interface TestStatus {
  connectionId: number;
  isLoading: boolean;
  result: ConnectionTestResult | null;
}

interface ConnectionFormFields {
  alias: string;
  dialect: DatabaseDialect;
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
  is_default: boolean;
  useRawUri: boolean;
  rawUri: string;
}

const DIALECT_OPTIONS: { value: DatabaseDialect; label: string; defaultPort: string }[] = [
  { value: 'postgresql', label: 'PostgreSQL', defaultPort: '5432' },
  { value: 'mysql', label: 'MySQL', defaultPort: '3306' },
  { value: 'sqlite', label: 'SQLite', defaultPort: '' },
];

const getDefaultPort = (dialect: DatabaseDialect): string => {
  const option = DIALECT_OPTIONS.find((o) => o.value === dialect);
  return option?.defaultPort || '';
};

interface ParsedConnection {
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
}

const parseConnectionUri = (uri: string, dialect: DatabaseDialect): ParsedConnection => {
  const result: ParsedConnection = {
    host: '',
    port: getDefaultPort(dialect),
    username: '',
    password: '',
    database: '',
  };

  if (!uri) return result;

  try {
    // Handle sqlite separately
    if (dialect === 'sqlite' || uri.startsWith('sqlite')) {
      const match = uri.match(/sqlite:\/\/\/(.+)/);
      if (match) {
        result.database = match[1];
      }
      return result;
    }

    // Parse: dialect://user:pass@host:port/database
    const regex = /^(\w+):\/\/([^:]+):?([^@]*)@([^:\/]+):?(\d*)\/(.+)$/;
    const match = uri.match(regex);

    if (match) {
      result.username = match[2] || '';
      result.password = match[3] || '';
      result.host = match[4] || '';
      result.port = match[5] || getDefaultPort(dialect);
      result.database = match[6] || '';
    }
  } catch {
    // If parsing fails, return defaults
  }

  return result;
};

const buildConnectionUri = (fields: ConnectionFormFields): string => {
  if (fields.useRawUri) {
    return fields.rawUri;
  }

  if (fields.dialect === 'sqlite') {
    return `sqlite:///${fields.database}`;
  }

  const { dialect, host, port, username, password, database } = fields;
  const userPart = password ? `${username}:${password}` : username;
  const portPart = port ? `:${port}` : '';

  return `${dialect}://${userPart}@${host}${portPart}/${database}`;
};

const getInitialFormFields = (dialect: DatabaseDialect = 'postgresql'): ConnectionFormFields => ({
  alias: '',
  dialect,
  host: '',
  port: getDefaultPort(dialect),
  username: '',
  password: '',
  database: '',
  is_default: false,
  useRawUri: false,
  rawUri: '',
});

const ConnectionsSettings: React.FC<ConnectionsSettingsProps> = ({
  connections,
  onCreateConnection,
  onUpdateConnection,
  onDeleteConnection,
  onSetDefaultConnection,
  onTestConnection,
  isSaving,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formFields, setFormFields] = useState<ConnectionFormFields>(getInitialFormFields());
  const [testStatus, setTestStatus] = useState<TestStatus | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setFormFields(getInitialFormFields());
    setShowAddForm(false);
    setEditingId(null);
    setTestStatus(null);
    setShowAdvanced(false);
    setShowPassword(false);
  };

  const updateField = <K extends keyof ConnectionFormFields>(key: K, value: ConnectionFormFields[K]) => {
    setFormFields((prev) => {
      const updated = { ...prev, [key]: value };
      // Update port when dialect changes
      if (key === 'dialect') {
        updated.port = getDefaultPort(value as DatabaseDialect);
      }
      return updated;
    });
  };

  const handleTestConnection = async (connectionId: number) => {
    setTestStatus({ connectionId, isLoading: true, result: null });
    try {
      const result = await onTestConnection(connectionId);
      setTestStatus({ connectionId, isLoading: false, result });
    } catch {
      setTestStatus({
        connectionId,
        isLoading: false,
        result: { success: false, message: 'Test failed unexpectedly' },
      });
    }
  };

  const isFormValid = (): boolean => {
    if (!formFields.alias) return false;

    if (formFields.useRawUri) {
      return !!formFields.rawUri;
    }

    if (formFields.dialect === 'sqlite') {
      return !!formFields.database;
    }

    return !!(formFields.host && formFields.username && formFields.database);
  };

  const handleCreate = async () => {
    if (!isFormValid()) return;

    const connectionUri = buildConnectionUri(formFields);
    await onCreateConnection({
      alias: formFields.alias,
      connection_uri: connectionUri,
      dialect: formFields.dialect,
      is_default: formFields.is_default,
    });
    resetForm();
  };

  const handleUpdate = async () => {
    if (editingId === null) return;

    const connectionUri = buildConnectionUri(formFields);
    const hasNewUri = formFields.useRawUri ? !!formFields.rawUri : !!(formFields.host && formFields.username);

    await onUpdateConnection(editingId, {
      alias: formFields.alias,
      dialect: formFields.dialect,
      is_default: formFields.is_default,
      ...(hasNewUri && { connection_uri: connectionUri }),
    });

    if (hasNewUri) {
      await handleTestConnection(editingId);
    }
    resetForm();
  };

  const handleEdit = (conn: DatabaseConnection) => {
    setEditingId(conn.id);
    const parsed = parseConnectionUri(conn.connection_uri || '', conn.dialect);
    setFormFields({
      ...getInitialFormFields(conn.dialect),
      alias: conn.alias,
      dialect: conn.dialect,
      is_default: conn.is_default,
      host: parsed.host,
      port: parsed.port,
      username: parsed.username,
      password: parsed.password,
      database: parsed.database,
    });
    setShowAddForm(false);
    setShowAdvanced(false);
    setShowPassword(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this connection?')) {
      await onDeleteConnection(id);
    }
  };

  const renderConnectionForm = (isEditing: boolean) => {
    const isSqlite = formFields.dialect === 'sqlite';

    return (
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="settings-label">Connection Name *</label>
            <input
              type="text"
              value={formFields.alias}
              onChange={(e) => updateField('alias', e.target.value)}
              className="input-field"
              placeholder="My Database"
            />
          </div>
          <div>
            <label className="settings-label">Database Type</label>
            <select
              value={formFields.dialect}
              onChange={(e) => updateField('dialect', e.target.value as DatabaseDialect)}
              className="input-field"
            >
              {DIALECT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Connection Fields - Show only if not using raw URI */}
        {!formFields.useRawUri && (
          <>
            {isSqlite ? (
              /* SQLite - just database path */
              <div>
                <label className="settings-label">Database File Path *</label>
                <input
                  type="text"
                  value={formFields.database}
                  onChange={(e) => updateField('database', e.target.value)}
                  className="input-field"
                  placeholder="/path/to/database.db"
                />
              </div>
            ) : (
              /* PostgreSQL / MySQL */
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="settings-label">Host *</label>
                    <input
                      type="text"
                      value={formFields.host}
                      onChange={(e) => updateField('host', e.target.value)}
                      className="input-field"
                      placeholder="localhost"
                    />
                  </div>
                  <div>
                    <label className="settings-label">Port</label>
                    <input
                      type="text"
                      value={formFields.port}
                      onChange={(e) => updateField('port', e.target.value)}
                      className="input-field"
                      placeholder={getDefaultPort(formFields.dialect)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="settings-label">Username *</label>
                    <input
                      type="text"
                      value={formFields.username}
                      onChange={(e) => updateField('username', e.target.value)}
                      className="input-field"
                      placeholder="postgres"
                      autoComplete="off"
                      data-form-type="other"
                    />
                  </div>
                  <div>
                    <label className="settings-label">
                      Password {isEditing && <span className="text-text-muted">(leave empty to keep current)</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formFields.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        className="input-field pr-10"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        data-form-type="other"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary transition-colors"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="settings-label">Database Name *</label>
                  <input
                    type="text"
                    value={formFields.database}
                    onChange={(e) => updateField('database', e.target.value)}
                    className="input-field"
                    placeholder="mydb"
                  />
                </div>
              </>
            )}
          </>
        )}

        {/* Advanced: Raw URI */}
        <div className="border-t border-border pt-4">
          <button
            type="button"
            onClick={() => {
              setShowAdvanced(!showAdvanced);
              if (!showAdvanced) {
                updateField('useRawUri', false);
              }
            }}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            Advanced Options
          </button>

          {showAdvanced && (
            <div className="mt-3 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formFields.useRawUri}
                  onChange={(e) => updateField('useRawUri', e.target.checked)}
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-sm text-text-secondary">Use connection URI directly</span>
              </label>

              {formFields.useRawUri && (
                <div>
                  <label className="settings-label">Connection URI *</label>
                  <input
                    type="text"
                    value={formFields.rawUri}
                    onChange={(e) => updateField('rawUri', e.target.value)}
                    className="input-field font-mono text-sm"
                    placeholder="postgresql://user:password@host:5432/database"
                  />
                  <p className="text-xs text-text-muted mt-1">
                    Example: postgresql://user:pass@localhost:5432/mydb
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Default checkbox */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formFields.is_default}
              onChange={(e) => updateField('is_default', e.target.checked)}
              className="w-4 h-4 accent-accent"
            />
            <span className="text-sm text-text-secondary">Set as default connection</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={isEditing ? handleUpdate : handleCreate}
            disabled={isSaving || !isFormValid()}
            className="btn-primary text-sm"
          >
            {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Connection'}
          </button>
          <button onClick={resetForm} className="text-sm text-text-muted hover:text-text-primary">
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h3 className="settings-section-title">Database Connections</h3>
      <p className="text-text-muted text-sm mb-6">
        Configure connections to PostgreSQL, MySQL, or SQLite databases for SQL queries and analytics.
      </p>

      {/* Connection List */}
      {connections.length > 0 && (
        <div className="space-y-3 mb-6">
          {connections.map((conn) => (
            <div
              key={conn.id}
              className={`p-4 rounded-lg border ${
                conn.is_default
                  ? 'border-accent bg-accent/5'
                  : 'border-border bg-secondary'
              }`}
            >
              {editingId === conn.id ? (
                /* Edit Mode */
                renderConnectionForm(true)
              ) : (
                /* View Mode */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                        <DatabaseIcon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-text-primary">{conn.alias}</span>
                          {conn.is_default && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                              Default
                            </span>
                          )}
                        </div>
                        {(() => {
                          const parsed = parseConnectionUri(conn.connection_uri || '', conn.dialect);
                          if (conn.dialect === 'sqlite') {
                            return (
                              <div className="text-sm text-text-muted">
                                SQLite • {parsed.database || 'No path'}
                              </div>
                            );
                          }
                          return (
                            <div className="text-sm text-text-muted">
                              {conn.dialect.toUpperCase()} • {parsed.username}@{parsed.host}:{parsed.port}/{parsed.database}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTestConnection(conn.id)}
                        disabled={isSaving || (testStatus?.connectionId === conn.id && testStatus.isLoading)}
                        className="text-sm px-3 py-1.5 rounded-lg border border-border text-text-secondary hover:bg-secondary transition-all disabled:opacity-50"
                      >
                        {testStatus?.connectionId === conn.id && testStatus.isLoading ? 'Testing...' : 'Test'}
                      </button>
                      {!conn.is_default && (
                        <button
                          onClick={() => onSetDefaultConnection(conn.id)}
                          disabled={isSaving}
                          className="text-sm px-3 py-1.5 rounded-lg border border-border text-text-secondary hover:bg-secondary transition-all"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(conn)}
                        className="text-sm px-3 py-1.5 rounded-lg border border-border text-text-secondary hover:bg-secondary transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(conn.id)}
                        disabled={isSaving}
                        className="p-2 rounded-lg text-error hover:bg-error/10 transition-all"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {/* Test Result Display */}
                  {testStatus?.connectionId === conn.id && testStatus.result && (
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        testStatus.result.success
                          ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                          : 'bg-red-500/10 border border-red-500/30 text-red-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {testStatus.result.success ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span className="font-medium">
                          {testStatus.result.success ? 'Connection successful' : 'Connection failed'}
                        </span>
                      </div>
                      <p className="mt-1 ml-6">{testStatus.result.message}</p>
                      {testStatus.result.tables_count !== undefined && testStatus.result.tables_count > 0 && (
                        <div className="mt-2 ml-6 text-xs opacity-80">
                          <span>Tables found: {testStatus.result.tables_count}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Connection Form */}
      {showAddForm ? (
        <div className="p-4 rounded-lg border border-border bg-secondary">
          <h4 className="font-medium text-text-primary mb-4">Add New Connection</h4>
          {renderConnectionForm(false)}
        </div>
      ) : (
        <button
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
          className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border text-text-secondary hover:border-accent hover:text-accent transition-all w-full justify-center"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Connection</span>
        </button>
      )}

      {connections.length === 0 && !showAddForm && (
        <div className="text-center py-8 text-text-muted">
          <DatabaseIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No database connections configured</p>
          <p className="text-sm">Add a connection to enable SQL queries</p>
        </div>
      )}
    </div>
  );
};

export default ConnectionsSettings;
