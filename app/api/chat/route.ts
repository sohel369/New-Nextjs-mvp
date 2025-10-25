import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Runtime configuration for API route
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    console.log('[Gemini API] Request received');
    
    // Validate request body
    let body;
    try {
      body = await req.json();
      console.log('[Gemini API] Request body:', body);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { message } = body;

    // Validate input
    if (!message || typeof message !== 'string') {
      console.log('[Gemini API] Invalid message:', message);
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get Gemini API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('[Gemini API] Using API key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');

    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return NextResponse.json({ 
        error: 'Gemini API key not configured',
        details: 'Please set GEMINI_API_KEY environment variable'
      }, { status: 500 });
    }

    // Initialize Google Generative AI
    console.log('[Gemini API] Initializing Google Generative AI...');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Generate content
    console.log('[Gemini API] Generating content...');
    const prompt = `You are a helpful AI language learning coach. Provide SHORT, concise responses (1-2 sentences maximum). Be encouraging and educational. Focus on grammar, vocabulary, and pronunciation tips. Keep answers brief and to the point.\n\nUser message: ${message}`;
    
    const result = await model.generateContent(prompt, {
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100, // Limit to shorter responses
        topP: 0.8,
        topK: 40
      }
    });
    const response = await result.response;
    const reply = response.text();
    
    console.log('[Gemini API] Generated reply:', reply);

    if (!reply) {
      console.error('[Gemini API] No valid response received from Gemini');
      return NextResponse.json({ 
        error: 'No valid response received from Gemini',
        details: 'The API returned an empty response'
      }, { status: 500 });
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Return detailed error information
    return NextResponse.json({ 
      error: 'Gemini API request failed',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}