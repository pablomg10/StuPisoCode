"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Bell, Star, Eye, Clock, CheckCircle, X } from "lucide-react"
import AvatarUsuario from "@/components/avatar-usuario"
import { useRouter } from "next/navigation"

interface NotificacionValoracion {
  id: number
  tipo: "valoracion_recibida" | "valoracion_mutua"
  usuario: {
    nombre: string
    imagen: string
    carrera: string
  }
  fecha: string
  leida: boolean
  puntuacion?: number
  comentario?: string
}

// Notificaciones simuladas
const notificacionesIniciales: NotificacionValoracion[] = [
  {
    id: 1,
    tipo: "valoracion_recibida",
    usuario: {
      nombre: "Ana Martín",
      imagen: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=40&h=40&fit=crop&crop=face",
      carrera: "Psicología",
    },
    fecha: "2024-12-15T10:30:00Z",
    leida: false,
  },
  {
    id: 2,
    tipo: "valoracion_recibida",
    usuario: {
      nombre: "Miguel Herrera",
      imagen: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      carrera: "Periodismo",
    },
    fecha: "2024-12-14T15:45:00Z",
    leida: false,
  },
  {
    id: 3,
    tipo: "valoracion_mutua",
    usuario: {
      nombre: "Laura Sánchez",
      imagen: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=40&h=40&fit=crop&crop=face",
      carrera: "Derecho",
    },
    fecha: "2024-12-13T09:15:00Z",
    leida: true,
    puntuacion: 5,
    comentario: "Excelente compañera de piso, muy responsable y limpia.",
  },
]

interface NotificacionesProps {
  onNotificacionClick?: (notificacion: NotificacionValoracion) => void
}

export default function Notificaciones({ onNotificacionClick }: NotificacionesProps) {
  const [notificaciones, setNotificaciones] = useState(notificacionesIniciales)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [notificacionSeleccionada, setNotificacionSeleccionada] = useState<NotificacionValoracion | null>(null)
  const router = useRouter()

  const notificacionesNoLeidas = notificaciones.filter((n) => !n.leida).length

  const marcarComoLeida = (id: number) => {
    setNotificaciones((prev) => prev.map((notif) => (notif.id === id ? { ...notif, leida: true } : notif)))
  }

  const eliminarNotificacion = (id: number) => {
    setNotificaciones((prev) => prev.filter((notif) => notif.id !== id))
  }

  const abrirNotificacion = (notificacion: NotificacionValoracion) => {
    setNotificacionSeleccionada(notificacion)
    setModalAbierto(true)
    if (!notificacion.leida) {
      marcarComoLeida(notificacion.id)
    }
  }

  const irAValorar = (usuario: string) => {
    setModalAbierto(false)
    router.push(`/valoraciones?valorar=${encodeURIComponent(usuario)}`)
  }

  const verValoracion = () => {
    setModalAbierto(false)
    router.push("/valoraciones?tab=recibidas")
  }

  const formatearTiempo = (fecha: string) => {
    const ahora = new Date()
    const fechaNotif = new Date(fecha)
    const diffMs = ahora.getTime() - fechaNotif.getTime()
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDias = Math.floor(diffHoras / 24)

    if (diffDias > 0) {
      return `hace ${diffDias} día${diffDias > 1 ? "s" : ""}`
    } else if (diffHoras > 0) {
      return `hace ${diffHoras} hora${diffHoras > 1 ? "s" : ""}`
    } else {
      return "hace unos minutos"
    }
  }

  return (
    <>
      <div className="relative">
        <Button variant="ghost" size="sm" onClick={() => setModalAbierto(true)} className="relative">
          <Bell className="w-5 h-5" />
          {notificacionesNoLeidas > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {notificacionesNoLeidas}
            </Badge>
          )}
        </Button>
      </div>

      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
          {!notificacionSeleccionada ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notificaciones</span>
                  {notificacionesNoLeidas > 0 && <Badge variant="destructive">{notificacionesNoLeidas}</Badge>}
                </DialogTitle>
                <DialogDescription>
                  Te avisamos cuando alguien te valora para que puedas ver su valoración
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto space-y-2">
                {notificaciones.length > 0 ? (
                  notificaciones.map((notificacion) => (
                    <Card
                      key={notificacion.id}
                      className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                        !notificacion.leida ? "border-orange-200 bg-orange-50" : ""
                      }`}
                      onClick={() => abrirNotificacion(notificacion)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <AvatarUsuario
                              nombre={notificacion.usuario.nombre}
                              imagen={notificacion.usuario.imagen}
                              size="sm"
                            />
                            {notificacion.tipo === "valoracion_recibida" && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                                <Star className="w-2 h-2 text-white" />
                              </div>
                            )}
                            {notificacion.tipo === "valoracion_mutua" && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-2 h-2 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm truncate">{notificacion.usuario.nombre}</p>
                              <div className="flex items-center space-x-2">
                                {!notificacion.leida && <div className="w-2 h-2 bg-orange-500 rounded-full"></div>}
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
                            <p className="text-xs text-gray-600 mb-1">{notificacion.usuario.carrera}</p>
                            <p className="text-xs text-gray-700">
                              {notificacion.tipo === "valoracion_recibida"
                                ? "Te ha valorado! Valóralo para ver su valoración"
                                : "Valoración mutua desbloqueada"}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{formatearTiempo(notificacion.fecha)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No tienes notificaciones</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  {notificacionSeleccionada.tipo === "valoracion_recibida" ? (
                    <Star className="w-5 h-5 text-orange-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  <span>
                    {notificacionSeleccionada.tipo === "valoracion_recibida"
                      ? "Nueva Valoración Recibida"
                      : "Valoración Mutua Desbloqueada"}
                  </span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <AvatarUsuario
                    nombre={notificacionSeleccionada.usuario.nombre}
                    imagen={notificacionSeleccionada.usuario.imagen}
                    size="md"
                  />
                  <div>
                    <p className="font-medium">{notificacionSeleccionada.usuario.nombre}</p>
                    <p className="text-sm text-gray-600">{notificacionSeleccionada.usuario.carrera}</p>
                    <p className="text-xs text-gray-500">{formatearTiempo(notificacionSeleccionada.fecha)}</p>
                  </div>
                </div>

                {notificacionSeleccionada.tipo === "valoracion_recibida" ? (
                  <div className="space-y-3">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="flex items-start space-x-2">
                        <Star className="w-5 h-5 text-orange-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-orange-900 mb-1">
                            ¡{notificacionSeleccionada.usuario.nombre} te ha valorado!
                          </p>
                          <p className="text-sm text-orange-800">
                            Para ver su valoración, necesitas valorarlo/a también. Esto garantiza valoraciones honestas
                            y objetivas.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={() => irAValorar(notificacionSeleccionada.usuario.nombre)} className="flex-1">
                        <Star className="w-4 h-4 mr-2" />
                        Valorar Ahora
                      </Button>
                      <Button variant="outline" onClick={() => setNotificacionSeleccionada(null)} className="flex-1">
                        Más Tarde
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-900 mb-1">¡Valoración mutua completada!</p>
                          <p className="text-sm text-green-800">
                            Ahora puedes ver la valoración que {notificacionSeleccionada.usuario.nombre} te hizo.
                          </p>
                        </div>
                      </div>
                    </div>

                    {notificacionSeleccionada.puntuacion && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium">Puntuación:</span>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= (notificacionSeleccionada.puntuacion || 0)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({notificacionSeleccionada.puntuacion}/5)</span>
                        </div>
                        {notificacionSeleccionada.comentario && (
                          <p className="text-sm text-gray-700">"{notificacionSeleccionada.comentario}"</p>
                        )}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button onClick={verValoracion} className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Valoración Completa
                      </Button>
                      <Button variant="outline" onClick={() => setNotificacionSeleccionada(null)}>
                        Cerrar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
