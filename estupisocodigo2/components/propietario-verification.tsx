"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import VerifiedPill from "@/components/verified-pill"
import { createClient } from "@/lib/supabase/client"

type Props = {
  onVerified: () => void
  onCancelled?: () => void
}

export default function PropietarioVerification({ onVerified, onCancelled }: Props) {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const next = () => setStep((s) => Math.min(4, s + 1))
  const prev = () => setStep((s) => Math.max(1, s - 1))

  const handleAnswer = (key: string, value: any) => setAnswers((a) => ({ ...a, [key]: value }))

  const evaluate = async () => {
    setLoading(true)
    setError(null)
    try {
      // Simple rule-based evaluation: require owner confirms identity and property ownership
      const passes = answers.confirm_identity === true && answers.owned_property === true && (answers.id_proof || "").length > 3

      if (passes) {
        // persist flag in Supabase profile if logged in
        const { data: userData } = await supabase.auth.getUser()
        const user = userData.user
        if (user) {
          await supabase.from("profiles").update({ is_propietario: true }).eq("id", user.id)
        } else {
          // fallback localStorage
          localStorage.setItem("is_propietario", "true")
        }

        onVerified()
      } else {
        setError("No se cumplen los requisitos para la verificación. Revisa las respuestas.")
      }
    } catch (e) {
      console.error(e)
      setError("Error al verificar. Intenta de nuevo más tarde.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onCancelled && onCancelled()} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b">
          <div className="text-sm text-gray-500">Paso {step} de 4</div>
          <h3 className="text-2xl font-bold mt-2">{step === 1 ? 'Confirmación' : step === 2 ? 'Documento' : step === 3 ? 'Identidad' : 'Revisión'}</h3>
          <p className="text-sm text-gray-600 mt-1">Sigue los pasos para verificar tu condición de propietario.</p>
        </div>

        <div className="p-6 space-y-6 min-h-[260px]">
          {step === 1 && (
            <div className="space-y-2">
              <p className="font-medium">¿Eres el propietario legal del inmueble?</p>
              <div className="flex items-center gap-3">
                {/** Sí button - use inline styles to guarantee visibility */}
                {(() => {
                  const sel = answers.owned_property === true
                  return (
                    <button
                      onClick={() => handleAnswer("owned_property", true)}
                      aria-pressed={sel}
                      type="button"
                      className={`rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm transition-all duration-150`}
                      style={{
                        backgroundColor: sel ? '#0A74FF' : '#ffffff',
                        color: sel ? '#ffffff' : '#111827',
                        border: sel ? '1px solid rgba(10,116,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                        boxShadow: sel ? '0 6px 18px rgba(10,116,255,0.12)' : '0 1px 2px rgba(0,0,0,0.03)'
                      }}
                    >
                      {sel ? (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      ) : (
                        <span className="w-4 h-4 rounded" style={{ border: '1px solid rgba(0,0,0,0.08)' }} />
                      )}
                      Sí
                    </button>
                  )
                })()}

                {(() => {
                  const sel = answers.owned_property === false
                  return (
                    <button
                      onClick={() => handleAnswer("owned_property", false)}
                      aria-pressed={sel}
                      type="button"
                      className={`rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm transition-all duration-150`}
                      style={{
                        backgroundColor: sel ? '#0A74FF' : '#ffffff',
                        color: sel ? '#ffffff' : '#111827',
                        border: sel ? '1px solid rgba(10,116,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                        boxShadow: sel ? '0 6px 18px rgba(10,116,255,0.12)' : '0 1px 2px rgba(0,0,0,0.03)'
                      }}
                    >
                      {sel ? (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      ) : (
                        <span className="w-4 h-4 rounded" style={{ border: '1px solid rgba(0,0,0,0.08)' }} />
                      )}
                      No
                    </button>
                  )
                })()}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <p className="font-medium">¿Puedes aportar algún documento o referencia? (texto breve)</p>
              <input className="w-full border p-3 rounded-md" placeholder="Ej: contrato, escritura, factura..." onChange={(e) => handleAnswer("id_proof", e.target.value)} />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <p className="font-medium">¿Confirmas tu identidad y datos de contacto?</p>
              <div className="flex items-center gap-3">
                {(() => {
                  const sel = answers.confirm_identity === true
                  return (
                    <button
                      onClick={() => handleAnswer("confirm_identity", true)}
                      aria-pressed={sel}
                      type="button"
                      className={`rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm transition-all duration-150`}
                      style={{
                        backgroundColor: sel ? '#0A74FF' : '#ffffff',
                        color: sel ? '#ffffff' : '#111827',
                        border: sel ? '1px solid rgba(10,116,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                        boxShadow: sel ? '0 6px 18px rgba(10,116,255,0.12)' : '0 1px 2px rgba(0,0,0,0.03)'
                      }}
                    >
                      {sel ? (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      ) : (
                        <span className="w-4 h-4 rounded" style={{ border: '1px solid rgba(0,0,0,0.08)' }} />
                      )}
                      Confirmo
                    </button>
                  )
                })()}

                {(() => {
                  const sel = answers.confirm_identity === false
                  return (
                    <button
                      onClick={() => handleAnswer("confirm_identity", false)}
                      aria-pressed={sel}
                      type="button"
                      className={`rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm transition-all duration-150`}
                      style={{
                        backgroundColor: sel ? '#0A74FF' : '#ffffff',
                        color: sel ? '#ffffff' : '#111827',
                        border: sel ? '1px solid rgba(10,116,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                        boxShadow: sel ? '0 6px 18px rgba(10,116,255,0.12)' : '0 1px 2px rgba(0,0,0,0.03)'
                      }}
                    >
                      {sel ? (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      ) : (
                        <span className="w-4 h-4 rounded" style={{ border: '1px solid rgba(0,0,0,0.08)' }} />
                      )}
                      No confirmo
                    </button>
                  )
                })()}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              <p className="font-medium">Revisión final</p>
              <pre className="bg-gray-100 p-3 rounded text-sm">{JSON.stringify(answers, null, 2)}</pre>
              {error && <div className="text-red-600">{error}</div>}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex items-center justify-between">
          <div>
            {step > 1 && <Button variant="ghost" onClick={prev}>Atrás</Button>}
          </div>
          <div className="flex items-center space-x-3">
            {step < 4 && (
              <VerifiedPill label="Siguiente" size="md" variant="filled" onClick={next} disabled={step === 1 && typeof answers.owned_property === 'undefined'} />
            )}
            {step === 4 && (
              <VerifiedPill label={loading ? "Verificando..." : "Enviar y verificar"} size="md" variant="filled" onClick={evaluate} />
            )}
            <Button variant="outline" onClick={() => onCancelled && onCancelled()}>Cancelar</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
