"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Home, ArrowLeft, Send, Bot, User, Sparkles } from "lucide-react"
import Link from "next/link"
import { useChat } from "ai"

export default function ChatbotPage() {
  const [preferenciasDetectadas, setPreferenciasDetectadas] = useState<string[]>([])

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chatbot",
    onFinish: (message) => {
      // Extraer preferencias del mensaje del bot
      const contenido = message.content.toLowerCase()
      const nuevasPreferencias: string[] = []

      if (contenido.includes("limpio") || contenido.includes("ordenado")) {
        nuevasPreferencias.push("Limpieza")
      }
      if (contenido.includes("música") || contenido.includes("musical")) {
        nuevasPreferencias.push("Música")
      }
      if (contenido.includes("deporte") || contenido.includes("ejercicio")) {
        nuevasPreferencias.push("Deportes")
      }
      if (contenido.includes("cocina") || contenido.includes("cocinar")) {
        nuevasPreferencias.push("Cocinar")
      }
      if (contenido.includes("estudio") || contenido.includes("estudiar")) {
        nuevasPreferencias.push("Ambiente de estudio")
      }
      if (contenido.includes("social") || contenido.includes("fiestas")) {
        nuevasPreferencias.push("Vida social")
      }

      setPreferenciasDetectadas((prev) => [...new Set([...prev, ...nuevasPreferencias])])
    },
  })

  const guardarPreferencias = () => {
    // Aquí se guardarían las preferencias en el perfil del usuario
    console.log("Preferencias guardadas:", preferenciasDetectadas)
    alert("¡Preferencias guardadas exitosamente! Ahora tu perfil está más completo.")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/perfil">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Home className="w-6 h-6 text-orange-500" />
                <span className="text-xl font-bold">EsTuPiso</span>
              </div>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/matches" className="text-gray-600 hover:text-gray-900">
                Matches
              </Link>
              <Link href="/mapa" className="text-gray-600 hover:text-gray-900">
                Mapa
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Asistente IA para Preferencias</h1>
            <p className="text-gray-600">Conversa conmigo para definir tus gustos y preferencias de manera natural</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chat */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-blue-500" />
                    <span>Asistente EsTuPiso</span>
                    <Badge variant="secondary" className="ml-2">
                      <Sparkles className="w-3 h-3 mr-1" />
                      IA
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 text-gray-900 border border-gray-200 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                          <p className="text-sm">
                            ¡Hola! Soy tu asistente personal de EsTuPiso. Estoy aquí para ayudarte a definir tus
                            preferencias para encontrar el compañero de piso perfecto.
                            <br />
                            <br />
                            Puedes contarme sobre:
                            <br />• Tu estilo de vida
                            <br />• Tus horarios
                            <br />• Tus aficiones
                            <br />• Lo que buscas en un compañero
                            <br />
                            <br />
                            ¿Por dónde quieres empezar?
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex items-start space-x-3">
                        {message.role === "assistant" && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              <Bot className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.role === "user"
                              ? "bg-orange-500 text-white"
                              : "bg-gray-100 text-gray-900 border border-gray-200"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        {message.role === "user" && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-orange-100 text-orange-600">
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 text-gray-900 border border-gray-200 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>

                <div className="border-t p-4">
                  <form onSubmit={handleSubmit} className="flex space-x-2">
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Escribe tu mensaje..."
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            </div>

            {/* Preferencias Detectadas */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Preferencias Detectadas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {preferenciasDetectadas.length > 0 ? (
                    <>
                      <div className="flex flex-wrap gap-2">
                        {preferenciasDetectadas.map((preferencia, index) => (
                          <Badge key={index} variant="secondary">
                            {preferencia}
                          </Badge>
                        ))}
                      </div>
                      <Button onClick={guardarPreferencias} className="w-full">
                        Guardar Preferencias
                      </Button>
                    </>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Conversa conmigo y automáticamente detectaré tus preferencias para mejorar tu perfil.
                    </p>
                  )}

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Ejemplos de preguntas:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• "Me gusta mantener todo limpio"</li>
                      <li>• "Soy muy social y me gusta hacer fiestas"</li>
                      <li>• "Prefiero ambientes tranquilos para estudiar"</li>
                      <li>• "Me encanta cocinar y compartir comidas"</li>
                      <li>• "Hago deporte todas las mañanas"</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
