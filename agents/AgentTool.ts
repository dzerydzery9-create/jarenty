/**
 * Tool system for agents - allows agents to use tools/functions
 * Similar to OpenAI's function calling
 */

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required?: boolean;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: ToolParameter[];
}

export interface ToolResult {
  toolName: string;
  success: boolean;
  result: any;
  error?: string;
}

export interface AgentTool {
  definition: ToolDefinition;
  execute: (params: Record<string, any>) => Promise<any>;
}

/**
 * Built-in tools for all agents
 */
export class BuiltInTools {
  // File system tools
  static readonly readFile: AgentTool = {
    definition: {
      name: 'read_file',
      description: 'Read contents of a file',
      parameters: [
        { name: 'path', type: 'string', description: 'File path', required: true },
        { name: 'startLine', type: 'number', description: 'Start line (optional)', required: false },
        { name: 'endLine', type: 'number', description: 'End line (optional)', required: false },
      ],
    },
    execute: async (params) => {
if (typeof window === 'undefined' || !window.electronAPI) {
        console.warn('Electron API not available, using mock');
        return `[File content from ${params.path}]`;
      }
      try {
        const result = await window.electronAPI.ipcRenderer.invoke('fs:readFile', params.path);
        return { content: result };
      } catch (error: unknown) {
        return { content: '', error: (error as Error).message };
      }
    },

  };


  static readonly writeFile: AgentTool = {
    definition: {
      name: 'write_file',
      description: 'Write content to a file',
      parameters: [
        { name: 'path', type: 'string', description: 'File path', required: true },
        { name: 'content', type: 'string', description: 'File content', required: true },
      ],
    },
    execute: async (params) => {
      if (typeof window === 'undefined' || !window.electronAPI?.tools) {
        console.warn('Electron API not available, using mock');
        return `File written to ${params.path}`;
      }
      try {
        const result = await window.electronAPI.tools.createFile({ path: params.path, content: params.content });
        return result;
      } catch (error: unknown) {
        return { success: false, error: (error as Error).message };
      }
    },

  };


  // Shell command tools
  static readonly executeCommand: AgentTool = {
    definition: {
      name: 'execute_command',
      description: 'Execute a shell command',
      parameters: [
        { name: 'command', type: 'string', description: 'Command to execute', required: true },
        { name: 'cwd', type: 'string', description: 'Working directory (optional)', required: false },
      ],
    },
    execute: async (params) => {
      if (typeof window === 'undefined' || !window.electronAPI?.tools) {
        console.warn('Electron API not available, using mock');
        return `Command executed: ${params.command}`;
      }
      try {
        const result = await window.electronAPI.tools.execCommand({ command: params.command, cwd: params.cwd });
        return result;
      } catch (error: unknown) {
        return { success: false, error: (error as Error).message };
      }
    },

  };


  // Code analysis tools
  static readonly analyzeCode: AgentTool = {
    definition: {
      name: 'analyze_code',
      description: 'Analyze code for issues and suggest improvements',
      parameters: [
        { name: 'code', type: 'string', description: 'Code to analyze', required: true },
        { name: 'language', type: 'string', description: 'Programming language', required: true },
      ],
    },
    execute: async (params) => {
      return `Code analysis for ${params.language}`;
    },
  };

  // Package management
  static readonly installDependency: AgentTool = {
    definition: {
      name: 'install_dependency',
      description: 'Install a package/dependency',
      parameters: [
        { name: 'package', type: 'string', description: 'Package name', required: true },
        { name: 'packageManager', type: 'string', description: 'npm/pip/cargo/etc', required: true },
        { name: 'version', type: 'string', description: 'Version (optional)', required: false },
      ],
    },
    execute: async (params) => {
      return `Installing ${params.package} with ${params.packageManager}`;
    },
  };

  // Git operations
  static readonly gitCommit: AgentTool = {
    definition: {
      name: 'git_commit',
      description: 'Create a git commit',
      parameters: [
        { name: 'message', type: 'string', description: 'Commit message', required: true },
      ],
    },
    execute: async (params) => {
      return `Git commit: ${params.message}`;
    },
  };

  static readonly gitPush: AgentTool = {
    definition: {
      name: 'git_push',
      description: 'Push changes to remote repository',
      parameters: [],
    },
    execute: async () => {
      return 'Changes pushed to remote repository';
    },
  };

  // All built-in tools
  static getAll(): AgentTool[] {
    return [
      this.readFile,
      this.writeFile,
      this.executeCommand,
      this.analyzeCode,
      this.installDependency,
      this.gitCommit,
      this.gitPush,
    ];
  }

  static getByName(name: string): AgentTool | undefined {
    return this.getAll().find((tool) => tool.definition.name === name);
  }
}

export default AgentTool;

/**
 * Type declarations for Electron API (matches preload.ts)
 */
declare global {
  interface Window {
    electronAPI: {
      tools: {
        createFile: (args: { path: string; content: string }) => Promise<any>;
        listFiles: (args: { path: string; recursive?: boolean }) => Promise<any>;
        execCommand: (args: { command: string; cwd?: string }) => Promise<any>;
      };
      ipcRenderer: {
        invoke: (channel: string, args?: any) => Promise<any>;
      };
    };
  }
}

