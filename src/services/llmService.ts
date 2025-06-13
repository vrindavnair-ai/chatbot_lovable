
export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMResponse {
  message: string;
  error?: string;
}

export type LLMProvider = 'openai' | 'huggingface' | 'groq';

export class LLMService {
  private apiKey: string;
  private provider: LLMProvider;
  private baseUrl: string;

  constructor(apiKey: string, provider: LLMProvider = 'huggingface') {
    this.apiKey = apiKey;
    this.provider = provider;
    this.baseUrl = this.getBaseUrl(provider);
  }

  private getBaseUrl(provider: LLMProvider): string {
    switch (provider) {
      case 'openai':
        return 'https://api.openai.com/v1';
      case 'huggingface':
        return 'https://api-inference.huggingface.co/models';
      case 'groq':
        return 'https://api.groq.com/openai/v1';
      default:
        return 'https://api-inference.huggingface.co/models';
    }
  }

  async generateResponse(messages: LLMMessage[]): Promise<LLMResponse> {
    try {
      if (this.provider === 'huggingface') {
        return await this.generateHuggingFaceResponse(messages);
      } else {
        return await this.generateOpenAICompatibleResponse(messages);
      }
    } catch (error) {
      console.error('LLM API Error:', error);
      return {
        message: '',
        error: error instanceof Error ? error.message : 'Failed to generate response',
      };
    }
  }

  private async generateHuggingFaceResponse(messages: LLMMessage[]): Promise<LLMResponse> {
    // Use a free model like microsoft/DialoGPT-medium or facebook/blenderbot-400M-distill
    const model = 'microsoft/DialoGPT-medium';
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    const response = await fetch(`${this.baseUrl}/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: lastMessage,
        parameters: {
          max_length: 200,
          temperature: 0.7,
          do_sample: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (Array.isArray(data) && data[0]?.generated_text) {
      return {
        message: data[0].generated_text.replace(lastMessage, '').trim() || 'I understand. How can I help you?',
      };
    }

    return {
      message: 'I understand. How can I help you?',
    };
  }

  private async generateOpenAICompatibleResponse(messages: LLMMessage[]): Promise<LLMResponse> {
    const model = this.provider === 'groq' ? 'llama-3.1-8b-instant' : 'gpt-4.1-2025-04-14';
    
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      message: data.choices[0]?.message?.content || 'No response generated',
    };
  }
}
