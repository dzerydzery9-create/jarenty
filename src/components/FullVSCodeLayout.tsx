import React, { useState, useEffect, useRef } from 'react';
import './FullVSCodeLayout.css';

// Type definitions
interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timeout?: number;
}

interface AgentTask {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  output: string;
}

interface ModelInfo {
  name: string;
  size: string;
  pulled: boolean;
}

/**
 * Full VS Code Layout Component
 * Complete IDE with:
 * - Activity Bar (left icons)
 * - Sidebar (context panels)
 * - Editor (main area with tabs)
 * - Terminal (bottom)
 * - Plugins
 * - Agents
 * - Full Model Management
 */
const FullVSCodeLayout: React.FC = () => {
  // State management
  const [activePanel, setActivePanel] = useState<'chat' | 'explorer' | 'search' | 'source' | 'run' | 'plugins'>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState('deepseek-coder:1.3b');
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [agents, setAgents] = useState<AgentTask[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [plugins, setPlugins] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Terminal output
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Resize handling
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [isDragging, setIsDragging] = useState(false);

  // Load models on mount
  useEffect(() => {
    loadModels();
    loadPlugins();
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalOutput]);

  const loadModels = async () => {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      const data = await response.json();
      const formattedModels = data.models?.map((m: any) => ({
        name: m.name,
        size: formatBytes(m.size),
        pulled: true
      })) || [];
      setModels(formattedModels);
    } catch (error) {
      addNotification('Failed to load models', 'error');
    }
  };

  const loadPlugins = async () => {
    // Load installed plugins
    setPlugins([
      { id: 'ai-chat', name: 'AI Chat', enabled: true, version: '1.0.0' },
      { id: 'agent-executor', name: 'Agent Executor', enabled: true, version: '1.0.0' },
      { id: 'model-manager', name: 'Model Manager', enabled: true, version: '1.0.0' },
      { id: 'file-explorer', name: 'File Explorer', enabled: true, version: '1.0.0' }
    ]);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          prompt: chatInput,
          stream: false
        })
      });

      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.response };
      setChatMessages(prev => [...prev, assistantMessage]);

      addTerminalOutput(`[${selectedModel}] Response received`);
    } catch (error) {
      addNotification('Failed to get AI response', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const addTerminalOutput = (text: string) => {
    setTerminalOutput(prev => [...prev, text]);
  };

  const addNotification = (message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info') => {
    const id = Math.random().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleMouseDown = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newHeight = window.innerHeight - e.clientY;
      if (newHeight > 100 && newHeight < 800) {
        setTerminalHeight(newHeight);
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging]);

  return (
    <div className="vs-code-layout">
      {/* Activity Bar */}
      <div className="activity-bar">
        <ActivityBarIcon
          icon="💬"
          label="Chat"
          active={activePanel === 'chat'}
          onClick={() => setActivePanel('chat')}
        />
        <ActivityBarIcon
          icon="📁"
          label="Explorer"
          active={activePanel === 'explorer'}
          onClick={() => setActivePanel('explorer')}
        />
        <ActivityBarIcon
          icon="🔍"
          label="Search"
          active={activePanel === 'search'}
          onClick={() => setActivePanel('search')}
        />
        <ActivityBarIcon
          icon="🤖"
          label="Agents"
          active={activePanel === 'run'}
          onClick={() => setActivePanel('run')}
        />
        <ActivityBarIcon
          icon="🧩"
          label="Plugins"
          active={activePanel === 'plugins'}
          onClick={() => setActivePanel('plugins')}
        />
        <div style={{ flex: 1 }}></div>
        <ActivityBarIcon icon="⚙️" label="Settings" />
      </div>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="sidebar">
            <SidebarPanel
              panel={activePanel}
              models={models}
              selectedModel={selectedModel}
              onModelSelect={setSelectedModel}
              agents={agents}
              plugins={plugins}
              onNotification={addNotification}
            />
          </div>
        )}

        {/* Editor Area */}
        <div className="editor-container">
          <div className="editor-tabs">
            <div className="tab active">
              <span>💬 AI Chat</span>
              <button onClick={() => setSidebarOpen(!sidebarOpen)}>⚙️</button>
            </div>
          </div>

          <div className="editor-area">
            {activePanel === 'chat' && (
              <ChatEditor
                messages={chatMessages}
                input={chatInput}
                isLoading={isLoading}
                selectedModel={selectedModel}
                onInputChange={setChatInput}
                onSendMessage={sendChatMessage}
              />
            )}
            {activePanel === 'explorer' && (
              <FileExplorer onNotification={addNotification} />
            )}
            {activePanel === 'run' && (
              <AgentsPanel
                agents={agents}
                models={models}
                selectedModel={selectedModel}
              />
            )}
            {activePanel === 'plugins' && (
              <PluginsPanel plugins={plugins} />
            )}
          </div>
        </div>
      </div>

      {/* Terminal */}
      {terminalOpen && (
        <>
          <div
            className="terminal-resize-handle"
            onMouseDown={handleMouseDown}
            style={{ cursor: isDragging ? 'row-resize' : 'default' }}
          />
          <div className="terminal" style={{ height: `${terminalHeight}px` }}>
            <div className="terminal-header">
              <span>📟 TERMINAL</span>
              <button onClick={() => setTerminalOpen(false)}>✕</button>
            </div>
            <div className="terminal-output">
              {terminalOutput.map((line, i) => (
                <div key={i} className="terminal-line">
                  {line}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </>
      )}

      {/* Notifications */}
      <div className="notifications">
        {notifications.map(notif => (
          <div key={notif.id} className={`notification ${notif.type}`}>
            {notif.message}
          </div>
        ))}
      </div>
    </div>
  );
};

// Activity Bar Icon Component
const ActivityBarIcon: React.FC<{
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}> = ({ icon, label, active, onClick }) => (
  <div
    className={`activity-bar-icon ${active ? 'active' : ''}`}
    onClick={onClick}
    title={label}
  >
    {icon}
  </div>
);

// Sidebar Panel Component
const SidebarPanel: React.FC<{
  panel: string;
  models: ModelInfo[];
  selectedModel: string;
  onModelSelect: (model: string) => void;
  agents: AgentTask[];
  plugins: any[];
  onNotification: (msg: string, type: any) => void;
}> = ({ panel, models, selectedModel, onModelSelect, agents, plugins }) => {
  if (panel === 'chat') {
    return (
      <div className="sidebar-panel">
        <h3>📊 Models</h3>
        <div className="model-list">
          {models.map(model => (
            <div
              key={model.name}
              className={`model-item ${selectedModel === model.name ? 'selected' : ''}`}
              onClick={() => onModelSelect(model.name)}
            >
              <div className="model-name">{model.name}</div>
              <div className="model-size">{model.size}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (panel === 'run') {
    return (
      <div className="sidebar-panel">
        <h3>🤖 Agents</h3>
        <div className="agents-list">
          {[
            { id: 'code', name: 'Code Agent', icon: '💻' },
            { id: 'research', name: 'Research', icon: '📚' },
            { id: 'debug', name: 'Debug Agent', icon: '🐛' }
          ].map(agent => (
            <div key={agent.id} className="agent-item">
              <span>{agent.icon} {agent.name}</span>
              <button>Run</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (panel === 'plugins') {
    return (
      <div className="sidebar-panel">
        <h3>🧩 Plugins ({plugins.length})</h3>
        <div className="plugins-list">
          {plugins.map(plugin => (
            <div key={plugin.id} className="plugin-item">
              <div className="plugin-header">
                <span>{plugin.name}</span>
                <span className={`status ${plugin.enabled ? 'enabled' : 'disabled'}`}>
                  {plugin.enabled ? '✓' : '✕'}
                </span>
              </div>
              <div className="plugin-version">v{plugin.version}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

// Chat Editor Component
const ChatEditor: React.FC<{
  messages: any[];
  input: string;
  isLoading: boolean;
  selectedModel: string;
  onInputChange: (text: string) => void;
  onSendMessage: () => void;
}> = ({ messages, input, isLoading, selectedModel, onInputChange, onSendMessage }) => (
  <div className="chat-editor">
    <div className="chat-messages">
      {messages.map((msg, i) => (
        <div key={i} className={`message ${msg.role}-message`}>
          <div className="message-role">{msg.role.toUpperCase()}</div>
          <div className="message-content">{msg.content}</div>
        </div>
      ))}
    </div>
    <div className="chat-input-area">
      <div className="model-indicator">Model: {selectedModel}</div>
      <textarea
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.ctrlKey) {
            onSendMessage();
          }
        }}
        placeholder="Ask AI anything... (Ctrl+Enter to send)"
        disabled={isLoading}
      />
      <button onClick={onSendMessage} disabled={isLoading}>
        {isLoading ? '⏳ Waiting...' : '📤 Send'}
      </button>
    </div>
  </div>
);

// File Explorer Component
const FileExplorer: React.FC<{ onNotification: (msg: string, type: any) => void }> = () => (
  <div className="file-explorer">
    <h3>📁 Project Files</h3>
    <div className="file-tree">
      <div className="file-item">📄 main.tsx</div>
      <div className="file-item">⚙️ config.ts</div>
      <div className="file-item">📦 package.json</div>
    </div>
  </div>
);

// Agents Panel Component  
const AgentsPanel: React.FC<{ agents: any[]; models: any[]; selectedModel: string }> = () => (
  <div className="agents-panel">
    <h3>🤖 Agent Execution</h3>
    <div className="agent-grid">
      {['Code Agent', 'Research Agent', 'Debug Agent'].map((agent, i) => (
        <div key={i} className="agent-card">
          <h4>{agent}</h4>
          <p>Autonomous task execution</p>
          <button>Launch</button>
        </div>
      ))}
    </div>
  </div>
);

// Plugins Panel Component
const PluginsPanel: React.FC<{ plugins: any[] }> = ({ plugins }) => (
  <div className="plugins-panel">
    <h3>🧩 Installed Plugins</h3>
    <div className="plugins-grid">
      {plugins.map(plugin => (
        <div key={plugin.id} className="plugin-card">
          <h4>{plugin.name}</h4>
          <p>v{plugin.version}</p>
          <button>Settings</button>
        </div>
      ))}
    </div>
  </div>
);

export default FullVSCodeLayout;
