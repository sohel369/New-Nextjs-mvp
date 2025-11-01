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

    // Check content type to detect HTML responses (404 pages)
    const contentType = response.headers.get('content-type') || '';
    const isJSON = contentType.includes('application/json');
    
    let data;
    if (!isJSON) {
      // Clone response to read text without consuming the stream
      const text = await response.clone().text();
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        throw new Error('API routes are not available in static export mode. Please use development mode (npm run dev) or deploy with API routes support.');
      }
      throw new Error(`Unexpected response format: ${response.status} ${response.statusText}`);
    }
    
    data = await response.json();
    
    if (!response.ok) {
      const errorData: ChatError = data;
      console.error('[Gemini Client] API Error:', errorData);
      
      // Handle specific error cases
      if (errorData.error === 'Gemini API key not configured') {
        throw new Error('AI Coach is not configured. Please contact support to enable this feature.');
      }
      
      if (errorData.error === 'No valid response received from Gemini') {
        throw new Error('AI Coach is temporarily unavailable. Please try again in a moment.');
      }
      
      throw new Error(errorData.error || `HTTP ${response.status}: ${errorData.details || 'Unknown error'}`);
    }

    if (!data.reply) {
      throw new Error('No valid response received from AI Coach.');
    }

    console.log('[Gemini Client] Received response:', data.reply);
    return data.reply;
    
  } catch (error) {
    console.error('[Gemini Client] Error sending message:', error);
    
    if (error instanceof Error) {
      // Provide user-friendly error messages
      if (error.message.includes('API key not configured')) {
        throw new Error('AI Coach is not available. Please contact support.');
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to AI Coach. Please check your internet connection.');
      }
      throw error;
    }
    
    throw new Error('Failed to communicate with AI Coach. Please try again later.');
  }
}