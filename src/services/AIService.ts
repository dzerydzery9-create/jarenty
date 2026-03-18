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

class AIService {
  private model: string;
  private apiKey: string;

  constructor(model: string = 'gpt-3.5-turbo', apiKey?: string) {
    this.model = model;
    this.apiKey = apiKey || process.env.REACT_APP_OPENAI_API_KEY || '';
  }

  async sendMessage(messages: AIMessage[]): Promise<AIResponse> {
const ollama = require('../OllamaService').default;
    const messagesOllama: any[] = messages.map(m => ({ role: m.role, content: m.content }));
    const response = await ollama.chat(this.model, messagesOllama);
    return {
      content: response,
      model: this.model,
    };
  }

  async generateCode(prompt: string, language: string): Promise<string> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `You are a code generation expert. Generate clean, well-documented ${language} code.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    const response = await this.sendMessage(messages);
    return response.content;
  }

  setModel(model: string): void {
    this.model = model;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }
}

export default AIService;
