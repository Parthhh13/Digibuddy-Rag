const API_BASE_URL = 'http://localhost:8000/api';

export interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
  status: 'success' | 'error';
  error?: string;
  sources?: string[] | null;
  used_knowledge_base?: boolean;
}

export const chatService = {
  async sendMessage(message: string, chatHistory: ChatMessage[] = []): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          chat_history: chatHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        response: 'Sorry, I encountered an error while processing your message. Please try again later.',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
}; 