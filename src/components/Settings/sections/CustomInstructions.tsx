import React, { useState, useEffect } from 'react';
import { CustomInstructions as CustomInstructionsType } from '../../../types';

interface CustomInstructionsProps {
  customInstructions: CustomInstructionsType | null;
  onSave: (data: CustomInstructionsType) => Promise<void>;
  isSaving: boolean;
}

const CustomInstructions: React.FC<CustomInstructionsProps> = ({
  customInstructions,
  onSave,
  isSaving,
}) => {
  const [systemPrompt, setSystemPrompt] = useState('');
  const maxLength = 2000;

  useEffect(() => {
    if (customInstructions) {
      setSystemPrompt(customInstructions.system_prompt);
    }
  }, [customInstructions]);

  const handleSubmit = async () => {
    await onSave({ system_prompt: systemPrompt });
  };

  return (
    <div>
      <h3 className="settings-section-title">Custom Instructions</h3>
      <p className="text-text-muted text-sm mb-6">
        Customize how BI Agent responds. These instructions will be included in every conversation.
      </p>

      <div className="settings-section">
        <label className="settings-label">System Prompt</label>
        <textarea
          placeholder="e.g., Always respond in Uzbek language. Focus on sales data analysis. Use formal language."
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value.slice(0, maxLength))}
          className="input-field min-h-[200px] resize-y"
          rows={8}
        />
        <div className="flex justify-between mt-2">
          <p className="text-xs text-text-muted">
            These instructions help personalize the AI's responses
          </p>
          <span className={`text-xs ${systemPrompt.length >= maxLength ? 'text-error' : 'text-text-muted'}`}>
            {systemPrompt.length}/{maxLength}
          </span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSaving}
        className="btn-primary mt-4"
      >
        {isSaving ? 'Saving...' : 'Save Instructions'}
      </button>
    </div>
  );
};

export default CustomInstructions;
