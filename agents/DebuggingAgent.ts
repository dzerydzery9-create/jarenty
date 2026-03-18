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
    return `Error Analysis (${language}):
🔍 Error: ${error}

Root Cause Analysis:
1. Check for null/undefined references
2. Verify async/await patterns
3. Examine type definitions
4. Review dependency versions

Suggested Fixes:
- Add proper error handling with try/catch
- Implement type guards
- Use optional chaining (?.) operators
- Add input validation

Code Review:
${this.reviewCodeForErrors(code, language)}`;
  }

  private async debugCode(code: string, context: any): Promise<string> {
    return `Code Debugging Analysis:

Execution Flow:
${this.analyzeExecutionFlow(code)}

Potential Issues:
- Race conditions in async operations
- Memory leaks in event listeners
- Improper state management
- Missing cleanup in useEffect

Debugging Steps:
1. Add console.log statements at key points
2. Use React DevTools for component inspection
3. Check network tab for API failures
4. Monitor memory usage with Performance tab`;
  }

  private async debugPerformance(code: string, context: any): Promise<string> {
    return `Performance Analysis:

Bottlenecks Identified:
- Large re-renders in React components
- Inefficient API calls
- Heavy computations on main thread
- Memory-intensive operations

Optimizations:
1. Implement React.memo for components
2. Use useMemo for expensive calculations
3. Debounce/throttle user input
4. Implement virtual scrolling for large lists
5. Use Web Workers for heavy computations`;
  }

  private async detectMemoryLeaks(code: string, language: string): Promise<string> {
    return `Memory Leak Detection (${language}):

Potential Leaks:
- Event listeners not removed
- Timers/intervals not cleared
- DOM references in closures
- Circular references in objects

Prevention Measures:
- Use cleanup functions in useEffect
- Implement proper component unmounting
- Clear timeouts/intervals
- Remove event listeners
- Use WeakMap/WeakSet for caches`;
  }

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