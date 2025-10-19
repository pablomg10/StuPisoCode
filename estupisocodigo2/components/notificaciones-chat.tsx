"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageCircle, X } from "lucide-react"
import AvatarUsuario from "@/components/avatar-usuario"
import { useRouter } from "next/navigation"

interface NotificacionChat {
  id: number
  usuario: {
    nombre: string
    imagen: string
  }
  mensaje: string
  tiempo: string
  leida: boolean
}

// Notificaciones simuladas de chat
const notificacionesIniciales: NotificacionChat[] = [
  {
    id: 1,
    usuario: {
      nombre: "Laura Sánchez",
      imagen: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=40&h=40&fit=crop&crop=face",
    },
    mensaje: "¡Hola! ¿Has visto el piso de la calle Toro?",
    tiempo: "hace 2 min",
    leida: false,
  },
  {
    id: 2,
    usuario: {
      nombre: "David López",
      imagen: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face",
    },
    mensaje: "Perfecto, quedamos mañana a las 17:00",
    tiempo: "hace 15 min",
    leida: false,
  },
]

interface NotificacionesChatProps {
  className?: string
}

export default function NotificacionesChat({ className }: NotificacionesChatProps) {
  const [notificaciones, setNotificaciones] = useState<NotificacionChat[]>([])
  const [modalAbierto, setModalAbierto] = useState(false)
  const router = useRouter()

  // Simular llegada de nuevas notificaciones
  useEffect(() => {
    // Cargar notificaciones iniciales después de 3 segundos
    const timer1 = setTimeout(() => {
      setNotificaciones([notificacionesIniciales[0]])
    }, 3000)

    // Agregar segunda notificación después de 8 segundos
    const timer2 = setTimeout(() => {
      setNotificaciones((prev) => [...prev, notificacionesIniciales[1]])
    }, 8000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  const notificacionesNoLeidas = notificaciones.filter((n) => !n.leida).length

  const marcarComoLeida = (id: number) => {
    setNotificaciones((prev) => prev.map((notif) => (notif.id === id ? { ...notif, leida: true } : notif)))
  }

  const eliminarNotificacion = (id: number) => {
    setNotificaciones((prev) => prev.filter((notif) => notif.id !== id))
  }

  const irAlChat = (usuario: string) => {
    setModalAbierto(false)
    // Marcar todas como leídas
    setNotificaciones((prev) => prev.map((notif) => ({ ...notif, leida: true })))
    router.push("/chat")
  }

  if (notificacionesNoLeidas === 0) {
    return null
  }

  return (
    <>
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          onClick={() => setModalAbierto(true)}
          className="relative bg-green-500 hover:bg-green-600 rounded-full w-14 h-14 shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
          {notificacionesNoLeidas > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 w-6 h-6 p-0 flex items-center justify-center text-xs"
            >
              {notificacionesNoLeidas}
            </Badge>
          )}
        </Button>
      </div>

      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-green-500" />
              <span>Mensajes Nuevos</span>
              {notificacionesNoLeidas > 0 && <Badge variant="destructive">{notificacionesNoLeidas}</Badge>}
            </DialogTitle>
            <DialogDescription>Tienes mensajes nuevos en tus conversaciones</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-2">
            {notificaciones.map((notificacion) => (
              <Card
                key={notificacion.id}
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  !notificacion.leida ? "border-green-200 bg-green-50" : ""
                }`}
                onClick={() => {
                  marcarComoLeida(notificacion.id)
                  irAlChat(notificacion.usuario.nombre)
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <AvatarUsuario
                        nombre={notificacion.usuario.nombre}
                        imagen={notificacion.usuario.imagen}
                        size="sm"
                      />
                      {!notificacion.leida && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{notificacion.usuario.nombre}</p>
                        <div className="flex items-center space-x-2">
                          {!notificacion.leida && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              eliminarNotificacion(notificacion.id)
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 truncate">{notificacion.mensaje}</p>
                      <p className="text-xs text-gray-500 mt-1">{notificacion.tiempo}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {notificaciones.length === 0 && (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No tienes mensajes nuevos</p>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <Button onClick={() => irAlChat("")} className="w-full" variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Ver Todos los Chats
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
