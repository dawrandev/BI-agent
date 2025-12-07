import React, { useState } from 'react';
import {
  Instruction,
  InstructionCreate,
  InstructionUpdate,
} from '../../../types';
import { TrashIcon, PlusIcon, EditIcon } from '../../Icons';

interface InstructionsSettingsProps {
  instructions: Instruction[];
  onCreateInstruction: (data: InstructionCreate) => Promise<void>;
  onUpdateInstruction: (id: string, data: InstructionUpdate) => Promise<void>;
  onDeleteInstruction: (id: string) => Promise<void>;
  isSaving: boolean;
}

const InstructionsSettings: React.FC<InstructionsSettingsProps> = ({
  instructions,
  onCreateInstruction,
  onUpdateInstruction,
  onDeleteInstruction,
  isSaving,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newInstruction, setNewInstruction] = useState('');
  const [editInstruction, setEditInstruction] = useState('');

  const handleCreate = async () => {
    if (!newInstruction.trim() || newInstruction.length < 3) return;
    await onCreateInstruction({ instruction: newInstruction.trim() });
    setNewInstruction('');
    setShowAddForm(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editInstruction.trim() || editInstruction.length < 3) return;
    await onUpdateInstruction(id, { instruction: editInstruction.trim() });
    setEditingId(null);
    setEditInstruction('');
  };

  const handleToggleActive = async (inst: Instruction) => {
    await onUpdateInstruction(inst.id, {
      instruction: inst.instruction,
      is_active: !inst.is_active,
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this instruction?')) {
      await onDeleteInstruction(id);
    }
  };

  const startEdit = (inst: Instruction) => {
    setEditingId(inst.id);
    setEditInstruction(inst.instruction);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditInstruction('');
  };

  return (
    <div>
      <h3 className="settings-section-title">Domain Instructions</h3>
      <p className="text-text-muted text-sm mb-6">
        Add domain-specific rules and context to improve SQL query generation.
        These instructions help the AI understand your data model and business logic.
      </p>

      {/* Instructions List */}
      <div className="space-y-3 mb-6">
        {instructions.map((inst) => (
          <div
            key={inst.id}
            className={`p-4 rounded-lg border ${
              inst.is_active
                ? 'border-border bg-secondary'
                : 'border-border/50 bg-secondary/50 opacity-60'
            }`}
          >
            {editingId === inst.id ? (
              /* Edit Mode */
              <div className="space-y-3">
                <textarea
                  value={editInstruction}
                  onChange={(e) => setEditInstruction(e.target.value)}
                  className="input-field min-h-[100px] resize-y"
                  placeholder="Enter instruction..."
                  autoFocus
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUpdate(inst.id)}
                    disabled={isSaving || editInstruction.length < 3}
                    className="btn-primary text-sm"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-sm text-text-muted hover:text-text-primary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-text-primary text-sm flex-1 whitespace-pre-wrap">
                    {inst.instruction}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleActive(inst)}
                      disabled={isSaving}
                      className={`px-3 py-1 rounded-lg text-xs transition-all ${
                        inst.is_active
                          ? 'bg-success-bg text-success'
                          : 'bg-secondary border border-border text-text-muted'
                      }`}
                    >
                      {inst.is_active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => startEdit(inst)}
                      className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-primary transition-all"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(inst.id)}
                      disabled={isSaving}
                      className="p-2 rounded-lg text-error hover:bg-error/10 transition-all"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-text-muted mt-2">
                  Added {new Date(inst.created_at).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Instruction Form */}
      {showAddForm ? (
        <div className="p-4 rounded-lg border border-border bg-secondary space-y-4">
          <h4 className="font-medium text-text-primary">Add New Instruction</h4>
          <textarea
            value={newInstruction}
            onChange={(e) => setNewInstruction(e.target.value)}
            className="input-field min-h-[120px] resize-y"
            placeholder="e.g., 'revenue = quantity * unit_price' or 'Always exclude test users from reports'"
            autoFocus
          />
          <div className="flex items-center gap-4">
            <button
              onClick={handleCreate}
              disabled={isSaving || newInstruction.length < 3}
              className="btn-primary text-sm"
            >
              {isSaving ? 'Creating...' : 'Add Instruction'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewInstruction('');
              }}
              className="text-sm text-text-muted hover:text-text-primary"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border text-text-secondary hover:border-accent hover:text-accent transition-all w-full justify-center"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Instruction</span>
        </button>
      )}

      {instructions.length === 0 && !showAddForm && (
        <div className="text-center py-8 text-text-muted mt-4">
          <div className="text-3xl mb-3">📝</div>
          <p>No instructions configured</p>
          <p className="text-sm">Add domain rules to improve query accuracy</p>
        </div>
      )}

      {/* Examples */}
      <div className="mt-8 p-4 rounded-lg bg-primary border border-border">
        <h4 className="text-sm font-medium text-text-primary mb-3">Example Instructions</h4>
        <ul className="space-y-2 text-sm text-text-muted">
          <li>• <code className="text-accent">revenue = quantity * unit_price</code></li>
          <li>• <code className="text-accent">Always filter out records where status = 'deleted'</code></li>
          <li>• <code className="text-accent">The 'users' table contains both customers and admins, use role column to distinguish</code></li>
          <li>• <code className="text-accent">Date columns are stored in UTC timezone</code></li>
        </ul>
      </div>
    </div>
  );
};

export default InstructionsSettings;
