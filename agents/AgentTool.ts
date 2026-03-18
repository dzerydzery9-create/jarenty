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
      // Will be implemented by TerminalExecutor
      return `[File content from ${params.path}]`;
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
      return `File written to ${params.path}`;
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
      return `Command executed: ${params.command}`;
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
