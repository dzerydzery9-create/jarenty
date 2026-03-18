import React, { useState, useEffect } from 'react';
import { PluginManager, Plugin, PluginAPI } from '../plugin-system/PluginManager';
import './PluginExecutor.css';

/**
 * Plugin Executor Component
 * Manages plugin lifecycle and displays execution results
 */
const PluginExecutor: React.FC = () => {
  // Create mock PluginAPI for initialization
  const mockPluginAPI: PluginAPI = {
    registerCommand: (command: string, callback: Function) => {},
    executeCommand: async (command: string, ...args: any[]) => ({ success: true }),
    registerViewProvider: (viewId: string, provider: any) => {},
    showInformationMessage: async (message: string) => message,
    showErrorMessage: async (message: string) => message,
    showInputBox: async (options: any) => '',
    readFile: async (uri: string) => '',
    writeFile: async (uri: string, content: string) => {},
    getActiveEditor: () => undefined,
    setStatusBarMessage: (message: string, timeout?: number) => {}
  };

  const [pluginManager] = useState(new PluginManager(mockPluginAPI));
  const [loadedPlugins, setLoadedPlugins] = useState<Plugin[]>([]);
  const [activePlugin, setActivePlugin] = useState<Plugin | null>(null);
  const [pluginOutput, setPluginOutput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionHistory, setExecutionHistory] = useState<Array<{
    plugin: string;
    command: string;
    output: string;
    timestamp: number;
  }>>([]);

  useEffect(() => {
    initializePlugins();
  }, []);

  const initializePlugins = async () => {
    try {
      // Load default plugins
      const plugins = pluginManager.getPlugins();
      setLoadedPlugins(plugins);
      if (plugins.length > 0) {
        setActivePlugin(plugins[0]);
      }
    } catch (error) {
      console.error('Failed to load plugins:', error);
    }
  };

  const executePlugin = async (pluginId: string, command: string) => {
    setIsExecuting(true);
    try {
      const plugin = loadedPlugins.find(p => p.id === pluginId);
      if (!plugin) throw new Error('Plugin not found');

      // Log execution
      const startMessage = `Executing ${command} in ${plugin.name}...\n`;
      setPluginOutput(prev => prev + startMessage);
      
      // Simulate plugin execution
      await pluginManager.activatePlugin(pluginId);
      
      const completedMessage = `✓ Successfully executed ${command}`;
      setPluginOutput(prev => prev + completedMessage + '\n');
      
      setExecutionHistory(prev => [...prev, {
        plugin: plugin.name,
        command,
        output: startMessage + completedMessage,
        timestamp: Date.now()
      }]);
    } catch (error) {
      setPluginOutput(prev => prev + `✗ Error: ${(error as Error).message}\n`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="plugin-executor">
      <h2>🧩 Plugin Management System</h2>
      <div className="plugin-executor-layout">
        <div className="plugin-list">
          <h3>Available Plugins</h3>
          {loadedPlugins.map(plugin => (
            <div
              key={plugin.id}
              className={`plugin-entry ${activePlugin?.id === plugin.id ? 'active' : ''}`}
              onClick={() => setActivePlugin(plugin)}
            >
              <div className="plugin-info">
                <span className="plugin-name">{plugin.name}</span>
                <span className="plugin-version">v{plugin.version}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="plugin-details">
          {activePlugin ? (
            <>
              <h3>{activePlugin.name}</h3>
              <p>v{activePlugin.version}</p>
              <div className="plugin-actions">
                {activePlugin.contributes?.commands?.map(cmd => (
                  <button
                    key={cmd.command}
                    onClick={() => executePlugin(activePlugin.id, cmd.command)}
                    disabled={isExecuting}
                  >
                    {cmd.title}
                  </button>
                ))}
              </div>
              <div className="plugin-output">
                <h4>Output</h4>
                <pre>{pluginOutput}</pre>
              </div>
            </>
          ) : (
            <p>No plugin selected</p>
          )}
        </div>

        <div className="plugin-history">
          <h3>Execution History</h3>
          <div className="history-list">
            {executionHistory.map((entry, i) => (
              <div key={i} className="history-entry">
                <span className="history-plugin">{entry.plugin}</span>
                <span className="history-time">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PluginExecutor;
