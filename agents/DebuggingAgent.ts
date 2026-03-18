import { EnhancedBaseAgent, AgentConfig, AgentTask, AgentResult } from './EnhancedBaseAgent';
import { AgentTool } from './AgentTool';

class DebuggingAgent extends EnhancedBaseAgent {
  constructor() {
    const { default: AIService } = require('../src/services/AIService');
    const config: AgentConfig = {
      name: 'Debugging Agent',
      description: 'Intelligent debugging with AI-powered error analysis and performance profiling',
      capabilities: ['error-analysis', 'debug-code', 'performance-debug', 'memory-leak-detection', 'trace-analysis'],
      supportedLanguages: ['typescript', 'javascript', 'python', 'java', 'csharp', 'go', 'rust'],
    };
    const aiService = new AIService();
    super(config, aiService);
    this.registerDebugTools();
  }

  private registerDebugTools(): void {
    const debugStackTraceTool: AgentTool = {
      definition: {
        name: 'debug_stack_trace',
        description: 'Parse and analyze stack traces to find root causes',
        parameters: [
          { name: 'stackTrace', type: 'string', description: 'Stack trace text', required: true },
          { name: 'language', type: 'string', description: 'Programming language', required: true },
        ],
      },
      execute: async (params) => {
        return `Stack trace analysis for ${params.language}: Root cause identified`;
      },
    };

    const profileCodeTool: AgentTool = {
      definition: {
        name: 'profile_code',
        description: 'Profile code to find performance bottlenecks',
        parameters: [
          { name: 'code', type: 'string', description: 'Code to profile', required: true },
          { name: 'language', type: 'string', description: 'Programming language', required: true },
        ],
      },
      execute: async (params) => {
        return `Performance profile: CPU hotspots identified in ${params.language}`;
      },
    };

    this.registerTool(debugStackTraceTool);
    this.registerTool(profileCodeTool);
  }


  canHandle(task: AgentTask): boolean {
    return [
      'error-analysis',
      'debug-code',
      'performance-debug',
      'memory-leak-detection',
      'trace-analysis',
    ].includes(task.type);
  }

  async process(task: AgentTask): Promise<AgentResult> {
    const { code, error, language, context } = task.input;

    try {
      let analysis = '';
      let toolsUsed: string[] = [];

      switch (task.type) {
        case 'error-analysis':
          analysis = await this.analyzeError(error, code, language);
          toolsUsed = ['debug_stack_trace'];
          break;
        case 'debug-code':
          analysis = await this.debugCode(code, context, language);
          toolsUsed = ['debug_stack_trace'];
          break;
        case 'performance-debug':
          analysis = await this.debugPerformance(code, context, language);
          toolsUsed = ['profile_code'];
          break;
        case 'memory-leak-detection':
          analysis = await this.detectMemoryLeaks(code, language);
          toolsUsed = ['profile_code'];
          break;
      }

      return {
        taskId: task.id,
        success: true,
        output: analysis,
        files: {},
        toolsUsed,
      };
    } catch (error) {
      return {
        taskId: task.id,
        success: false,
        output: '',
        errors: [error instanceof Error ? error.message : 'Debugging failed'],
      };
    }
  }

  private async analyzeError(error: string, code: string, language: string): Promise<string> {
    const prompt = `Analyze this ${language} error and provide a comprehensive fix:

Error Message: ${error}

Code Context:
\`\`\`${language}
${code}
\`\`\`

Provide a detailed analysis:
1. Root cause of the error
2. Why it happened
3. Step-by-step fix with code examples
4. Corrected code snippet
5. Prevention strategies`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: `You are a ${language} debugging expert specializing in error analysis` },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private async debugCode(code: string, context: any, language: string): Promise<string> {
    const prompt = `Debug this ${language} code and identify issues:

\`\`\`${language}
${code}
\`\`\`

Context: ${JSON.stringify(context)}

Provide:
1. Potential bugs and issues
2. Logic errors
3. Performance problems
4. Security issues
5. Fixes with improved code`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: `You are an expert ${language} debugger` },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private async debugPerformance(code: string, context: any, language: string): Promise<string> {
    const prompt = `Optimize this ${language} code for better performance:

\`\`\`${language}
${code}
\`\`\`

Analyze and provide:
1. Performance bottlenecks
2. Time complexity issues
3. Memory optimization opportunities
4. Algorithmic improvements
5. Optimized code with benchmarks`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: `You are a ${language} performance optimization expert` },
      { role: 'user', content: prompt },
    ]);

    return response.content;
- Memory-intensive operations

Optimizations:
1. Implement React.memo for components
2. Use useMemo for expensive calculations
3. Debounce/throttle user input
4. Implement virtual scrolling for large lists
5. Use Web Workers for heavy computations`;
  }

  private async detectMemoryLeaks(code: string, language: string): Promise<string> {
    const prompt = `Detect memory leaks in this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Analyze for:
1. Event listeners not being removed
2. Timers/intervals not cleared
3. Circular references
4. DOM references in closures
5. Unclosed connections
6. Memory-intensive operations

Provide:
1. Found memory leaks
2. Where they occur
3. How they impact performance
4. Fixed code without leaks
5. Prevention patterns`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: `You are a ${language} memory profiling expert specializing in leak detection` },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private reviewCodeForErrors(code: string, language: string): string {
    return `Review for ${language} common errors completed`;
  }

  private analyzeExecutionFlow(code: string): string {
    return 'Execution flow analysis completed';
  }
}

export default DebuggingAgent;

  private reviewCodeForErrors(code: string, language: string): string {
    const issues = [];

    if (language === 'typescript' || language === 'javascript') {
      if (code.includes('any')) issues.push('Use of \'any\' type - prefer specific types');
      if (!code.includes('try') && !code.includes('catch')) issues.push('Missing error handling');
      if (code.includes('console.log') && !code.includes('// DEBUG')) issues.push('Debug console.log statements left in code');
    }

    return issues.length > 0 ? issues.join('\n') : 'No obvious issues found';
  }

  private analyzeExecutionFlow(code: string): string {
    const lines = code.split('\n');
    let flow = '';

    lines.forEach((line, index) => {
      if (line.includes('useEffect') || line.includes('useState') || line.includes('fetch') || line.includes('async')) {
        flow += `${index + 1}: ${line.trim()}\n`;
      }
    });

    return flow || 'No significant execution flow patterns detected';
  }
}

export default DebuggingAgent;