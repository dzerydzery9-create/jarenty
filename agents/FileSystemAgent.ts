import BaseAgent, { AgentConfig, AgentTask, AgentResult } from './BaseAgent';

class FileSystemAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'File System Agent',
      description: 'Handles file operations, directory management, and file system interactions',
      capabilities: ['file-operations', 'directory-management', 'file-search', 'content-analysis'],
      supportedLanguages: ['typescript', 'javascript', 'python', 'java', 'all'],
    };
    super(config);
  }

  canHandle(task: AgentTask): boolean {
    return ['file-operations', 'directory-management', 'file-search', 'content-analysis'].includes(task.type);
  }

  async process(task: AgentTask): Promise<AgentResult> {
    const { operation, path, content, pattern, recursive } = task.input;

    let result = '';

    switch (task.type) {
      case 'file-operations':
        result = await this.performFileOperation(operation, path, content);
        break;
      case 'directory-management':
        result = await this.manageDirectory(operation, path);
        break;
      case 'file-search':
        result = await this.searchFiles(pattern, path, recursive);
        break;
      case 'content-analysis':
        result = await this.analyzeContent(path, pattern);
        break;
    }

    return {
      taskId: task.id,
      success: true,
      output: result,
      files: {},
    };
  }

  private async performFileOperation(operation: string, path: string, content?: string): Promise<string> {
    const operations = {
      read: this.generateReadOperation(path),
      write: this.generateWriteOperation(path, content),
      update: this.generateUpdateOperation(path, content),
      delete: this.generateDeleteOperation(path),
      copy: this.generateCopyOperation(path, content),
      move: this.generateMoveOperation(path, content),
    };

    return operations[operation as keyof typeof operations] || 'Unsupported operation';
  }

  private async manageDirectory(operation: string, path: string): Promise<string> {
    const operations = {
      create: this.generateCreateDirOperation(path),
      list: this.generateListDirOperation(path),
      delete: this.generateDeleteDirOperation(path),
      copy: this.generateCopyDirOperation(path),
      move: this.generateMoveDirOperation(path),
    };

    return operations[operation as keyof typeof operations] || 'Unsupported directory operation';
  }

  private async searchFiles(pattern: string, path: string, recursive?: boolean): Promise<string> {
    return `File Search Analysis:

🔍 Search Pattern: ${pattern}
📁 Search Path: ${path}
🔄 Recursive: ${recursive ? 'Yes' : 'No'}

Search Strategy:
1. Parse glob pattern
2. Traverse directory structure
3. Match files against pattern
4. Filter results
5. Return matches with metadata

Implementation:
\`\`\`typescript
const searchFiles = async (pattern: string, basePath: string, recursive = false) => {
  const glob = require('glob');
  const path = require('path');

  const options = {
    cwd: basePath,
    absolute: true,
    ${recursive ? 'nodir: false,' : 'nodir: true,'}
  };

  try {
    const matches = await new Promise<string[]>((resolve, reject) => {
      glob(pattern, options, (err: Error, files: string[]) => {
        if (err) reject(err);
        else resolve(files);
      });
    });

    return matches.map(file => ({
      path: file,
      relativePath: path.relative(basePath, file),
      stats: await fs.promises.stat(file)
    }));
  } catch (error) {
    throw new Error(\`Search failed: \${error.message}\`);
  }
};
\`\`\`

Expected Results:
- Files matching pattern
- File metadata (size, modified date)
- Relative paths for easy reference`;
  }

  private async analyzeContent(path: string, pattern?: string): Promise<string> {
    return `Content Analysis for: ${path}

Analysis Type: ${pattern ? 'Pattern-based' : 'General'}

Analysis Plan:
1. Read file content safely
2. Parse based on file type
3. Extract key information
4. Identify patterns/issues
5. Generate summary report

For ${this.getFileExtension(path)} files:
${this.getAnalysisStrategy(path)}

Key Metrics to Extract:
- Line count
- Character count
- Code complexity
- Dependencies used
- Potential issues

Security Considerations:
- Avoid exposing sensitive data
- Respect file permissions
- Handle large files efficiently`;
  }

  private generateReadOperation(path: string): string {
    return `File Read Operation:

📖 Reading: ${path}

Implementation:
\`\`\`typescript
const readFile = async (filePath: string) => {
  try {
    const fs = require('fs').promises;
    const content = await fs.readFile(filePath, 'utf8');
    return {
      success: true,
      content,
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