/**
 * Enhanced Agent Manager with orchestration
 * Agents can now communicate, delegate tasks, and work together
 */

import { EnhancedBaseAgent, AgentTask, AgentResult } from './EnhancedBaseAgent';
import CodeGenerationAgent from './CodeGenerationAgent';
import UIAgent from './UIAgent';
import DebuggingAgent from './DebuggingAgent';
import TestingAgent from './TestingAgent';
import ProjectAnalysisAgent from './ProjectAnalysisAgent';
import FileSystemAgent from './FileSystemAgent';
import { AgentKnowledge } from './AgentKnowledge';

export interface LoadedAgent {
  agent: EnhancedBaseAgent;
  name: string;
  capabilities: string[];
}

export interface ExecutionPlan {
  taskId: string;
  steps: AgentTask[];
  agentSequence: string[];
  reasoning: string;
}

/**
 * Agent Manager - orchestrates multi-agent workflows
 */
class AgentManager {
  private agents: Map<string, LoadedAgent> = new Map();
  private static instance: AgentManager;
  private executionHistory: AgentResult[] = [];
  private aiService: any;

  private constructor() {
    const { default: AIService } = require('../src/services/AIService');
    this.aiService = new AIService();
    this.registerAllAgents();
  }

  static getInstance(): AgentManager {
    if (!AgentManager.instance) {
      AgentManager.instance = new AgentManager();
    }
    return AgentManager.instance;
  }

  /**
   * Register all available agents
   */
  private registerAllAgents(): void {
    try {
      this.registerAgent('CodeGenerationAgent', new CodeGenerationAgent());
      this.registerAgent('UIAgent', new UIAgent());
      this.registerAgent('DebuggingAgent', new DebuggingAgent());
      this.registerAgent('TestingAgent', new TestingAgent());
      this.registerAgent('ProjectAnalysisAgent', new ProjectAnalysisAgent());
      this.registerAgent('FileSystemAgent', new FileSystemAgent());
    } catch (error) {
      console.error('Error registering agents:', error);
    }
  }

  /**
   * Register a new agent
   */
  registerAgent(name: string, agent: EnhancedBaseAgent): void {
    this.agents.set(name, {
      agent,
      name,
      capabilities: agent.config.capabilities,
    });
  }

  /**
   * Get agent by name
   */
  getAgent(name: string): EnhancedBaseAgent | undefined {
    return this.agents.get(name)?.agent;
  }

  /**
   * Get all agents
   */
  getAllAgents(): LoadedAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * List all available agents with their capabilities
   */
  getAgentSummary(): Array<{ name: string; capabilities: string[] }> {
    return this.getAllAgents().map((agent) => ({
      name: agent.name,
      capabilities: agent.capabilities,
    }));
  }

  /**
   * Find an agent that can handle a specific task
   */
  findSuitableAgent(task: AgentTask): EnhancedBaseAgent | null {
    for (const { agent } of this.agents.values()) {
      if (agent.canHandle(task)) {
        return agent;
      }
    }
    return null;
  }

  /**
   * Find multiple agents for complex tasks
   */
  findMultipleAgents(capabilities: string[]): EnhancedBaseAgent[] {
    const suitableAgents: EnhancedBaseAgent[] = [];
    for (const { agent, capabilities: agentCaps } of this.agents.values()) {
      if (capabilities.some((cap) => agentCaps.includes(cap))) {
        suitableAgents.push(agent);
      }
    }
    return suitableAgents;
  }

  /**
   * Execute a task with the most suitable agent
   */
  async executeTask(agentName: string, task: AgentTask): Promise<AgentResult> {
    const agent = this.getAgent(agentName);
    if (!agent) {
      return {
        taskId: task.id,
        success: false,
        output: '',
        errors: [`Agent "${agentName}" not found`],
      };
    }

    try {
      const result = await agent.execute(task);
      this.executionHistory.push(result);
      return result;
    } catch (error) {
      const result: AgentResult = {
        taskId: task.id,
        success: false,
        output: '',
        errors: [error instanceof Error ? error.message : 'Task execution failed'],
      };
      this.executionHistory.push(result);
      return result;
    }
  }

  /**
   * Auto-execute task with intelligent agent selection
   */
  async autoExecuteTask(task: AgentTask): Promise<AgentResult> {
    const agent = this.findSuitableAgent(task);
    if (!agent) {
      return {
        taskId: task.id,
        success: false,
        output: '',
        errors: ['No suitable agent found for this task'],
      };
    }

    try {
      const result = await agent.execute(task);
      this.executionHistory.push(result);
      return result;
    } catch (error) {
      const result: AgentResult = {
        taskId: task.id,
        success: false,
        output: '',
        errors: [error instanceof Error ? error.message : 'Auto-execution failed'],
      };
      this.executionHistory.push(result);
      return result;
    }
  }

  /**
   * Create an execution plan for complex tasks
   */
  async createExecutionPlan(task: AgentTask): Promise<ExecutionPlan> {
    const planPrompt = `You are a task planning specialist. Given this task, create an execution plan:

Task: ${task.description}
Details: ${JSON.stringify(task.input, null, 2)}

Available agents and capabilities:
${this.getAgentSummary()
  .map((a) => `- ${a.name}: ${a.capabilities.join(', ')}`)
  .join('\n')}

Create a step-by-step plan:
1. Break down the task into subtasks
2. Assign agents to each subtask
3. Explain the reasoning
4. Consider dependencies between steps

Format your response as JSON with keys: steps (array of subtasks), agents (array of agent names), reasoning (string)`;

    try {
      const response = await this.aiService.sendMessage([
        {
          role: 'system',
          content:
            'You are an expert task planner that optimizes multi-agent workflows. Respond with valid JSON only.',
        },
        { role: 'user', content: planPrompt },
      ]);

      // Parse response
      const parsed = JSON.parse(response.content);

      return {
        taskId: task.id,
        steps: parsed.steps || [],
        agentSequence: parsed.agents || [],
        reasoning: parsed.reasoning || 'No reasoning provided',
      };
    } catch (error) {
      // Fallback plan
      return {
        taskId: task.id,
        steps: [task],
        agentSequence: Array.from(this.agents.keys()).slice(0, 1),
        reasoning: 'Fallback plan created due to planning error',
      };
    }
  }

  /**
   * Execute a complex plan with multiple agents
   */
  async executePlan(plan: ExecutionPlan): Promise<AgentResult[]> {
    const results: AgentResult[] = [];

    for (let i = 0; i < plan.steps.length; i++) {
      const step = plan.steps[i];
      const agentName = plan.agentSequence[i] || plan.agentSequence[0];

      try {
        const result = await this.executeTask(agentName, step);
        results.push(result);

        if (!result.success) {
          console.warn(`Task ${step.id} failed with agent ${agentName}`);
        }
      } catch (error) {
        results.push({
          taskId: step.id,
          success: false,
          output: '',
          errors: [error instanceof Error ? error.message : 'Unknown error'],
        });
      }
    }

    return results;
  }

  /**
   * Get available knowledge for agents
   */
  getKnowledge(category: 'languages' | 'patterns' | 'practices'): any {
    switch (category) {
      case 'languages':
        return {
          available: AgentKnowledge.getAllLanguages(),
          details: (language: string) => AgentKnowledge.getLanguageInfo(language),
        };
      case 'patterns':
        return {
          available: AgentKnowledge.getAllPatterns(),
          details: (pattern: string) => AgentKnowledge.getPattern(pattern),
        };
      case 'practices':
        return {
          security: AgentKnowledge.getSecurityPractices(),
          performance: AgentKnowledge.getPerformancePractices(),
          testing: AgentKnowledge.getTestingPractices(),
          code: AgentKnowledge.getCodePractices(),
        };
      default:
        return {};
    }
  }

  /**
   * Get execution history
   */
  getExecutionHistory(): AgentResult[] {
    return this.executionHistory;
  }

  /**
   * Clear execution history
   */
  clearHistory(): void {
    this.executionHistory = [];
  }

  /**
   * Get agent memory state
   */
  getAgentMemory(agentName: string): any {
    const agent = this.getAgent(agentName);
    return agent ? agent.getMemory() : null;
  }

  /**
   * Clear all agent memories
   */
  clearAllMemories(): void {
    this.getAllAgents().forEach(({ agent }) => {
      agent.clearMemory();
    });
  }
}

export default AgentManager;
