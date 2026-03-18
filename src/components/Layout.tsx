import React, { useState } from 'react';
import ActivityBar from './ActivityBar';
import Sidebar from './Sidebar';
import Editor from './Editor';
import Terminal from './Terminal';
import CommandPalette from './CommandPalette';
import { MessageCircle, FileText, Search, GitBranch, Play } from 'lucide-react';

type Panel = 'chat' | 'explorer' | 'search' | 'source' | 'run';
type View = 'chat' | 'files' | 'settings';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePanel, setActivePanel] = useState<Panel>('chat');
  const [activeView, setActiveView] = useState<View>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const panels: { id: Panel; label: string; icon: React.ReactNode }[] = [
    { id: 'chat', label: 'Chat AI', icon: <MessageCircle size={24} /> },
    { id: 'explorer', label: 'Explorer', icon: <FileText size={24} /> },
    { id: 'search', label: 'Search', icon: <Search size={24} /> },
    { id: 'source', label: 'Source Control', icon: <GitBranch size={24} /> },
    { id: 'run', label: 'Run & Debug', icon: <Play size={24} /> },
  ];

  const handleSetActivePanel = (panel: string) => {
    setActivePanel(panel as Panel);
  };

  const handleSetActiveView = (view: string) => {
    setActiveView(view as View);
  };

  return (
    <div className="flex h-screen w-screen bg-gray-950 text-gray-100" onKeyDown={(e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'p') {
        e.preventDefault();
        setShowCommandPalette(!showCommandPalette);
      }
    }}>
      {/* Command Palette */}
      {showCommandPalette && <CommandPalette onClose={() => setShowCommandPalette(false)} />}

      {/* Activity Bar */}
      <ActivityBar panels={panels} activePanel={activePanel as string} setActivePanel={handleSetActivePanel} />

      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar activePanel={activePanel as string} setView={handleSetActiveView} />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-gray-800 rounded"
              title="Toggle Sidebar"
            >
              ☰
            </button>
            <span className="text-sm font-semibold text-gray-400">AI Agent Builder</span>
          </div>
          <div className="text-xs text-gray-500">Ready</div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex overflow-hidden">
          <Editor view={activeView} />
        </div>

        {/* Terminal */}
        {terminalOpen && (
          <div className="border-t border-gray-800 bg-gray-900 flex flex-col" style={{ height: '200px' }}>
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex justify-between items-center">
              <span className="text-xs font-semibold">TERMINAL</span>
              <button
                onClick={() => setTerminalOpen(false)}
                className="p-1 hover:bg-gray-700 rounded text-xs"
              >
                ✕
              </button>
            </div>
            <Terminal />
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
