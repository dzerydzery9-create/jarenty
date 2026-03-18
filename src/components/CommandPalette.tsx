import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface CommandPaletteProps {
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ onClose }) => {
  const [search, setSearch] = useState('');

  const commands = [
    { id: 'chat', name: 'Open Chat', description: 'Open chat panel' },
    { id: 'model-switch', name: 'Switch Model', description: 'Change AI model' },
    { id: 'run', name: 'Run Project', description: 'Run current project' },
    { id: 'debug', name: 'Start Debug', description: 'Start debugging' },
    { id: 'clear', name: 'Clear Chat', description: 'Clear chat history' },
    { id: 'settings', name: 'Open Settings', description: 'Open settings' },
  ];

  const filtered = commands.filter(
    (cmd) =>
      cmd.name.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-lg shadow-2xl">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
          <Search size={18} className="text-gray-500" />
          <input
            autoFocus
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type command name..."
            className="flex-1 bg-transparent text-gray-100 outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((cmd, idx) => (
              <button
                key={cmd.id}
                className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800 transition-colors text-left ${
                  idx === 0 ? 'bg-blue-900' : ''
                }`}
              >
                <div>
                  <div className="text-gray-100 font-semibold">{cmd.name}</div>
                  <div className="text-xs text-gray-500">{cmd.description}</div>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              No matching commands
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-800 text-xs text-gray-500">
          Press <kbd className="px-2 py-1 bg-gray-800 rounded">ESC</kbd> to close
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
