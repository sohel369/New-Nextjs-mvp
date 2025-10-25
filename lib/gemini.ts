// lib/gemini.ts
interface ChatResponse {
  reply: string;
}

interface ChatError {
  error: string;
  details?: string;
  status?: number;
}

export async function sendMessage(message: string): Promise<string> {
  try {
    console.log('[Gemini Client] Sending message:', message);
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      const errorData: ChatError = data;
      console.error('[Gemini Client] API Error:', errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: ${errorData.details || 'Unknown error'}`);
    }

    if (!data.reply) {
      throw new Error('No valid response received from Gemini.');
    }

    console.log('[Gemini Client] Received response:', data.reply);
    return data.reply;
    
  } catch (error) {
    console.error('[Gemini Client] Error sending message:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to communicate with AI coach');
  }
}