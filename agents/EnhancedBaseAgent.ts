/**
 * Enhanced BaseAgent - with AI reasoning, tool use, and memory
 * Replaces the simple BaseAgent with intelligent features
 */

import { AgentBrain } from './AgentBrain';
import { BuiltInTools, AgentTool, ToolDefinition } from './AgentTool';

export interface AgentConfig {
  name: string;
  description: string;
  capabilities: string[];
  supportedLanguages: string[];
}

export interface AgentTask {
  id: string;
  type: 'code-generation' | 'project-scaffold' | 'debug' | 'optimize' | string;
  description: string;
  input: Record<string, any>;
}

export interface AgentResult {
  taskId: string;
  success: boolean;
  output: string;
  errors?: string[];
  files?: Record<string, string>;
  reasoning?: string; // Chain of thought explanation
  toolsUsed?: string[]; // Which tools were used
}

/**
 * Enhanced Agent with AI intelligence, memory, and tools
 */
export abstract class EnhancedBaseAgent {
  config: AgentConfig;
  brain: AgentBrain;
  tools: Map<string, AgentTool>;
  private aiService: any;

  constructor(config: AgentConfig, aiService: any) {
    this.config = config;
    this.aiService = aiService;
    this.brain = new AgentBrain(aiService);
    this.tools = new Map();
    this.registerBuiltInTools();
  }

  /**
   * Register all built-in tools
   */
  private registerBuiltInTools(): void {
    BuiltInTools.getAll().forEach((tool) => {
      this.registerTool(tool);
    });
  }

  /**
   * Register a custom tool
   */
  protected registerTool(tool: AgentTool): void {
    this.tools.set(tool.definition.name, tool);
  }

  /**
   * Get available tools for this agent
   */
  getAvailableTools(): ToolDefinition[] {
    return Array.from(this.tools.values()).map((tool) => tool.definition);
  }

  /**
   * Execute a tool by name
   */
  async executeTool(name: string, params: Record<string, any>): Promise<any> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool "${name}" not found`);
    }
    return tool.execute(params);
  }

  /**
   * Intelligent reasoning before task execution
   */
  protected async reasonAboutTask(task: AgentTask): Promise<string> {
    const toolList = Array.from(this.tools.keys()).join(', ');
    const prompt = `You are the ${this.config.name}.
    
Task: ${task.description}
Details: ${JSON.stringify(task.input, null, 2)}

Available tools: ${toolList}
Supported languages: ${this.config.supportedLanguages.join(', ')}

Explain your approach to tackle this task:
1. What's the goal?
2. Which tools would you use?
3. What are potential challenges?`;

    const response = await this.aiService.sendMessage([
      {
        role: 'system',
        content: `You are a ${this.config.description}`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    return response.content;
  }

  /**
   * Main abstract method - implement in subclasses
   */
  abstract process(task: AgentTask): Promise<AgentResult>;

  /**
   * Check if agent can handle task
   */
  abstract canHandle(task: AgentTask): boolean;

  /**
   * Execute task with full intelligence pipeline
   */
  async execute(task: AgentTask): Promise<AgentResult> {
    if (!this.canHandle(task)) {
      return {
        taskId: task.id,
        success: false,
        output: `Agent ${this.config.name} cannot handle task type: ${task.type}`,
        errors: ['Incompatible task type'],
      };
    }

    try {
      // Step 1: Reason about the task
      const reasoning = await this.reasonAboutTask(task);

      // Step 2: Update brain context
      this.brain.updateContext({
        language: task.input.language,
        projectPath: task.input.projectPath,
      });

      // Step 3: Process with reasoning
      const result = await this.process(task);

      // Step 4: Add reasoning to result
      result.reasoning = reasoning;

      return result;
    } catch (error) {
      return {
        taskId: task.id,
        success: false,
        output: '',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Get agent memory state
   */
  getMemory() {
    return this.brain.getMemory();
  }

  /**
   * Clear agent memory
   */
  clearMemory(): void {
    this.brain.clearMemory();
  }

  /**
   * Continue conversation (multi-turn)
   */
  async continueConversation(input: string): Promise<string> {
    return this.brain.continueConversation(input);
  }

  /**
   * Get reasoning steps (for debugging)
   */
  getReasoningSteps() {
    return this.brain.getReasoningSteps();
  }
}

// Keep the old BaseAgent for backward compatibility
export abstract class BaseAgent extends EnhancedBaseAgent {
  constructor(config: AgentConfig) {
    const { default: AIService } = require('../src/services/AIService');
    const aiService = new AIService();
    super(config, aiService);
  }
}

export default EnhancedBaseAgent;
