import { EnhancedBaseAgent, AgentConfig, AgentTask, AgentResult } from './EnhancedBaseAgent';
import { AgentTool, ToolDefinition } from './AgentTool';

const pythonProjectTemplate = {
  'requirements.txt': 'requests\nnumpy\npandas\n',
  'main.py': 'def main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()\n',
  '.gitignore': '__pycache__/\n*.pyc\nvenv/\n.env\n',
};

const nodeProjectTemplate = {
  'package.json': JSON.stringify(
    {
      name: 'my-project',
      version: '1.0.0',
      description: 'Generated project',
      main: 'index.js',
      scripts: {
        start: 'node index.js',
        dev: 'nodemon index.js',
      },
      dependencies: {},
    },
    null,
    2
  ),
  'index.js': 'console.log("Hello, World!");\n',
  '.gitignore': 'node_modules/\n.env\n.DS_Store\n',
};

/**
 * Enhanced Code Generation Agent with AI reasoning
 */
class CodeGenerationAgent extends EnhancedBaseAgent {
  constructor() {
    const { default: AIService } = require('../src/services/AIService');
    const config: AgentConfig = {
      name: 'Code Generation Agent',
      description: 'Intelligent code generation with best practices and architecture design',
      capabilities: ['code-generation', 'project-scaffold', 'component-generation', 'refactoring'],
      supportedLanguages: [
        'python',
        'javascript',
        'typescript',
        'java',
        'go',
        'rust',
        'csharp',
        'php',
        'ruby',
      ],
    };
    const aiService = new AIService('deepseek-coder');
    super(config, aiService);
    this.registerCustomTools();
  }

  /**
   * Register custom tools for code generation
   */
  private registerCustomTools(): void {
    // Template generation tool
    const templateTool: AgentTool = {
      definition: {
        name: 'generate_from_template',
        description: 'Generate project from a template',
        parameters: [
          { name: 'language', type: 'string', description: 'Programming language', required: true },
          { name: 'projectType', type: 'string', description: 'Type of project', required: true },
        ],
      },
      execute: async (params) => {
        const { language, projectType } = params;
        if (language === 'python') return pythonProjectTemplate;
        if (language === 'javascript' || language === 'typescript') return nodeProjectTemplate;
        return { 'README.md': `# ${projectType} Project\n\nGenerated ${language} project` };
      },
    };

    this.registerTool(templateTool);
  }

  canHandle(task: AgentTask): boolean {
    return [
      'code-generation',
      'project-scaffold',
      'component-generation',
      'refactoring',
    ].includes(task.type);
  }

  async process(task: AgentTask): Promise<AgentResult> {
    const { prompt, language = 'typescript', projectType = 'api' } = task.input;

    try {
      // Step 1: Reason about code structure
      const structurePrompt = `Design a ${projectType} project structure in ${language}.
Requirements: ${prompt}

Provide:
1. Folder structure
2. File organization
3. Key files to create
4. Dependencies needed`;

      const structureResponse = await this.aiService.sendMessage([
        { role: 'system', content: 'You are an expert software architect' },
        { role: 'user', content: structurePrompt },
      ]);

      // Step 2: Generate actual code
      const codePrompt = `Generate clean, production-ready ${language} code for:
${prompt}

Requirements:
- Follow ${language} best practices
- Include error handling
- Add meaningful comments
- Make it production-ready`;

      const codeResponse = await this.aiService.sendMessage([
        {
          role: 'system',
          content: `You are an expert ${language} developer. Generate clean, well-structured code.`,
        },
        { role: 'user', content: codePrompt },
      ]);

      // Step 3: Generate tests
      const testPrompt = `Generate unit tests in ${language} for the above code using standard testing frameworks.`;

      const testResponse = await this.aiService.sendMessage([
        {
          role: 'system',
          content: `You are an expert test writer for ${language}`,
        },
        { role: 'user', content: testPrompt },
      ]);

      // Step 4: Prepare files
      const files: Record<string, string> = {};
      const ext = this.getFileExtension(language);
      files[`generated.${ext}`] = codeResponse.content;
      files[`generated.test.${ext}`] = testResponse.content;
      files['STRUCTURE.md'] = structureResponse.content;

      return {
        taskId: task.id,
        success: true,
        output: `Generated ${language} code with tests and documentation`,
        files,
        toolsUsed: ['code_generation', 'test_generation'],
      };
    } catch (error) {
      return {
        taskId: task.id,
        success: false,
        output: '',
        errors: [error instanceof Error ? error.message : 'Code generation failed'],
      };
    }
  }

  /**
   * Get file extension for language
   */
  private getFileExtension(language: string): string {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      go: 'go',
      rust: 'rs',
      csharp: 'cs',
      php: 'php',
      ruby: 'rb',
    };
    return extensions[language] || 'txt';
  }
}

export default CodeGenerationAgent;
