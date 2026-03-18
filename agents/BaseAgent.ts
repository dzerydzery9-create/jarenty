/**
 * Base Agent exports - now uses Enhanced Agent with AI intelligence
 * For backward compatibility, re-export from EnhancedBaseAgent
 */
export { EnhancedBaseAgent as BaseAgent, AgentConfig, AgentTask, AgentResult } from './EnhancedBaseAgent';

// Keep old interface names for compatibility
export interface AgentConfig {
  name: string;
  description: string;
  capabilities: string[];
  supportedLanguages: string[];
}

export interface AgentTask {
  id: string;
  type: string;
  description: string;
  input: Record<string, any>;
}

export interface AgentResult {
  taskId: string;
  success: boolean;
  output: string;
  errors?: string[];
  files?: Record<string, string>;
  reasoning?: string;
  toolsUsed?: string[];
}

export default {};
