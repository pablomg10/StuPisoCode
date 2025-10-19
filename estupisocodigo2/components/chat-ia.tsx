"use client"

import React, { useEffect, useState, useRef } from 'react'

type Msg = { id: string; role: 'user' | 'assistant'; text: string }

export default function ChatIA() {
  const [history, setHistory] = useState<Msg[]>(() => {
    try {
      const raw = localStorage.getItem('chat_ia_history')
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    localStorage.setItem('chat_ia_history', JSON.stringify(history))
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const send = async () => {
    if (!input.trim()) return
    const userMsg: Msg = { id: String(Date.now()), role: 'user', text: input.trim() }
    setHistory((h) => [...h, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: userMsg.text }) })
      let j: any = null
      try {
        j = await res.json()
      } catch (e) {
        // no-op, j stays null
      }

      if (!res.ok) {
        const errMsg = j?.error || `Servidor respondió con código ${res.status}`
        console.error('API error:', { status: res.status, body: j })
        const assistantMsg: Msg = { id: String(Date.now() + 1), role: 'assistant', text: `Error: ${errMsg}` }
        setHistory((h) => [...h, assistantMsg])
        return
      }

      const assistantText = j?.reply || ''
      const meta = j?.meta || null
      if (assistantText) {
        const suffix = meta && meta.engine && meta.engine !== 'sql' ? `\n\n(Respuesta generada por: ${meta.engine})` : ''
        const assistantMsg: Msg = { id: String(Date.now() + 1), role: 'assistant', text: assistantText + suffix }
        console.log('chat response meta:', meta)
        setHistory((h) => [...h, assistantMsg])
      }

      // if there are results, append them as clickable assistant messages (one per result)
      if (j?.results && Array.isArray(j.results) && j.results.length > 0) {
        const cards = j.results.map((r: any, idx: number) => ({ id: `res-${idx}-${r.id}`, role: 'assistant', text: `${r.title || r.titulo} — ${r.price_monthly || r.precio}€/mes — ${r.address || r.direccion} — /pisos/${r.id}` }))
        setHistory((h) => [...h, ...cards])
      }
    } catch (e) {
      console.error('Fetch error:', e)
      const assistantMsg: Msg = { id: String(Date.now() + 2), role: 'assistant', text: 'Error de comunicación con el servidor.' }
  setHistory((h) => [...h, assistantMsg])
    } finally {
      setLoading(false)
    }
  }

  const clear = () => {
    setHistory([])
    localStorage.removeItem('chat_ia_history')
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border rounded-md p-4 flex-1 overflow-y-auto bg-white">
        {history.length === 0 && <p className="text-sm text-muted-foreground">Pregúntame sobre pisos (por ejemplo: "busco 2 hab hasta 500€ cerca de la universidad").</p>}
        {history.map((m) => (
          <div key={m.id} className={`my-3 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block rounded-md px-3 py-2 ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-gray-900'}`}>
              {m.text.split('\n').map((line, i) => (
                <div key={i}>
                  {line.includes('/pisos/') ? (
                    (() => {
                      const parts = line.split(' ')
                      const last = parts[parts.length - 1]
                      return (
                        <a href={last} className="text-blue-600 underline">
                          {parts.slice(0, -1).join(' ')}
                        </a>
                      )
                    })()
                  ) : (
                    <span>{line}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-3 flex gap-2 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          rows={2}
          className="flex-1 border rounded-md px-3 py-2 resize-none"
          placeholder="Escribe tu consulta... (Enter para enviar, Shift+Enter para nueva línea)"
        />
        <button onClick={send} className="px-4 py-2 bg-orange-600 text-white rounded-md" disabled={loading}>{loading ? '...' : 'Enviar'}</button>
        <button onClick={clear} className="px-3 py-2 border rounded-md">Limpiar</button>
      </div>
    </div>
  )
}
