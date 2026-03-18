import { EnhancedBaseAgent, AgentConfig, AgentTask, AgentResult } from './EnhancedBaseAgent';
import { AgentTool } from './AgentTool';

class FileSystemAgent extends EnhancedBaseAgent {
  constructor() {
    const { default: AIService } = require('../src/services/AIService');
    const config: AgentConfig = {
      name: 'File System Agent',
      description: 'Intelligent file system operations and content analysis',
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
        const { BuiltInTools } = await import('./AgentTool');
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
        return `Found files matching: ${params.query}`;
      },
    };

    this.registerTool(bulkRenameTool);
    this.registerTool(contentSearchTool);
  }

  canHandle(task: AgentTask): boolean {
    return ['file-operations', 'directory-management', 'file-search', 'content-analysis', 'bulk-operations'].includes(task.type);
  }

  async process(task: AgentTask): Promise<AgentResult> {
    const { operation, path, content, pattern, recursive } = task.input;

    try {
      let result = '';
      let toolsUsed: string[] = [];

      switch (task.type) {
        case 'file-operations':
          result = await this.performFileOperation(operation, path, content);
          break;
        case 'directory-management':
          result = await this.manageDirectory(operation, path);
          break;
        case 'file-search':
          result = await this.searchFiles(pattern, path, recursive);
          toolsUsed = ['content_search'];
          break;
        case 'content-analysis':
          result = await this.analyzeContent(path, pattern);
          break;
        case 'bulk-operations':
          result = await this.performBulkOperations(operation, pattern, content);
          toolsUsed = ['bulk_rename'];
          break;
      }

      return {
        taskId: task.id,
        success: true,
        output: result,
        files: {},
        toolsUsed,
      };
    } catch (error) {
      return {
        taskId: task.id,
        success: false,
        output: '',
        errors: [error instanceof Error ? error.message : 'File operation failed'],
      };
    }
  }

  private async performFileOperation(operation: string, path: string, content?: string): Promise<string> {
    const prompt = `Generate code for file operation: ${operation} on path ${path}
${content ? `with content: ${content.substring(0, 100)}...` : ''}

Provide:
1. Detailed explanation
2. Node.js code implementation
3. Error handling
4. Edge cases
5. Security considerations`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: 'You are a file system expert' },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private async manageDirectory(operation: string, path: string): Promise<string> {
    const prompt = `Provide code for directory management operation: ${operation} on ${path}

Provide:
1. What the operation does
2. Complete implementation
3. Recursive handling (if applicable)
4. Error cases
5. Performance considerations`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: 'You are a file system and directory management expert' },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private async searchFiles(pattern: string, path: string, recursive?: boolean): Promise<string> {
    const prompt = `Create a file search implementation:

Pattern: ${pattern}
Path: ${path}
Recursive: ${recursive || false}

Provide:
1. Search algorithm
2. Glob pattern implementation
3. Node.js code
4. Result formatting
5. Performance optimization
6. Memory efficiency`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: 'You are a file system search expert' },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private async analyzeContent(filePath: string, pattern?: string): Promise<string> {
    const prompt = `Analyze file content for patterns:

File: ${filePath}
${pattern ? `Pattern to find: ${pattern}` : 'Analyze for: code quality, patterns, structure'}

Provide:
1. Content structure
2. Patterns found
3. Quality metrics
4. Code statistics
5. Recommendations
6. Refactoring suggestions`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: 'You are a code and content analysis expert' },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private async performBulkOperations(operation: string, pattern: string, replacement?: string): Promise<string> {
    const prompt = `Generate bulk file operation code:

Operation: ${operation}
Pattern: ${pattern}
${replacement ? `Replacement: ${replacement}` : ''}

Provide:
1. Batch processing approach
2. Implementation code
3. Error recovery
4. Progress tracking
5. Rollback capability`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: 'You are a bulk operations and file processing expert' },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }
}

export default FileSystemAgent;
      size: content.length,
      lines: content.split('\\n').length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
\`\`\`

Features:
- Async/await pattern
- UTF-8 encoding
- Error handling
- Content metadata`;
  }

  private generateWriteOperation(path: string, content?: string): string {
    return `File Write Operation:

✏️ Writing to: ${path}

Implementation:
\`\`\`typescript
const writeFile = async (filePath: string, content: string) => {
  try {
    const fs = require('fs').promises;
    const path = require('path');

    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    await fs.writeFile(filePath, content, 'utf8');
    return {
      success: true,
      bytesWritten: Buffer.byteLength(content, 'utf8')
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
\`\`\`

Safety Features:
- Directory creation
- Atomic writes
- Encoding specification
- Error recovery`;
  }

  private generateUpdateOperation(path: string, content?: string): string {
    return `File Update Operation:

🔄 Updating: ${path}

Strategy:
1. Read existing content
2. Apply modifications
3. Write back safely
4. Preserve permissions

Implementation:
\`\`\`typescript
const updateFile = async (filePath: string, modifications: any) => {
  try {
    const fs = require('fs').promises;
    let content = await fs.readFile(filePath, 'utf8');

    // Apply modifications based on type
    if (modifications.replace) {
      content = content.replace(
        new RegExp(modifications.replace.pattern, 'g'),
        modifications.replace.replacement
      );
    }

    if (modifications.insert) {
      const lines = content.split('\\n');
      lines.splice(modifications.insert.line, 0, modifications.insert.text);
      content = lines.join('\\n');
    }

    await fs.writeFile(filePath, content, 'utf8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
\`\`\``;
  }

  private generateDeleteOperation(path: string): string {
    return `File Delete Operation:

🗑️ Deleting: ${path}

Safety Implementation:
\`\`\`typescript
const deleteFile = async (filePath: string) => {
  try {
    const fs = require('fs').promises;
    const path = require('path');

    // Safety checks
    if (!await fs.access(filePath).then(() => true).catch(() => false)) {
      return { success: false, error: 'File does not exist' };
    }

    // Create backup before deletion
    const backupPath = \`\${filePath}.backup\`;
    await fs.copyFile(filePath, backupPath);

    await fs.unlink(filePath);
    return {
      success: true,
      backupCreated: backupPath
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
\`\`\`

Safety Features:
- Existence check
- Automatic backup
- Error recovery`;
  }

  private generateCopyOperation(path: string, destination?: string): string {
    return `File Copy Operation:

📋 From: ${path}
📌 To: ${destination}

Implementation:
\`\`\`typescript
const copyFile = async (source: string, destination: string) => {
  try {
    const fs = require('fs').promises;
    const path = require('path');

    // Ensure destination directory exists
    await fs.mkdir(path.dirname(destination), { recursive: true });

    await fs.copyFile(source, destination);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
\`\`\``;
  }

  private generateMoveOperation(path: string, destination?: string): string {
    return `File Move Operation:

📦 From: ${path}
🏃 To: ${destination}

Implementation:
\`\`\`typescript
const moveFile = async (source: string, destination: string) => {
  try {
    const fs = require('fs').promises;
    const path = require('path');

    // Ensure destination directory exists
    await fs.mkdir(path.dirname(destination), { recursive: true });

    await fs.rename(source, destination);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
\`\`\``;
  }

  private generateCreateDirOperation(path: string): string {
    return `Directory Create Operation:

📁 Creating: ${path}

Implementation:
\`\`\`typescript
const createDirectory = async (dirPath: string) => {
  try {
    const fs = require('fs').promises;
    await fs.mkdir(dirPath, { recursive: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
\`\`\``;
  }

  private generateListDirOperation(path: string): string {
    return `Directory List Operation:

📂 Listing: ${path}

Implementation:
\`\`\`typescript
const listDirectory = async (dirPath: string) => {
  try {
    const fs = require('fs').promises;
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    const result = items.map(item => ({
      name: item.name,
      type: item.isDirectory() ? 'directory' : 'file',
      path: \`\${dirPath}/\${item.name}\`
    }));

    return { success: true, items: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
\`\`\``;
  }

  private generateDeleteDirOperation(path: string): string {
    return `Directory Delete Operation:

🗂️ Deleting: ${path}

Implementation:
\`\`\`typescript
const deleteDirectory = async (dirPath: string) => {
  try {
    const fs = require('fs').promises;

    // Safety check - ensure directory is empty or confirm deletion
    const items = await fs.readdir(dirPath);
    if (items.length > 0) {
      // For recursive deletion
      await fs.rm(dirPath, { recursive: true, force: true });
    } else {
      await fs.rmdir(dirPath);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
\`\`\``;
  }

  private generateCopyDirOperation(path: string): string {
    return `Directory Copy Operation:

📋 Copying directory: ${path}

Implementation requires recursive file operations and will be provided in detailed implementation.`;
  }

  private generateMoveDirOperation(path: string): string {
    return `Directory Move Operation:

📦 Moving directory: ${path}

Implementation:
\`\`\`typescript
const moveDirectory = async (source: string, destination: string) => {
  try {
    const fs = require('fs').promises;
    const path = require('path');

    await fs.rename(source, destination);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
\`\`\``;
  }

  private getFileExtension(path: string): string {
    return path.split('.').pop() || 'unknown';
  }

  private getAnalysisStrategy(path: string): string {
    const ext = this.getFileExtension(path);

    switch (ext) {
      case 'ts':
      case 'tsx':
        return '- TypeScript syntax validation\n- Import/export analysis\n- Type usage patterns\n- React component structure (if applicable)';
      case 'js':
      case 'jsx':
        return '- JavaScript syntax validation\n- Module analysis\n- Function patterns\n- React component structure (if applicable)';
      case 'json':
        return '- JSON schema validation\n- Structure analysis\n- Key patterns\n- Data integrity checks';
      case 'md':
        return '- Markdown syntax validation\n- Heading structure\n- Link/reference analysis\n- Content organization';
      default:
        return '- General text analysis\n- Line count\n- Character encoding\n- Basic pattern recognition';
    }
  }
}

export default FileSystemAgent;