import OllamaService from './OllamaService';
import OpenAIService from './OpenAIService';
import ClaudeService from './ClaudeService';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  model: string;
  tokensUsed?: number;
}

type AIProvider = 'ollama' | 'openai' | 'claude';

class AIService {
  private model: string;
  private aiService: any;

  constructor(provider: AIProvider, apiKey: string, model?: string) {
    this.model = model || 'qwen2.5:0.5b';
    switch (provider) {
      case 'openai':
        this.aiService = new OpenAIService(apiKey, this.model);
        break;
      case 'claude':
        this.aiService = new ClaudeService(apiKey, this.model);
        break;
      default:
        this.aiService = new OllamaService(); // Fixed: No arguments needed
    }
  }

  async sendMessage(messages: AIMessage[], options: { temperature?: number; top_p?: number; stream?: boolean } = {}): Promise<AIResponse> {
    return this.aiService.sendMessage(messages, options);
  }

  async *streamChat(messages: AIMessage[]): AsyncGenerator<string> {
    for await (const chunk of this.aiService.streamChat(messages)) {
      yield chunk;
    }
  }
}

export default AIService;
