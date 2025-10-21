import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, language = 'en' } = body || {};

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 });
    }

    const SYSTEM_PROMPT = `You are a friendly AI language learning coach. Your role is to help students practice their target language. 

Guidelines:
- Respond in the user's target language (${language})
- Correct mistakes gently and provide the correct version
- Give encouraging feedback and praise good attempts
- Provide example sentences when helpful
- Keep responses concise (1-2 sentences)
- Focus on pronunciation, grammar, and vocabulary
- Be supportive and motivating

Examples of good responses:
- "Great pronunciation! That was very clear."
- "Good try! The correct way to say that is: [correct version]"
- "Excellent! You're improving quickly. Try this sentence: [example]"
- "Nice work! Remember to pronounce the 'th' sound more clearly."`;

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const fallbackResponses = {
        en: `Great! I heard you say: "${text}". Your pronunciation sounds good! Try saying it again with more confidence.`,
        ar: `ممتاز! سمعتك تقول: "${text}". نطقك جيد جداً! جرب قوله مرة أخرى بثقة أكثر.`,
        nl: `Geweldig! Ik hoorde je zeggen: "${text}". Je uitspraak klinkt goed! Probeer het nog eens met meer vertrouwen.`,
        id: `Bagus! Saya mendengar Anda berkata: "${text}". Pelafalan Anda terdengar bagus! Coba katakan lagi dengan lebih percaya diri.`,
        ms: `Bagus! Saya dengar anda berkata: "${text}". Sebutan anda kedengaran bagus! Cuba sebut lagi dengan lebih yakin.`,
        th: `เยี่ยม! ฉันได้ยินคุณพูดว่า: "${text}". การออกเสียงของคุณฟังดูดี! ลองพูดอีกครั้งด้วยความมั่นใจมากขึ้น`,
        km: `ល្អណាស់! ខ្ញុំបានឮអ្នកនិយាយថា: "${text}". ការបញ្ចេញសម្លេងរបស់អ្នកស្តាប់ល្អ! សូមព្យាយាមនិយាយម្តងទៀតដោយមានទំនុកចិត្តច្រើនជាងមុន។`
      };

      const responseText = fallbackResponses[language as keyof typeof fallbackResponses] || fallbackResponses.en;
      return NextResponse.json({ reply: responseText });
    }

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Language: ${language}\nUser: ${text}` }
        ],
        temperature: 0.6,
        max_tokens: 180
      })
    });

    if (!openaiRes.ok) {
      const errTxt = await openaiRes.text();
      console.error('[AI Coach] OpenAI error:', errTxt);
      return NextResponse.json({ error: 'AI provider error' }, { status: 500 });
    }

    const data = await openaiRes.json();
    const reply = data?.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    return NextResponse.json({ reply });

  } catch (e) {
    console.error('[AI Coach] API error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
