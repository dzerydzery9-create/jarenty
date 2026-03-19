import Anthropic from 'anthropic';

export interface ClaudeMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ClaudeResponse {
  content: string;
  model: string;
  tokensUsed?: number;
}

class ClaudeService {
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model: string = 'claude-3-5-sonnet-20240620') {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async sendMessage(messages: ClaudeMessage[], options: { temperature?: number; top_p?: number } = {}): Promise<ClaudeResponse> {
    const response = await this.client.messages.create({
      model: this.model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      temperature: options.temperature || 0.1,
      top_p: options.top_p || 0.8,
      max_tokens: 2048,
    });

    return {
      content: response.content[0].text,
      model: this.model,
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
    };
  }

  async *streamChat(messages: ClaudeMessage[]): AsyncGenerator<string> {
    const stream = await this.client.messages.create({
      model: this.model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      stream: true,
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.text) {
        yield chunk.delta.text;
      }
    }
  }
}

export default ClaudeService;