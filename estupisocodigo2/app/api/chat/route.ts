import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Environment variables (optional):
// - To enable Google Gemini (Generative): set GOOGLE_GEMINI_API_KEY and CHAT_ENABLE_GEMINI=true
// The code uses Gemini when enabled; otherwise falls back to a SQL summary.

// Minimal API: accepts { message, filters } and returns { reply, results }
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message: string = body.message || ''
    const filters: any = body.filters || {}

  const supabase = await createClient()

    // Basic fallback: map simple filters
    let query = supabase.from('properties').select('id, title, description, address, city, price_monthly, latitude, longitude, images').eq('active', true)

    if (filters.city) query = query.eq('city', filters.city)
    if (filters.minPrice) query = query.gte('price_monthly', Number(filters.minPrice))
    if (filters.maxPrice) query = query.lte('price_monthly', Number(filters.maxPrice))
    if (filters.bedrooms) query = query.eq('bedrooms', Number(filters.bedrooms))

    // naive full-text filter on message for title/description/address
    if (message && message.length > 3) {
      // sanitize the message to avoid commas/parentheses/quotes that break PostgREST .or parsing
      const cleaned = message
        .replace(/%/g, '')
        .replace(/[",'()\[\]|\\;]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 200) // limit length

      if (cleaned.length > 0) {
        const like = `%${cleaned}%`
        query = query.or(`title.ilike.${like},description.ilike.${like},address.ilike.${like}`)
      }
    }

    const { data: results, error } = await query.limit(10)

    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json({ error: error.message || String(error) }, { status: 500 })
    }

    // Build a simple conversational reply summarizing top matches
    const summary = (results || []).slice(0, 5).map((r: any) => `${r.title} — ${r.price_monthly}€/mes — ${r.address}`).join('\n')

  let reply = ''
  let engine: 'sql' | 'gemini' | 'mock' = 'sql'
  let geminiStatus: number | null = null

    if ((results || []).length === 0) {
      reply = `No he encontrado pisos que coincidan exactamente. Prueba ampliar los criterios o contactar a más propietarios.`
    } else {
      reply = `He encontrado ${results.length} pisos que podrían interesarte:\n${summary}\nPuedes hacer click en cualquiera para ver los detalles.`
    }

    // Prefer Google Gemini (Generative) if enabled
    const useGemini = process.env.GOOGLE_GEMINI_API_KEY && process.env.CHAT_ENABLE_GEMINI === 'true'

    if (useGemini) {
      console.log('[chat api] GEMINI enabled - calling Gemini (with fallbacks)')
      try {
        const attempts: Array<{ url: string; status?: number | null; bodySnippet?: string }> = []

        // Determine auth method: service account (Bearer) or API key
        const useServiceAccount = !!process.env.GOOGLE_APPLICATION_CREDENTIALS
        let bearerToken: string | null = null
        if (useServiceAccount) {
          try {
            const { GoogleAuth } = await import('google-auth-library')
            const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] })
            const client = await auth.getClient()
            const tokenRes: any = await client.getAccessToken()
            bearerToken = tokenRes?.token || null
            console.log('[chat api] Obtained service account token for Gemini')
          } catch (e) {
            console.error('Service account auth failed', e)
          }
        }

        const key = process.env.GOOGLE_GEMINI_API_KEY
        const candidateUrls = [
          `https://generativelanguage.googleapis.com/v1/models/text-bison-001:generate`,
          `https://generativelanguage.googleapis.com/v1/models/chat-bison-001:generate`,
          `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate`,
          `https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generate`,
        ]

        for (const baseUrl of candidateUrls) {
          const url = useServiceAccount ? baseUrl : `${baseUrl}?key=${key}`
          try {
            const headers: any = { 'Content-Type': 'application/json' }
            if (useServiceAccount && bearerToken) headers['Authorization'] = `Bearer ${bearerToken}`

            const gres = await fetch(url, {
              method: 'POST',
              headers,
              body: JSON.stringify({ prompt: { text: `${message}\n\nResultados:\n${summary}` }, temperature: 0.2, maxOutputTokens: 300 }),
            })

            const status = gres.status
            geminiStatus = status
            let bodyText = ''
            try {
              bodyText = await gres.text()
            } catch (e) {
              bodyText = ''
            }

            attempts.push({ url, status, bodySnippet: bodyText ? bodyText.slice(0, 800) : undefined })

            if (gres.ok) {
              let gj: any = null
              try {
                gj = JSON.parse(bodyText || 'null')
              } catch (e) {
                gj = null
              }
              const modelReply = gj?.candidates?.[0]?.output || gj?.candidates?.[0]?.content || gj?.candidates?.[0]?.text || gj?.candidates?.[0]?.message || gj?.output?.[0]?.content || gj?.response?.[0]
              if (modelReply) {
                reply = modelReply
                engine = 'gemini'
                break
              }
            }
          } catch (e) {
            attempts.push({ url, status: null, bodySnippet: String(e).slice(0, 400) })
          }
        }

        (geminiStatus as any) = attempts
      } catch (e) {
        console.error('Gemini call failed', e)
      }
    }

    // If Gemini was not used or failed, provide a local conversational fallback
    // so the chat remains useful during local development.
    if (engine !== 'gemini') {
      // If we have results, create a friendly summary reply (mock LLM)
      if ((results || []).length > 0) {
        const firstFive = (results || []).slice(0, 5)
        const lines = firstFive.map((r: any, idx: number) => `${idx + 1}. ${r.title} — ${r.price_monthly}€/mes — ${r.address}`)
        reply = `He encontrado ${results.length} pisos que podrían interesarte:\n${lines.join('\n')}\nPuedes ver más en /mapa o visitar el detalle de cada piso.`
        engine = 'mock'
      } else {
        // No SQL results — give a helpful suggestion reply
        reply = `No he encontrado pisos que coincidan exactamente. Prueba ampliar los criterios (ej.: "hasta 600€", "2 habitaciones", o indicar barrio/ciudad). También puedes navegar a la página /mapa para ver todos los pisos disponibles.`
        engine = 'mock'
      }
    }

    // Prepare meta: include geminiAttempts when present for debugging
    const meta: any = { engine }
    if (Array.isArray(geminiStatus)) {
      meta.geminiAttempts = geminiStatus
    } else {
      meta.geminiStatus = geminiStatus
    }

    return NextResponse.json({ reply, results, meta })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 })
  }
}
