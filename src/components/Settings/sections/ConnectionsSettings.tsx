import React, { useState } from 'react';
import {
  DatabaseConnection,
  DatabaseConnectionCreate,
  DatabaseDialect,
} from '../../../types';
import { TrashIcon, DatabaseIcon, PlusIcon } from '../../Icons';

interface ConnectionsSettingsProps {
  connections: DatabaseConnection[];
  onCreateConnection: (data: DatabaseConnectionCreate) => Promise<void>;
  onUpdateConnection: (id: number, data: Partial<DatabaseConnectionCreate>) => Promise<void>;
  onDeleteConnection: (id: number) => Promise<void>;
  onSetDefaultConnection: (id: number) => Promise<void>;
  isSaving: boolean;
}

const DIALECT_OPTIONS: { value: DatabaseDialect; label: string }[] = [
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'sqlite', label: 'SQLite' },
];

const ConnectionsSettings: React.FC<ConnectionsSettingsProps> = ({
  connections,
  onCreateConnection,
  onUpdateConnection,
  onDeleteConnection,
  onSetDefaultConnection,
  isSaving,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<DatabaseConnectionCreate>({
    alias: '',
    connection_uri: '',
    dialect: 'postgresql',
    is_default: false,
  });

  const resetForm = () => {
    setFormData({
      alias: '',
      connection_uri: '',
      dialect: 'postgresql',
      is_default: false,
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleCreate = async () => {
    if (!formData.alias || !formData.connection_uri) return;
    await onCreateConnection(formData);
    resetForm();
  };

  const handleUpdate = async () => {
    if (editingId === null) return;
    await onUpdateConnection(editingId, formData);
    resetForm();
  };

  const handleEdit = (conn: DatabaseConnection) => {
    setEditingId(conn.id);
    setFormData({
      alias: conn.alias,
      connection_uri: '', // Don't show - it's write-only
      dialect: conn.dialect,
      is_default: conn.is_default,
    });
    setShowAddForm(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this connection?')) {
      await onDeleteConnection(id);
    }
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
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="settings-label">Alias</label>
                      <input
                        type="text"
                        value={formData.alias}
                        onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                        className="input-field"
                        placeholder="My Database"
                      />
                    </div>
                    <div>
                      <label className="settings-label">Dialect</label>
                      <select
                        value={formData.dialect}
                        onChange={(e) =>
                          setFormData({ ...formData, dialect: e.target.value as DatabaseDialect })
                        }
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
                  <div>
                    <label className="settings-label">
                      Connection URI <span className="text-text-muted">(leave empty to keep current)</span>
                    </label>
                    <input
                      type="password"
                      value={formData.connection_uri}
                      onChange={(e) => setFormData({ ...formData, connection_uri: e.target.value })}
                      className="input-field"
                      placeholder="postgresql://user:pass@host:5432/db"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleUpdate}
                      disabled={isSaving || !formData.alias}
                      className="btn-primary text-sm"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={resetForm} className="text-sm text-text-muted hover:text-text-primary">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
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
                      <div className="text-sm text-text-muted">
                        {conn.dialect.toUpperCase()} • Created {new Date(conn.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Connection Form */}
      {showAddForm ? (
        <div className="p-4 rounded-lg border border-border bg-secondary space-y-4">
          <h4 className="font-medium text-text-primary">Add New Connection</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="settings-label">Alias *</label>
              <input
                type="text"
                value={formData.alias}
                onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                className="input-field"
                placeholder="My Database"
              />
            </div>
            <div>
              <label className="settings-label">Dialect</label>
              <select
                value={formData.dialect}
                onChange={(e) =>
                  setFormData({ ...formData, dialect: e.target.value as DatabaseDialect })
                }
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
          <div>
            <label className="settings-label">Connection URI *</label>
            <input
              type="text"
              value={formData.connection_uri}
              onChange={(e) => setFormData({ ...formData, connection_uri: e.target.value })}
              className="input-field"
              placeholder="postgresql://user:password@host:5432/database"
            />
            <p className="text-xs text-text-muted mt-1">
              Example: postgresql://user:pass@localhost:5432/mydb
            </p>
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="w-4 h-4 accent-accent"
              />
              <span className="text-sm text-text-secondary">Set as default connection</span>
            </label>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleCreate}
              disabled={isSaving || !formData.alias || !formData.connection_uri}
              className="btn-primary text-sm"
            >
              {isSaving ? 'Creating...' : 'Create Connection'}
            </button>
            <button onClick={resetForm} className="text-sm text-text-muted hover:text-text-primary">
              Cancel
            </button>
          </div>
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
