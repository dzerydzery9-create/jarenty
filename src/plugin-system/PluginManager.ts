// Plugin System Architecture for AI Agent Builder
// Inspired by VS Code extension system

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  activationEvents: string[];
  main: string;
  contributes?: {
    commands?: Command[];
    viewsContainers?: ViewContainer[];
    views?: Record<string, View[]>;
    keybindings?: Keybinding[];
  };
}

export interface Command {
  command: string;
  title: string;
  category: string;
  icon?: string;
}

export interface ViewContainer {
  id: string;
  title: string;
  icon: string;
  order?: number;
}

export interface View {
  id: string;
  name: string;
  when?: string;
}

export interface Keybinding {
  command: string;
  key: string;
  when?: string;
  mac?: string;
  linux?: string;
  win?: string;
}

export interface PluginContext {
  extensionPath: string;
  globalStoragePath: string;
  workspaceStoragePath: string;
  subscribe(disposable: any): void;
}

export interface PluginAPI {
  // Commands
  registerCommand(command: string, callback: Function): void;
  executeCommand(command: string, ...args: any[]): Promise<any>;
  
  // Views
  registerViewProvider(viewId: string, provider: TreeDataProvider): void;
  
  // UI
  showInformationMessage(message: string): Promise<string | undefined>;
  showErrorMessage(message: string): Promise<string | undefined>;
  showInputBox(options: InputBoxOptions): Promise<string | undefined>;
  
  // File system
  readFile(uri: string): Promise<string>;
  writeFile(uri: string, content: string): Promise<void>;
  
  // Editor
  getActiveEditor(): Editor | undefined;
  
  // Status bar
  setStatusBarMessage(message: string, timeout?: number): void;
}

export interface TreeDataProvider {
  getTreeItem(element: any): TreeItem;
  getChildren(element?: any): Thenable<any[]>;
}

export interface TreeItem {
  label: string;
  collapsibleState?: 'none' | 'collapsed' | 'expanded';
  iconPath?: string;
  command?: Command;
}

export interface InputBoxOptions {
  placeholder?: string;
  prompt?: string;
  password?: boolean;
  validateInput?(value: string): string | null;
}

export interface Editor {
  document: Document;
  selection: Selection;
  edit(callback: (editBuilder: EditBuilder) => void): Promise<boolean>;
}

export interface Document {
  uri: string;
  fileName: string;
  isDirty: boolean;
  getText(): string;
  save(): Promise<boolean>;
}

export interface Selection {
  start: Position;
  end: Position;
}

export interface Position {
  line: number;
  character: number;
}

export interface EditBuilder {
  insert(position: Position, value: string): void;
  delete(range: Range): void;
  replace(range: Range, value: string): void;
}

export interface Range {
  start: Position;
  end: Position;
}

/**
 * Plugin Manager - Handles loading, enabling, and managing plugins
 */
export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private activatedPlugins: Set<string> = new Set();
  private pluginContexts: Map<string, PluginContext> = new Map();
  
  constructor(private api: PluginAPI) {}

  /**
   * Load a plugin from path
   */
  async loadPlugin(pluginPath: string): Promise<Plugin> {
    try {
      const pluginJson = require(`${pluginPath}/package.json`);
      const plugin: Plugin = {
        id: pluginJson.name,
        name: pluginJson.displayName || pluginJson.name,
        version: pluginJson.version,
        description: pluginJson.description,
        author: pluginJson.author,
        activationEvents: pluginJson.activationEvents || [],
        main: pluginJson.main || 'out/extension.js',
        contributes: pluginJson.contributes
      };

      this.plugins.set(plugin.id, plugin);
      return plugin;
    } catch (error) {
      throw new Error(`Failed to load plugin from ${pluginPath}: ${error}`);
    }
  }

  /**
   * Activate a plugin
   */
  async activatePlugin(pluginId: string): Promise<void> {
    if (this.activatedPlugins.has(pluginId)) {
      return;
    }

    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    const context: PluginContext = {
      extensionPath: '',
      globalStoragePath: '',
      workspaceStoragePath: '',
      subscribe: () => {}
    };

    this.pluginContexts.set(pluginId, context);

    // Load and execute plugin
    try {
      const moduleExports = require(plugin.main);
      if (moduleExports.activate) {
        await moduleExports.activate(context, this.api);
      }
      this.activatedPlugins.add(pluginId);
    } catch (error) {
      throw new Error(`Failed to activate plugin ${pluginId}: ${error}`);
    }
  }

  /**
   * Get all plugins
   */
  getPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get activated plugins
   */
  getActivatedPlugins(): Plugin[] {
    return this.getPlugins().filter(p => this.activatedPlugins.has(p.id));
  }
}

/**
 * Default plugins
 */
export const DEFAULT_PLUGINS = {
  'ai-chat': {
    name: 'AI Chat',
    activationEvents: ['onView:chatView'],
    commands: [
      { command: 'ai.chat.send', title: 'Send Message', category: 'Chat' },
      { command: 'ai.chat.clear', title: 'Clear Chat', category: 'Chat' }
    ]
  },
  'agent-executor': {
    name: 'Agent Executor',
    activationEvents: ['onCommand:agent.run'],
    commands: [
      { command: 'agent.run', title: 'Run Agent', category: 'Agent' },
      { command: 'agent.stop', title: 'Stop Agent', category: 'Agent' }
    ]
  },
  'model-manager': {
    name: 'Model Manager',
    activationEvents: ['onView:modelView'],
    commands: [
      { command: 'model.pull', title: 'Pull Model', category: 'Models' },
      { command: 'model.delete', title: 'Delete Model', category: 'Models' },
      { command: 'model.select', title: 'Select Model', category: 'Models' }
    ]
  },
  'file-explorer': {
    name: 'File Explorer',
    activationEvents: ['onView:explorerView'],
    commands: [
      { command: 'file.open', title: 'Open File', category: 'File' },
      { command: 'file.new', title: 'New File', category: 'File' }
    ]
  }
};
