import React, { useState } from 'react';
import { TableDescription, TableDescriptionUpdate, ColumnDescription } from '../../../types';
import { EditIcon, CheckIcon, ChevronDownIcon } from '../../Icons';

interface TableSchemasSettingsProps {
  tables: TableDescription[];
  onUpdateTable: (tableName: string, data: TableDescriptionUpdate) => Promise<void>;
  isSaving: boolean;
  isLoading: boolean;
  onRefresh: () => Promise<void>;
}

const TableSchemasSettings: React.FC<TableSchemasSettingsProps> = ({
  tables,
  onUpdateTable,
  isSaving,
  isLoading,
  onRefresh,
}) => {
  const [expandedTable, setExpandedTable] = useState<string | null>(null);
  const [editingTable, setEditingTable] = useState<string | null>(null);
  const [editingColumn, setEditingColumn] = useState<{ table: string; column: string } | null>(null);
  const [tableDescription, setTableDescription] = useState('');
  const [columnDescription, setColumnDescription] = useState('');

  const toggleExpand = (tableName: string) => {
    setExpandedTable(expandedTable === tableName ? null : tableName);
  };

  const startEditTable = (table: TableDescription) => {
    setEditingTable(table.name);
    setTableDescription(table.description || '');
  };

  const saveTableDescription = async (tableName: string) => {
    await onUpdateTable(tableName, { description: tableDescription });
    setEditingTable(null);
  };

  const startEditColumn = (tableName: string, column: ColumnDescription) => {
    setEditingColumn({ table: tableName, column: column.name });
    setColumnDescription(column.comment || '');
  };

  const saveColumnDescription = async (tableName: string, columnName: string) => {
    await onUpdateTable(tableName, {
      columns: [{ name: columnName, description: columnDescription }],
    });
    setEditingColumn(null);
  };

  const getDataTypeColor = (dataType: string | undefined | null) => {
    if (!dataType) return 'text-text-muted';
    const type = dataType.toLowerCase();
    if (type.includes('int') || type.includes('numeric') || type.includes('decimal') || type.includes('double')) {
      return 'text-blue-400';
    }
    if (type.includes('char') || type.includes('text') || type.includes('string')) {
      return 'text-green-400';
    }
    if (type.includes('date') || type.includes('time')) {
      return 'text-yellow-400';
    }
    if (type.includes('bool') || type.includes('tinyint')) {
      return 'text-purple-400';
    }
    if (type.includes('json') || type.includes('enum')) {
      return 'text-orange-400';
    }
    return 'text-text-muted';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="settings-section-title mb-1">Table Schemas</h3>
          <p className="text-text-muted text-sm">
            View and document your database tables and columns to improve SQL generation.
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg border border-border text-text-secondary hover:bg-secondary transition-all text-sm"
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {isLoading && tables.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
          <p>Loading tables...</p>
        </div>
      ) : tables.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <div className="text-4xl mb-3">🗄️</div>
          <p>No tables found</p>
          <p className="text-sm">Configure a database connection first</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tables.map((table) => (
            <div key={table.name} className="border border-border rounded-lg overflow-hidden">
              {/* Table Header */}
              <div
                className="flex items-center justify-between p-4 bg-secondary cursor-pointer hover:bg-secondary/80 transition-all"
                onClick={() => toggleExpand(table.name)}
              >
                <div className="flex items-center gap-3">
                  <ChevronDownIcon
                    className={`w-4 h-4 text-text-muted transition-transform ${
                      expandedTable === table.name ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                  <div>
                    <div className="font-mono text-text-primary font-medium">{table.name}</div>
                    {editingTable === table.name ? (
                      <div className="flex items-center gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={tableDescription}
                          onChange={(e) => setTableDescription(e.target.value)}
                          className="input-field text-sm py-1"
                          placeholder="Add table description..."
                          autoFocus
                        />
                        <button
                          onClick={() => saveTableDescription(table.name)}
                          disabled={isSaving}
                          className="p-1.5 rounded bg-accent text-white hover:bg-accent-hover"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingTable(null)}
                          className="text-sm text-text-muted hover:text-text-primary"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-text-muted">
                          {table.description || 'No description'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditTable(table);
                          }}
                          className="p-1 rounded hover:bg-primary text-text-muted hover:text-text-primary"
                        >
                          <EditIcon className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-text-muted">
                  {table.columns.length} columns
                </div>
              </div>

              {/* Columns */}
              {expandedTable === table.name && (
                <div className="border-t border-border">
                  <table className="w-full">
                    <thead className="bg-primary">
                      <tr className="text-xs text-text-muted uppercase">
                        <th className="text-left p-3 font-medium">Column</th>
                        <th className="text-left p-3 font-medium">Type</th>
                        <th className="text-left p-3 font-medium">Nullable</th>
                        <th className="text-left p-3 font-medium">Comment</th>
                        <th className="text-left p-3 font-medium w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.columns.map((col) => (
                        <tr key={col.name} className="border-t border-border/50 hover:bg-primary/50">
                          <td className="p-3">
                            <span className="font-mono text-text-primary">{col.name}</span>
                          </td>
                          <td className="p-3">
                            <span className={`font-mono text-sm ${getDataTypeColor(col.type)}`}>
                              {col.type}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              col.nullable
                                ? 'bg-text-muted/20 text-text-muted'
                                : 'bg-error/20 text-error'
                            }`}>
                              {col.nullable ? 'NULL' : 'NOT NULL'}
                            </span>
                          </td>
                          <td className="p-3">
                            {editingColumn?.table === table.name &&
                            editingColumn?.column === col.name ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={columnDescription}
                                  onChange={(e) => setColumnDescription(e.target.value)}
                                  className="input-field text-sm py-1 flex-1"
                                  placeholder="Add comment..."
                                  autoFocus
                                />
                                <button
                                  onClick={() => saveColumnDescription(table.name, col.name)}
                                  disabled={isSaving}
                                  className="p-1.5 rounded bg-accent text-white hover:bg-accent-hover"
                                >
                                  <CheckIcon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingColumn(null)}
                                  className="text-sm text-text-muted hover:text-text-primary"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <span className="text-sm text-text-muted">
                                {col.comment || '-'}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            {!(
                              editingColumn?.table === table.name &&
                              editingColumn?.column === col.name
                            ) && (
                              <button
                                onClick={() => startEditColumn(table.name, col)}
                                className="p-1.5 rounded hover:bg-secondary text-text-muted hover:text-text-primary"
                              >
                                <EditIcon className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableSchemasSettings;
