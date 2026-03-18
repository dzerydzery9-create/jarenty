import React from 'react';
import FullVSCodeLayout from './components/FullVSCodeLayout';
import './index.css';

/**
 * Main App Component
 * Renders full VS Code-like IDE with:
 * - Activity Bar (Chat, Explorer, Search, Agents, Plugins)
 * - Sidebar (Model selection, Agent controls, Plugin management)
 * - Editor (Main chat/editor area)
 * - Terminal (Bottom output)
 */
function App() {
  return <FullVSCodeLayout />;
}

export default App;
