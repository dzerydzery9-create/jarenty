import { EnhancedBaseAgent, AgentConfig, AgentTask, AgentResult } from './EnhancedBaseAgent';
import { AgentTool, BuiltInTools } from './AgentTool';

class FileSystemAgent extends EnhancedBaseAgent {
  constructor() {
    const { default: AIService } = require('../src/services/AIService');
    const config: AgentConfig = {
      name: 'File System Agent',
      description: 'Intelligent file system operations and content analysis using real IPC tools',
      capabilities: ['file-operations', 'directory-management', 'file-search', 'content-analysis', 'bulk-operations'],
      supportedLanguages: ['typescript', 'javascript', 'python', 'java', 'csharp', 'go', 'rust', 'all'],
    };
    const aiService = new AIService();
    super(config, aiService);
    this.registerFileSystemTools();
  }

  private registerFileSystemTools(): void {
    const bulkRenameTool: AgentTool = {
      definition: {
        name: 'bulk_rename',
        description: 'Rename multiple files based on pattern',
        parameters: [
          { name: 'pattern', type: 'string', description: 'Search pattern', required: true },
          { name: 'replacement', type: 'string', description: 'Replacement pattern', required: true },
        ],
      },
      execute: async (params) => {
        const cmd = `find . -name '${params.pattern}' -exec sh -c 'mv {} \$(echo {} | sed "s/${params.pattern}/${params.replacement}/g")' \\;`;
        return await BuiltInTools.executeCommand.execute({ command: cmd });
      },
    };

    const contentSearchTool: AgentTool = {
      definition: {
        name: 'content_search',
        description: 'Search content across files',
        parameters: [
          { name: 'query', type: 'string', description: 'Search query', required: true },
          { name: 'filePattern', type: 'string', description: 'File pattern to search in', required: true },
        ],
      },
      execute: async (params) => {
        if (typeof window === 'undefined' || !window.electronAPI?.tools) {
          return `Mock search for "${params.query}" in ${params.filePattern}`;
        }
        const cmd = `grep -r "${params.query}" . || echo "No matches"`;
        const result = await BuiltInTools.executeCommand.execute({ command: cmd });
        return result;
      },
    };

    this.registerTool(bulkRenameTool);
    this.registerTool(contentSearchTool);
  }

  canHandle(task: AgentTask): boolean {
    return ['file-operations', 'directory-management', 'file-search', 'content-analysis', 'bulk-operations'].includes(task.type);
  }

  async process(task: AgentTask): Promise<AgentResult> {
    const input = task.input as any;
    let result: any = '';
    let toolsUsed: string[] = [];

    try {
      if (!window.electronAPI?.tools) {
        result = 'Electron API not available - using planning mode';
        return { taskId: task.id, success: true, output: result, files: {}, toolsUsed };
      }

      switch (task.type) {
        case 'file-operations':
          toolsUsed = ['write_file', 'read_file'];
          if (input.operation === 'create' || input.operation === 'write') {
            result = await BuiltInTools.writeFile.execute({ path: input.path, content: input.content });
          } else if (input.operation === 'read') {
            result = await BuiltInTools.readFile.execute({ path: input.path });
          } else if (input.operation === 'delete') {
            result = await BuiltInTools.executeCommand.execute({ command: `rm -f "${input.path}"` });
          } else {
            result = await BuiltInTools.executeCommand.execute({ command: `ls -la "${input.path}"` });
          }
          break;
        case 'directory-management':
          toolsUsed = ['execute_command', 'listFiles'];
          if (input.operation === 'list') {
            result = await BuiltInTools.executeCommand.execute({ command: `ls -la ${input.path || '.'}` });
          } else if (input.operation === 'create') {
            result = await BuiltInTools.executeCommand.execute({ command: `mkdir -p "${input.path}"` });
          } else if (input.operation === 'remove') {
            result = await BuiltInTools.executeCommand.execute({ command: `rm -rf "${input.path}"` });
          } else {
            result = await window.electronAPI.tools.listFiles({ path: input.path || '.', recursive: true });
          }
          break;
        case 'file-search':
          toolsUsed = ['content_search'];
          result = await Array.from(this.tools.values()).find(t => t.definition.name === 'content_search')?.execute(input) || 'Search tool ready';
          break;
        case 'content-analysis':
          toolsUsed = ['read_file', 'analyze_code'];
          const fileContent = await BuiltInTools.readFile.execute({ path: input.path });
          if (fileContent && fileContent.content) {
            result = await BuiltInTools.analyzeCode.execute({ code: fileContent.content, language: 'typescript' });
          } else {
            result = 'Could not read file';
          }
          break;
        case 'bulk-operations':
          toolsUsed = ['bulk_rename', 'execute_command'];
          result = await Array.from(this.tools.values()).find(t => t.definition.name === 'bulk_rename')?.execute(input) || 'Bulk op ready';
          break;
      }

      return {
        taskId: task.id,
        success: true,
        output: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
        files: {},
        toolsUsed,
      };
    } catch (error) {
      return {
        taskId: task.id,
        success: false,
        output: `Error: ${error instanceof Error ? error.message : String(error)}`,
        errors: [],
      };
    }
  }
}

export default FileSystemAgent;

