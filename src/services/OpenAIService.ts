import OpenAI from 'openai';

export interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenAIResponse {
  content: string;
  model: string;
  tokensUsed?: number;
}

class OpenAIService {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4') {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async sendMessage(messages: OpenAIMessage[], options: { temperature?: number; top_p?: number } = {}): Promise<OpenAIResponse> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      temperature: options.temperature || 0.1,
      top_p: options.top_p || 0.8,
      max_tokens: 2048,
    });

    return {
      content: response.choices[0].message.content || '',
      model: this.model,
      tokensUsed: response.usage?.total_tokens,
    };
  }

  async *streamChat(messages: OpenAIMessage[]): AsyncGenerator<string> {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }
}

export default OpenAIService;