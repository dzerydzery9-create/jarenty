import React, { useState, useEffect } from 'react';
import { Settings, Save, X } from 'lucide-react';
import { useStore } from '../store';

const SettingsPage: React.FC = () => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { setApiKey } = useStore();

  useEffect(() => {
    const savedOpenai = localStorage.getItem('openaiApiKey');
    const savedClaude = localStorage.getItem('claudeApiKey');
    setOpenaiKey(savedOpenai || '');
    setClaudeKey(savedClaude || '');
  }, []);

  const handleSave = () => {
    localStorage.setItem('openaiApiKey', openaiKey);
    localStorage.setItem('claudeApiKey', claudeKey);
    setApiKey('openai', openaiKey);
    setApiKey('claude', claudeKey);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Settings className="w-6 h-6 mr-2 text-blue-500" />
        <h1 className="text-2xl font-bold">Ustawienia API</h1>
      </div>

      {showSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded flex items-center">
          <Save className="w-4 h-4 mr-2" />
          Ustawienia zapisane!
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Klucz API dla OpenAI</label>
          <input
            type="password"
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Wklej klucz OpenAI"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Klucz API dla Claude</label>
          <input
            type="password"
            value={claudeKey}
            onChange={(e) => setClaudeKey(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Wklej klucz Claude"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Zapisz ustawienia
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Uwaga:</h3>
        <p className="text-sm text-blue-700">
          Klucze API są przechowywane lokalnie w przeglądarce. Nie udostępniaj ich nikomu.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;