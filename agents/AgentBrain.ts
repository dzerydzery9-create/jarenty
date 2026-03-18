/**
 * Agent Brain - handles reasoning, decision making, and multi-turn conversations
 * Implements Chain-of-Thought (CoT) and Tool-Use patterns
 */

export interface Thought {
  step: number;
  reasoning: string;
  action?: string;
  observation?: string;
  timestamp: Date;
}

export interface AgentMemory {
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  thoughts: Thought[];
  facts: Record<string, any>;
  tools: string[]; // Tools the agent can use
  context: {
    projectPath?: string;
    language?: string;
    framework?: string;
    [key: string]: any;
  };
}

export interface ReasoningStep {
  type: 'think' | 'use_tool' | 'decide' | 'generate';
  content: string;
  toolCall?: {
    name: string;
    params: Record<string, any>;
  };
}

/**
 * Brain engine for agents - handles complex reasoning and decision making
 */
export class AgentBrain {
  private memory: AgentMemory;
  private maxThoughts: number = 10; // Prevent infinite loops
  private thoughtChain: ReasoningStep[] = [];

  constructor(
    private aiService: any, // AIService instance
    initialContext?: Partial<AgentMemory['context']>
  ) {
    this.memory = {
      conversationHistory: [],
      thoughts: [],
      facts: {},
      tools: [],
      context: initialContext || {},
    };
  }

  /**
   * Main reasoning loop - Chain of Thought style
   */
  async think(userInput: string, availableTools: string[] = []): Promise<string> {
    this.memory.tools = availableTools;
    this.thoughtChain = [];

    // Step 1: Understand the problem
    const understanding = await this.understandProblem(userInput);
    this.thoughtChain.push({
      type: 'think',
      content: understanding,
    });

    // Step 2: Plan approach
    const plan = await this.planApproach(userInput, understanding);
    this.thoughtChain.push({
      type: 'think',
      content: plan,
    });

    // Step 3: Decide on tools/actions
    const toolPlan = await this.decideTools(plan, availableTools);
    if (toolPlan) {
      this.thoughtChain.push({
        type: 'decide',
        content: toolPlan.reasoning,
      });
    }

    // Step 4: Generate response
    const response = await this.generateResponse(userInput);

    // Record in conversation history
    this.memory.conversationHistory.push({ role: 'user', content: userInput });
    this.memory.conversationHistory.push({ role: 'assistant', content: response });

    return response;
  }

  /**
   * Understand what the user is asking
   */
  private async understandProblem(input: string): Promise<string> {
    const systemPrompt = `You are analyzing a user's request. Break it down:
1. What is the main goal?
2. What technologies/languages are involved?
3. What are the constraints?
4. Be concise in your analysis.`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: input },
    ]);

    return response.content;
  }

  /**
   * Plan the approach to solve the problem
   */
  private async planApproach(input: string, understanding: string): Promise<string> {
    const systemPrompt = `Based on understanding of the task, create a detailed plan:
1. Step-by-step approach
2. Key milestones
3. Potential challenges
Keep it concise.`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Task: ${input}\n\nUnderstanding: ${understanding}` },
    ]);

    return response.content;
  }

  /**
   * Decide which tools to use
   */
  private async decideTools(
    plan: string,
    availableTools: string[]
  ): Promise<{ reasoning: string; tools: string[] } | null> {
    if (availableTools.length === 0) return null;

    const toolsList = availableTools.join(', ');
    const systemPrompt = `Given the plan, which of these tools would help? ${toolsList}
List tools that are relevant to the plan. Be concise.`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: plan },
    ]);

    return {
      reasoning: response.content,
      tools: availableTools.filter((t) => response.content.toLowerCase().includes(t.toLowerCase())),
    };
  }

  /**
   * Generate final response
   */
  private async generateResponse(userInput: string): Promise<string> {
    const conversationContext = this.memory.conversationHistory
      .slice(-4) // Last 2 exchanges
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join('\n');

    const systemPrompt = `You are a helpful AI assistant helping with development tasks.
${conversationContext}`;

    const response = await this.aiService.sendMessage([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput },
    ]);

    return response.content;
  }

  /**
   * Multi-turn conversation - remember context from previous messages
   */
  async continueConversation(userInput: string): Promise<string> {
    // Add to history for context
    return this.think(userInput);
  }

  /**
   * Add fact to memory (knowledge)
   */
  addFact(key: string, value: any): void {
    this.memory.facts[key] = { value, timestamp: new Date() };
  }

  /**
   * Retrieve fact from memory
   */
  getFact(key: string): any {
    return this.memory.facts[key]?.value;
  }

  /**
   * Get conversation history
   */
  getHistory(): AgentMemory['conversationHistory'] {
    return this.memory.conversationHistory;
  }

  /**
   * Clear memory (start fresh)
   */
  clearMemory(): void {
    this.memory.conversationHistory = [];
    this.memory.thoughts = [];
    this.thoughtChain = [];
  }

  /**
   * Get reasoning steps (for debugging)
   */
  getReasoningSteps(): ReasoningStep[] {
    return this.thoughtChain;
  }

  /**
   * Update context (project info, language, etc)
   */
  updateContext(partial: Partial<AgentMemory['context']>): void {
    this.memory.context = { ...this.memory.context, ...partial };
  }

  /**
   * Get full memory state
   */
  getMemory(): AgentMemory {
    return this.memory;
  }
}

export default AgentBrain;
