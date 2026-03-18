// Agent System - Autonomous task execution
// Inspired by AutoGPT, LangChain Agents

export interface Agent {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  tools: Tool[];
  maxIterations?: number;
  temperature?: number;
  model: string;
}

export interface Tool {
  name: string;
  description: string;
  schema: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
  handler: (params: any) => Promise<any>;
}

export interface AgentMemory {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
  }>;
  context: Record<string, any>;
  maxMessages?: number;
}

export interface AgentExecutionResult {
  success: boolean;
  result?: any;
  error?: string;
  steps: string[];
  toolsUsed: string[];
}

/**
 * Base Agent class for executing autonomous tasks
 */
export class AIAgent {
  private memory: AgentMemory = { messages: [], context: {}, maxMessages: 50 };
  private executionHistory: Array<{ tool: string; input: any; output: any; timestamp: number }> = [];

  constructor(
    private agent: Agent,
    private ollamaApi: (model: string, prompt: string) => Promise<string>,
    private tokenizer: (text: string) => number = (t) => Math.ceil(t.length / 4)
  ) {}

  /**
   * Execute agent task
   */
  async execute(userInput: string): Promise<AgentExecutionResult> {
    const steps: string[] = [];
    const toolsUsed: string[] = [];
    let iteration = 0;
    const maxIterations = this.agent.maxIterations || 10;

    try {
      steps.push(`Starting agent: ${this.agent.name}`);
      this.memory.messages.push({
        role: 'user',
        content: userInput,
        timestamp: Date.now()
      });

      while (iteration < maxIterations) {
        iteration++;
        steps.push(`Iteration ${iteration}/${maxIterations}`);

        // Get agent decision
        const decision = await this.decideTool(userInput, steps);

        if (decision.type === 'finish') {
          const result = decision.result || 'Task completed';
          steps.push(`Agent finished with result: ${result}`);
          this.memory.messages.push({
            role: 'assistant',
            content: result,
            timestamp: Date.now()
          });
          return {
            success: true,
            result,
            steps,
            toolsUsed
          };
        }

        if (decision.type === 'tool' && decision.toolName) {
          const tool = this.agent.tools.find(t => t.name === decision.toolName);
          if (!tool) {
            steps.push(`❌ Tool not found: ${decision.toolName}`);
            continue;
          }

          try {
            steps.push(`Using tool: ${decision.toolName}`);
            toolsUsed.push(decision.toolName);

            const output = await tool.handler(decision.input);
            this.executionHistory.push({
              tool: decision.toolName,
              input: decision.input,
              output,
              timestamp: Date.now()
            });

            steps.push(`✅ Tool result: ${JSON.stringify(output).substring(0, 100)}`);

            this.memory.messages.push({
              role: 'assistant',
              content: `Tool: ${decision.toolName}\nInput: ${JSON.stringify(decision.input)}\nOutput: ${JSON.stringify(output)}`
            });
          } catch (error) {
            steps.push(`❌ Tool error: ${error}`);
            this.memory.messages.push({
              role: 'assistant',
              content: `Tool failed: ${error}`
            });
          }
        }

        // Trim memory if too large
        if (this.memory.messages.length > (this.agent.maxIterations || 50)) {
          this.memory.messages = this.memory.messages.slice(-20);
        }
      }

      steps.push(`⚠️  Max iterations reached (${maxIterations})`);
      return {
        success: false,
        error: 'Max iterations reached',
        steps,
        toolsUsed
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        steps,
        toolsUsed
      };
    }
  }

  /**
   * Decide which tool to use or finish
   */
  private async decideTool(userInput: string, recentSteps: string[]): Promise<{
    type: 'tool' | 'finish';
    toolName?: string;
    input?: any;
    result?: string;
  }> {
    const toolDescriptions = this.agent.tools
      .map(t => `- ${t.name}: ${t.description}\n  Schema: ${JSON.stringify(t.schema)}`)
      .join('\n');

    const prompt = `
System: ${this.agent.systemPrompt}

Available tools:
${toolDescriptions}

Your task: ${userInput}

Recent progress:
${recentSteps.slice(-5).join('\n')}

Previous messages:
${this.memory.messages.slice(-10).map(m => `${m.role}: ${m.content}`).join('\n')}

Decide your next action. Respond ONLY with JSON:
{
  "reasoning": "why you chose this",
  "action": "tool" or "finish",
  "toolName": "tool name if action is tool",
  "input": { params for tool },
  "result": "explanation if finishing"
}`;

    try {
      const response = await this.ollamaApi(this.agent.model, prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const decision = JSON.parse(jsonMatch[0]);
        return {
          type: decision.action === 'finish' ? 'finish' : 'tool',
          toolName: decision.toolName,
          input: decision.input,
          result: decision.result
        };
      }
    } catch (error) {
      console.error('Error in decideTool:', error);
    }

    return { type: 'finish', result: 'Could not process request' };
  }

  /**
   * Get execution history
   */
  getExecutionHistory() {
    return this.executionHistory;
  }

  /**
   * Clear memory
   */
  clearMemory() {
    this.memory = { messages: [], context: {} };
    this.executionHistory = [];
  }
}

/**
 * Agent Factory - Create predefined agents
 */
export class AgentFactory {
  static createCodeAgent(): Agent {
    return {
      id: 'code-agent',
      name: 'Code Agent',
      description: 'Executes code-related tasks like file creation, modification, testing',
      systemPrompt: 'You are an expert programmer. Help the user with coding tasks. Use tools to create files, modify code, and run tests.',
      model: 'deepseek-coder:1.3b',
      tools: [
        {
          name: 'createFile',
          description: 'Create a new file with content',
          schema: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'File path' },
              content: { type: 'string', description: 'File content' }
            },
            required: ['path', 'content']
          },
handler: async (params) => {
            if (typeof window === 'undefined' || !window.electronAPI?.tools) {
              console.warn('Electron API not available, using mock');
              return { success: true, path: params.path, mock: true };
            }
            try {
              const result = await window.electronAPI.tools.createFile(params);
              return result;
            } catch (error) {
              return { success: false, error: (error as Error).message };
            }
          }
        },
        {
          name: 'readFile',
          description: 'Read file content',
          schema: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'File path' }
            },
            required: ['path']
          },
          handler: async (params) => {
            if (typeof window === 'undefined' || !window.electronAPI?.tools) {
              console.warn('Electron API not available, using mock');
              return { content: '[MOCK FILE CONTENT]' };
            }
            try {
              const result = await window.electronAPI.ipcRenderer.invoke('fs:readFile', params.path);
              return { content: result };
            } catch (error) {
              return { content: '', error: (error as Error).message };
            }
          }
        }
      ]
    };
  }

  static createResearchAgent(): Agent {
    return {
      id: 'research-agent',
      name: 'Research Agent',
      description: 'Conducts research and analysis',
      systemPrompt: 'You are a research assistant. Help the user find information and analyze data.',
      model: 'gemma3:270m',
      tools: [
        {
          name: 'search',
          description: 'Search for information',
          schema: {
            type: 'object',
            properties: {
              query: { type: 'string' }
            },
            required: ['query']
          },
          handler: async (params) => {
            return { results: [] };
          }
        }
      ]
    };
  }

  static createDebugAgent(): Agent {
    return {
      id: 'debug-agent',
      name: 'Debug Agent',
      description: 'Helps debug and troubleshoot issues',
      systemPrompt: 'You are a debugging expert. Help the user find and fix issues in their code.',
      model: 'deepseek-coder:1.3b',
      tools: [
        {
          name: 'runCommand',
          description: 'Run a command and get output',
          schema: {
            type: 'object',
            properties: {
              command: { type: 'string' }
            },
            required: ['command']
          },
          handler: async (params) => {
            if (typeof window === 'undefined' || !window.electronAPI?.tools) {
              console.warn('Electron API not available, using mock');
              return { output: `[MOCK OUTPUT from ${params.command}]` };
            }
            try {
              const result = await window.electronAPI.tools.execCommand({ command: params.command });
              return result;
            } catch (error) {
              return { output: '', error: (error as Error).message };
            }
          }
        }
      ]
    };
  }
}

/**
 * Predefined Agents for different tasks
 */
declare global {
  interface Window {
    electronAPI: {
      tools: {
        createFile: (args: any) => Promise<any>;
        listFiles: (args: any) => Promise<any>;
        execCommand: (args: any) => Promise<any>;
      };
      ipcRenderer: {
        invoke: (channel: string, args: any) => Promise<any>;
      };
    };
  }
}

export const PREDEFINED_AGENTS = {
  code: AgentFactory.createCodeAgent(),
  research: AgentFactory.createResearchAgent(),
  debug: AgentFactory.createDebugAgent()
};

