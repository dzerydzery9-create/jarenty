// AI model integration service
export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  model: string;
  tokensUsed?: number;
}

import OllamaService from './OllamaService';

class AIService {
  private ollama = OllamaService;
  private model: string = 'qwen2.5:0.5b'; // Default to user's Qwen

  constructor(model?: string) {
    if (model) this.model = model;
  }

  async sendMessage(messages: AIMessage[], options: { temperature?: number; top_p?: number; stream?: boolean } = {}): Promise<AIResponse> {
    const params = {
      model: this.model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      options: {
        temperature: options.temperature || 0.1, // Low for consistency
        top_p: options.top_p || 0.8,
        num_predict: 2048, // Faster limit
        ...options,
      },
    };

    if (params.options.stream) {
      // Stream handled by caller
      return { content: '', model: this.model };
    }

    const response = await this.ollama.chat(params.model, params.messages as any, params.options);
    return {
      content: response,
      model: this.model,
    };
  }

  async *streamChat(messages: AIMessage[]): AsyncGenerator<string> {
    const params = {
      model: this.model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      options: { temperature: 0.1, top_p: 0.8, stream: true },
    };

    for await (const chunk of this.ollama.chatStream(params.model, params.messages as any)) {
      yield chunk;
    }
  }

  async generateCode(prompt: string, language: string): Promise<string> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `You are an expert ${language} developer. Generate clean, production-ready code. Be concise.`,
      },
      { role: 'user', content: prompt },
    ];

    const response = await this.sendMessage(messages, { temperature: 0.2 });
    return response.content;
  }

  setModel(model: string): void {
    this.model = model;
  }
}

export default AIService;
