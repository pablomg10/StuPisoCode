import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      hasGeminiKey: !!process.env.GOOGLE_GEMINI_API_KEY,
      enableGemini: process.env.CHAT_ENABLE_GEMINI === 'true',
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      enableOpenAI: process.env.CHAT_ENABLE_OPENAI === 'true',
    })
  } catch (e) {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
