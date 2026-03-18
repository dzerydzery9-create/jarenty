import React from 'react';
import ModelManager from './ModelManager';

interface SidebarProps {
  activePanel: string;
  setView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePanel, setView }) => {
  const renderContent = () => {
    switch (activePanel) {
      case 'chat':
        return (
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">AI Chat Models</h3>
            <div className="space-y-2">
              <div className="px-3 py-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer text-sm">
                💬 Chat with AI
              </div>
              <div className="px-3 py-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer text-sm">
                🔧 Model Settings
              </div>
              <div className="px-3 py-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer text-sm">
                📚 Conversation History
              </div>
            </div>
          </div>
        );

      case 'explorer':
        return (
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Project Explorer</h3>
            <div className="space-y-2">
              <div className="px-3 py-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer text-sm">
                📁 Open Folder
              </div>
              <div className="px-3 py-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer text-sm">
                ✨ New Project
              </div>
              <div className="px-3 py-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer text-sm">
                📂 Recent Projects
              </div>
            </div>
          </div>
        );

      case 'search':
        return (
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Search</h3>
            <input
              type="text"
              placeholder="Search in files..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-100"
            />
            <div className="text-xs text-gray-500">Type to search...</div>
          </div>
        );

      case 'run':
        return (
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Run & Debug</h3>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold">
                ▶ Run
              </button>
              <button className="w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm">
                🐛 Debug
              </button>
            </div>
          </div>
        );

      case 'source':
        return (
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Source Control</h3>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm">
                🔄 Initialize Repository
              </button>
              <button className="w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm">
                📝 Changes
              </button>
            </div>
          </div>
        );

      case 'agents':
        return (
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Agents</h3>
            <ul>
              <li>Agents</li>
              <li>Tasks</li>
              <li>Settings</li>
            </ul>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

export default Sidebar;
