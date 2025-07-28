'use client';

import { useState } from 'react';

interface AudioSettingsProps {
  voice: string;
  model: string;
  onVoiceChange: (voice: string) => void;
  onModelChange: (model: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const voices = [
  { id: 'alloy', name: 'Alloy', description: 'Neutrale, vriendelijke stem' },
  { id: 'echo', name: 'Echo', description: 'Mannelijke stem met karakter' },
  { id: 'fable', name: 'Fable', description: 'Britse accent, verhaalverteller' },
  { id: 'onyx', name: 'Onyx', description: 'Diepe, warme mannelijke stem' },
  { id: 'nova', name: 'Nova', description: 'Jonge, energieke vrouwelijke stem' },
  { id: 'shimmer', name: 'Shimmer', description: 'Zachte, kalme vrouwelijke stem' },
];

const models = [
  { id: 'tts-1', name: 'Standard', description: 'Sneller, lagere kwaliteit' },
  { id: 'tts-1-hd', name: 'HD', description: 'Langzamer, hogere kwaliteit' },
  { id: 'gpt-4o-mini-tts', name: 'GPT-4o Mini TTS', description: 'Compacte en efficiënte TTS' },
];

export function AudioSettings({
  voice,
  model,
  onVoiceChange,
  onModelChange,
  isOpen,
  onClose,
}: AudioSettingsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Audio Instellingen
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Voice Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Kies een stem
            </h3>
            <div className="space-y-2">
              {voices.map((voiceOption) => (
                <label
                  key={voiceOption.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="voice"
                    value={voiceOption.id}
                    checked={voice === voiceOption.id}
                    onChange={(e) => onVoiceChange(e.target.value)}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 dark:text-white">
                      {voiceOption.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {voiceOption.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Kies kwaliteit
            </h3>
            <div className="space-y-2">
              {models.map((modelOption) => (
                <label
                  key={modelOption.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="model"
                    value={modelOption.id}
                    checked={model === modelOption.id}
                    onChange={(e) => onModelChange(e.target.value)}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 dark:text-white">
                      {modelOption.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {modelOption.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Opslaan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}