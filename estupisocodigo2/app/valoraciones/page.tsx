"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Star, MessageSquare, User, Building, CheckCircle, Lock, Clock, Bell } from "lucide-react"
import Link from "next/link"
import AvatarUsuario from "@/components/avatar-usuario"
import { useSearchParams } from "next/navigation"
import Image from "next/image"

// Componente de estrellas para valoración
const StarRating = ({
  rating,
  onRatingChange,
  readonly = false,
}: { rating: number; onRatingChange?: (rating: number) => void; readonly?: boolean }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 cursor-pointer transition-colors ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          } ${readonly ? "cursor-default" : "hover:text-yellow-400"}`}
          onClick={() => !readonly && onRatingChange && onRatingChange(star)}
        />
      ))}
    </div>
  )
}

// Función para calcular si han pasado 9 meses
const calcularMesesTranscurridos = (fecha: string): number => {
  const fechaValoracion = new Date(fecha)
  const ahora = new Date()
  const diffTime = Math.abs(ahora.getTime() - fechaValoracion.getTime())
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30))
  return diffMonths
}

// Historial de valoraciones mutuas (simulado)
const historialValoraciones = [
  {
    usuarioA: "yo", // El usuario actual
    usuarioB: "Laura Sánchez",
    valoracionA: { puntuacion: 5, comentario: "Excelente compañera", fecha: "2024-01-15" },
    valoracionB: { puntuacion: 4, comentario: "Muy buena persona", fecha: "2024-01-16" },
    visible: true, // Ambos se han valorado
  },
  {
    usuarioA: "yo",
    usuarioB: "David López",
    valoracionA: { puntuacion: 4, comentario: "Buen compañero", fecha: "2024-03-10" },
    valoracionB: null, // David no me ha valorado aún
    visible: false, // No puedo ver su valoración hasta que él me valore
  },
  {
    usuarioA: "yo",
    usuarioB: "Ana Martín",
    valoracionA: null, // No he valorado a Ana
    valoracionB: { puntuacion: 5, comentario: "Persona increíble", fecha: "2024-02-20" },
    visible: false, // No puedo ver su valoración hasta que yo la valore
    notificacionPendiente: true, // Ana me valoró, tengo notificación pendiente
  },
  {
    usuarioA: "yo",
    usuarioB: "Miguel Herrera",
    valoracionA: null,
    valoracionB: { puntuacion: 4, comentario: "Muy buen compañero", fecha: "2024-12-14" },
    visible: false,
    notificacionPendiente: true,
  },
]

// Usuarios disponibles para valorar
const usuariosParaValorar = [
  {
    id: 1,
    nombre: "Laura Sánchez",
    carrera: "Derecho",
    relacion: "Match actual",
    imagen: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=40&h=40&fit=crop&crop=face",
    puedeValorar: false, // Ya valorada hace menos de 9 meses
    ultimaValoracion: "2024-01-15",
  },
  {
    id: 2,
    nombre: "David López",
    carrera: "Económicas",
    relacion: "Ex-compañero de piso",
    imagen: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face",
    puedeValorar: false, // Ya valorado hace menos de 9 meses
    ultimaValoracion: "2024-03-10",
  },
  {
    id: 3,
    nombre: "Ana Martín",
    carrera: "Psicología",
    relacion: "Match anterior",
    imagen: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=40&h=40&fit=crop&crop=face",
    puedeValorar: true, // Nunca valorada, pero me valoró (notificación pendiente)
    ultimaValoracion: null,
    notificacionPendiente: true,
  },
  {
    id: 4,
    nombre: "Carlos Ruiz",
    carrera: "Ingeniería",
    relacion: "Compañero actual",
    imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    puedeValorar: true, // Nunca valorado
    ultimaValoracion: null,
  },
  {
    id: 5,
    nombre: "Miguel Herrera",
    carrera: "Periodismo",
    relacion: "Ex-compañero",
    imagen: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    puedeValorar: true,
    ultimaValoracion: null,
    notificacionPendiente: true,
  },
  {
    id: 6,
    nombre: "Sofía Ruiz",
    carrera: "Farmacia",
    relacion: "Ex-compañera",
    imagen: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=40&h=40&fit=crop&crop=face",
    puedeValorar: true, // Valorada hace más de 9 meses
    ultimaValoracion: "2023-03-15",
  },
]

// Arrendadores disponibles para valorar
const arrendadoresParaValorar = [
  {
    id: 7,
    nombre: "Carmen López",
    tipo: "Propietaria",
    propiedad: "Piso Calle Toro, 15",
    imagen: "/placeholder.svg?height=40&width=40&text=Carmen&bg=ecfdf5&color=059669",
    puedeValorar: true,
    ultimaValoracion: null,
  },
  {
    id: 8,
    nombre: "Miguel Rodríguez",
    tipo: "Propietario",
    propiedad: "Habitación Av. Mirat, 8",
    imagen: "/placeholder.svg?height=40&width=40&text=Miguel&bg=fef2f2&color=dc2626",
    puedeValorar: false,
    ultimaValoracion: "2024-05-20",
  },
]

// Valoraciones visibles (solo las bidireccionales)
const valoracionesVisibles = historialValoraciones
  .filter((v) => v.visible && v.valoracionB)
  .map((v) => ({
    id: Math.random(),
    tipo: "usuario",
    evaluador: {
      nombre: v.usuarioB,
      imagen: usuariosParaValorar.find((u) => u.nombre === v.usuarioB)?.imagen || "/placeholder.svg",
    },
    puntuacion: v.valoracionB!.puntuacion,
    comentario: v.valoracionB!.comentario,
    fecha: v.valoracionB!.fecha,
    aspectos: {
      limpieza: v.valoracionB!.puntuacion,
      comunicacion: v.valoracionB!.puntuacion - 1,
      respeto: v.valoracionB!.puntuacion,
      puntualidad: v.valoracionB!.puntuacion,
    },
  }))

// Valoraciones dadas
const valoracionesDadas = historialValoraciones
  .filter((v) => v.valoracionA)
  .map((v) => ({
    id: Math.random(),
    tipo: "usuario",
    evaluado: {
      nombre: v.usuarioB,
      imagen: usuariosParaValorar.find((u) => u.nombre === v.usuarioB)?.imagen || "/placeholder.svg",
    },
    puntuacion: v.valoracionA!.puntuacion,
    comentario: v.valoracionA!.comentario,
    fecha: v.valoracionA!.fecha,
  }))

export default function ValoracionesPage() {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [paso, setPaso] = useState<"seleccionar" | "valorar" | "confirmacion">("seleccionar")
  const [tipoValoracion, setTipoValoracion] = useState<"usuario" | "arrendador">("usuario")
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<any>(null)
  const [valoracionesLocales, setValoracionesLocales] = useState(valoracionesDadas)
  const [tabActiva, setTabActiva] = useState("recibidas")

  const searchParams = useSearchParams()
  const valorarUsuario = searchParams?.get("valorar")
  const tabParam = searchParams?.get("tab")

  const [nuevaValoracion, setNuevaValoracion] = useState({
    puntuacion: 0,
    comentario: "",
    aspectos: {
      limpieza: 0,
      comunicacion: 0,
      respeto: 0,
      puntualidad: 0,
    },
  })

  // Efecto para abrir modal automáticamente si viene de notificación
  useEffect(() => {
    if (valorarUsuario) {
      const usuario = usuariosParaValorar.find((u) => u.nombre === valorarUsuario)
      if (usuario && usuario.puedeValorar) {
        setUsuarioSeleccionado(usuario)
        setModalAbierto(true)
        setPaso("valorar")
      }
    }
    if (tabParam) {
      setTabActiva(tabParam)
    }
  }, [valorarUsuario, tabParam])

  const promedioGeneral =
    valoracionesVisibles.length > 0
      ? valoracionesVisibles.reduce((acc, val) => acc + val.puntuacion, 0) / valoracionesVisibles.length
      : 0

  const notificacionesPendientes = usuariosParaValorar.filter((u) => u.notificacionPendiente).length

  const resetearFormulario = () => {
    setNuevaValoracion({
      puntuacion: 0,
      comentario: "",
      aspectos: {
        limpieza: 0,
        comunicacion: 0,
        respeto: 0,
        puntualidad: 0,
      },
    })
    setUsuarioSeleccionado(null)
    setPaso("seleccionar")
    setTipoValoracion("usuario")
  }

  const seleccionarUsuario = (usuario: any) => {
    if (!usuario.puedeValorar) {
      if (usuario.ultimaValoracion) {
        const mesesTranscurridos = calcularMesesTranscurridos(usuario.ultimaValoracion)
        alert(`Ya has valorado a ${usuario.nombre}. Podrás valorar de nuevo en ${9 - mesesTranscurridos} meses.`)
      }
      return
    }
    setUsuarioSeleccionado(usuario)
    setPaso("valorar")
  }

  const enviarValoracion = () => {
    if (nuevaValoracion.puntuacion === 0) {
      alert("Por favor, selecciona una puntuación")
      return
    }

    // Crear nueva valoración
    const valoracion = {
      id: Date.now(),
      tipo: tipoValoracion,
      evaluado: {
        nombre: usuarioSeleccionado.nombre,
        imagen: usuarioSeleccionado.imagen,
      },
      puntuacion: nuevaValoracion.puntuacion,
      comentario: nuevaValoracion.comentario,
      fecha: new Date().toISOString().split("T")[0],
    }

    // Agregar a la lista local
    setValoracionesLocales([valoracion, ...valoracionesLocales])

    // Si era una notificación pendiente, simular que ahora es bidireccional
    if (usuarioSeleccionado.notificacionPendiente) {
      // Aquí se actualizaría el estado para mostrar la valoración mutua
      alert(`¡Valoración mutua completada! Ahora puedes ver la valoración de ${usuarioSeleccionado.nombre}`)
    }

    setPaso("confirmacion")

    // Cerrar modal después de 3 segundos
    setTimeout(() => {
      setModalAbierto(false)
      resetearFormulario()
    }, 3000)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    resetearFormulario()
  }

  // Filtrar usuarios que se pueden valorar
  const usuariosDisponibles: any[] = (tipoValoracion === "usuario" ? usuariosParaValorar : arrendadoresParaValorar).map(
    (usuario: any) => {
      if (usuario.ultimaValoracion) {
        const mesesTranscurridos = calcularMesesTranscurridos(usuario.ultimaValoracion)
        return {
          ...usuario,
          puedeValorar: mesesTranscurridos >= 9,
          mesesRestantes: Math.max(0, 9 - mesesTranscurridos),
        }
      }
      return { ...usuario, mesesRestantes: 0 }
    },
  )

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
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <div className="w-28 md:w-40 lg:w-52 h-12 md:h-14 lg:h-16 relative overflow-visible">
                  <Image src="/logo.png" alt="EsTuPiso" width={520} height={160} className="absolute left-0 top-1/2 -translate-y-1/2 h-28 md:h-40 lg:h-52 w-auto" priority />
                </div>
              </Link>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Valoraciones</h1>
            <p className="text-gray-600">Construye tu reputación y ayuda a otros usuarios</p>
          </div>

          {/* Alerta de notificaciones pendientes */}
          {notificacionesPendientes > 0 && (
            <Card className="mb-8 border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-orange-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-orange-900">
                      ¡Tienes {notificacionesPendientes} valoración{notificacionesPendientes > 1 ? "es" : ""} pendiente
                      {notificacionesPendientes > 1 ? "s" : ""}!
                    </p>
                    <p className="text-sm text-orange-800">
                      Algunas personas te han valorado. Valóralas también para desbloquear sus valoraciones.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      const usuarioPendiente = usuariosParaValorar.find((u) => u.notificacionPendiente)
                      if (usuarioPendiente) {
                        setUsuarioSeleccionado(usuarioPendiente)
                        setModalAbierto(true)
                        setPaso("valorar")
                      }
                    }}
                  >
                    Valorar Ahora
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Información del sistema */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Sistema de Valoraciones Bidireccionales</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Solo puedes ver valoraciones de personas que también te han valorado</li>
                    <li>• Cada persona puede ser valorada una vez cada 9 meses</li>
                    <li>• Recibes notificaciones cuando alguien te valora</li>
                    <li>• Esto garantiza valoraciones honestas y objetivas</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumen de Valoraciones */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Tu Reputación</span>
                <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        resetearFormulario()
                        setModalAbierto(true)
                      }}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Valorar Usuario
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    {paso === "seleccionar" && (
                      <>
                        <DialogHeader>
                          <DialogTitle>Seleccionar Usuario para Valorar</DialogTitle>
                          <DialogDescription>
                            Elige a quién quieres valorar. Solo puedes valorar a cada persona una vez cada 9 meses.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Tipo de valoración</label>
                            <Select
                              value={tipoValoracion}
                              onValueChange={(value: "usuario" | "arrendador") => setTipoValoracion(value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="usuario">Compañero de piso</SelectItem>
                                <SelectItem value="arrendador">Arrendador/Propietario</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              {tipoValoracion === "usuario" ? "Selecciona un compañero:" : "Selecciona un arrendador:"}
                            </label>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {usuariosDisponibles.map((persona) => (
                                <div
                                  key={persona.id}
                                  onClick={() => seleccionarUsuario(persona)}
                                  className={`p-3 border rounded-lg transition-colors ${
                                    persona.puedeValorar
                                      ? "cursor-pointer hover:bg-gray-50"
                                      : "cursor-not-allowed bg-gray-100 opacity-60"
                                  } ${persona.notificacionPendiente ? "border-orange-300 bg-orange-50" : ""}`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="relative">
                                      <AvatarUsuario nombre={persona.nombre} imagen={persona.imagen} size="sm" />
                                      {persona.notificacionPendiente && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2">
                                        <p className="font-medium">{persona.nombre}</p>
                                        {persona.notificacionPendiente && (
                                          <Badge
                                            variant="outline"
                                            className="text-orange-600 border-orange-600 text-xs"
                                          >
                                            Te valoró
                                          </Badge>
                                        )}
                                        {!persona.puedeValorar && (
                                          <div className="flex items-center space-x-1">
                                            <Clock className="w-3 h-3 text-gray-500" />
                                            <span className="text-xs text-gray-500">
                                              {persona.mesesRestantes}m restantes
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600">
                                        {tipoValoracion === "usuario"
                                          ? `${persona.carrera} • ${persona.relacion}`
                                          : `${persona.tipo} • ${persona.propiedad}`}
                                      </p>
                                      {!persona.puedeValorar && persona.ultimaValoracion && (
                                        <p className="text-xs text-gray-500">
                                          Última valoración: {new Date(persona.ultimaValoracion).toLocaleDateString()}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {paso === "valorar" && usuarioSeleccionado && (
                      <>
                        <DialogHeader>
                          <DialogTitle>Valorar a {usuarioSeleccionado.nombre}</DialogTitle>
                          <DialogDescription>
                            {usuarioSeleccionado.notificacionPendiente
                              ? `${usuarioSeleccionado.nombre} ya te valoró. Al valorarlo/a, podrás ver su valoración.`
                              : `Comparte tu experiencia con ${usuarioSeleccionado.nombre}. Esta valoración será visible para él/ella solo cuando te valore también.`}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          {/* Usuario seleccionado */}
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="relative">
                              <AvatarUsuario
                                nombre={usuarioSeleccionado.nombre}
                                imagen={usuarioSeleccionado.imagen}
                                size="md"
                              />
                              {usuarioSeleccionado.notificacionPendiente && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                                  <Bell className="w-2 h-2 text-white" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{usuarioSeleccionado.nombre}</p>
                              <p className="text-sm text-gray-600">
                                {tipoValoracion === "usuario"
                                  ? `${usuarioSeleccionado.carrera} • ${usuarioSeleccionado.relacion}`
                                  : `${usuarioSeleccionado.tipo} • ${usuarioSeleccionado.propiedad}`}
                              </p>
                              {usuarioSeleccionado.notificacionPendiente && (
                                <Badge variant="outline" className="text-orange-600 border-orange-600 text-xs mt-1">
                                  Ya te valoró
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block">Puntuación general *</label>
                            <StarRating
                              rating={nuevaValoracion.puntuacion}
                              onRatingChange={(rating) =>
                                setNuevaValoracion({ ...nuevaValoracion, puntuacion: rating })
                              }
                            />
                          </div>

                          {tipoValoracion === "usuario" && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium mb-1 block">Limpieza</label>
                                <StarRating
                                  rating={nuevaValoracion.aspectos.limpieza}
                                  onRatingChange={(rating) =>
                                    setNuevaValoracion({
                                      ...nuevaValoracion,
                                      aspectos: { ...nuevaValoracion.aspectos, limpieza: rating },
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-1 block">Comunicación</label>
                                <StarRating
                                  rating={nuevaValoracion.aspectos.comunicacion}
                                  onRatingChange={(rating) =>
                                    setNuevaValoracion({
                                      ...nuevaValoracion,
                                      aspectos: { ...nuevaValoracion.aspectos, comunicacion: rating },
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-1 block">Respeto</label>
                                <StarRating
                                  rating={nuevaValoracion.aspectos.respeto}
                                  onRatingChange={(rating) =>
                                    setNuevaValoracion({
                                      ...nuevaValoracion,
                                      aspectos: { ...nuevaValoracion.aspectos, respeto: rating },
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-1 block">Puntualidad</label>
                                <StarRating
                                  rating={nuevaValoracion.aspectos.puntualidad}
                                  onRatingChange={(rating) =>
                                    setNuevaValoracion({
                                      ...nuevaValoracion,
                                      aspectos: { ...nuevaValoracion.aspectos, puntualidad: rating },
                                    })
                                  }
                                />
                              </div>
                            </div>
                          )}

                          <div>
                            <label className="text-sm font-medium mb-2 block">Comentario</label>
                            <Textarea
                              value={nuevaValoracion.comentario}
                              onChange={(e) => setNuevaValoracion({ ...nuevaValoracion, comentario: e.target.value })}
                              placeholder="Comparte tu experiencia..."
                              rows={3}
                            />
                          </div>

                          <div
                            className={`p-3 rounded-lg ${usuarioSeleccionado.notificacionPendiente ? "bg-green-50" : "bg-yellow-50"}`}
                          >
                            <p
                              className={`text-sm ${usuarioSeleccionado.notificacionPendiente ? "text-green-800" : "text-yellow-800"}`}
                            >
                              <strong>{usuarioSeleccionado.notificacionPendiente ? "¡Genial!" : "Recuerda:"}</strong>{" "}
                              {usuarioSeleccionado.notificacionPendiente
                                ? `Al enviar esta valoración, podrás ver inmediatamente la valoración que ${usuarioSeleccionado.nombre} te hizo.`
                                : `Esta valoración solo será visible para ${usuarioSeleccionado.nombre} cuando él/ella también te valore.`}
                            </p>
                          </div>

                          <div className="flex space-x-2">
                            <Button onClick={() => setPaso("seleccionar")} variant="outline" className="flex-1">
                              Volver
                            </Button>
                            <Button onClick={enviarValoracion} className="flex-1">
                              Enviar Valoración
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {paso === "confirmacion" && (
                      <>
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>¡Valoración enviada!</span>
                          </DialogTitle>
                          <DialogDescription>Tu valoración ha sido guardada exitosamente</DialogDescription>
                        </DialogHeader>

                        <div className="text-center py-4">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                          </div>
                          <p className="text-gray-600 mb-2">Gracias por contribuir a la comunidad de EsTuPiso</p>
                          <p className="text-sm text-gray-500">
                            {usuarioSeleccionado?.notificacionPendiente
                              ? `¡Ahora puedes ver la valoración de ${usuarioSeleccionado?.nombre}!`
                              : `Tu valoración será visible cuando ${usuarioSeleccionado?.nombre} también te valore.`}
                          </p>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {promedioGeneral > 0 ? promedioGeneral.toFixed(1) : "N/A"}
                  </div>
                  {promedioGeneral > 0 ? (
                    <StarRating rating={Math.round(promedioGeneral)} readonly />
                  ) : (
                    <div className="text-gray-400">Sin valoraciones</div>
                  )}
                  <p className="text-sm text-gray-600 mt-1">Puntuación general</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{valoracionesVisibles.length}</div>
                  <p className="text-sm text-gray-600">Valoraciones visibles</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">{valoracionesLocales.length}</div>
                  <p className="text-sm text-gray-600">Valoraciones dadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs de Valoraciones */}
          <Tabs value={tabActiva} onValueChange={setTabActiva} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recibidas">Valoraciones Recibidas</TabsTrigger>
              <TabsTrigger value="dadas">Valoraciones Dadas</TabsTrigger>
            </TabsList>

            <TabsContent value="recibidas" className="space-y-4">
              {valoracionesVisibles.map((valoracion) => (
                <Card key={valoracion.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <AvatarUsuario
                        nombre={valoracion.evaluador.nombre}
                        imagen={valoracion.evaluador.imagen}
                        size="md"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{valoracion.evaluador.nombre}</h3>
                            <Badge variant={valoracion.tipo === "usuario" ? "default" : "secondary"}>
                              {valoracion.tipo === "usuario" ? (
                                <>
                                  <User className="w-3 h-3 mr-1" />
                                  Usuario
                                </>
                              ) : (
                                <>
                                  <Building className="w-3 h-3 mr-1" />
                                  Arrendador
                                </>
                              )}
                            </Badge>
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Bidireccional
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(valoracion.fecha).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <StarRating rating={valoracion.puntuacion} readonly />
                          <span className="text-sm text-gray-600">({valoracion.puntuacion}/5)</span>
                        </div>
                        <p className="text-gray-700 mb-4">{valoracion.comentario}</p>

                        {/* Aspectos específicos */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {Object.entries(valoracion.aspectos).map(([aspecto, puntuacion]) => (
                            <div key={aspecto} className="text-center">
                              <p className="font-medium capitalize mb-1">{aspecto}</p>
                              <StarRating rating={puntuacion} readonly />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {valoracionesVisibles.length === 0 && (
                <div className="text-center py-12">
                  <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay valoraciones visibles</h3>
                  <p className="text-gray-600">
                    Las valoraciones aparecerán aquí cuando las personas que has valorado también te valoren a ti.
                  </p>
                  {notificacionesPendientes > 0 && (
                    <p className="text-orange-600 mt-2">
                      ¡Tienes {notificacionesPendientes} valoración{notificacionesPendientes > 1 ? "es" : ""} pendiente
                      {notificacionesPendientes > 1 ? "s" : ""}! Valora para desbloquearlas.
                    </p>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="dadas" className="space-y-4">
              {valoracionesLocales.map((valoracion) => (
                <Card key={valoracion.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <AvatarUsuario
                        nombre={valoracion.evaluado.nombre}
                        imagen={valoracion.evaluado.imagen}
                        size="md"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">Valoraste a {valoracion.evaluado.nombre}</h3>
                          <span className="text-sm text-gray-500">
                            {new Date(valoracion.fecha).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <StarRating rating={valoracion.puntuacion} readonly />
                          <span className="text-sm text-gray-600">({valoracion.puntuacion}/5)</span>
                        </div>
                        <p className="text-gray-700">{valoracion.comentario}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {valoracionesLocales.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aún no has valorado a nadie</h3>
                  <p className="text-gray-600">Comparte tu experiencia con otros usuarios de la plataforma</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
