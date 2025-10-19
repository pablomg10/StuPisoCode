"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Home,
  ArrowLeft,
  Edit,
  MapPin,
  Bed,
  Bath,
  Users,
  Heart,
  Eye,
  Calendar,
  Wifi,
  Car,
  MessageCircle,
  Phone,
  Mail,
  Share2,
} from "lucide-react"
import Link from "next/link"
import { propietarioStore, type Piso } from "@/lib/propietario-store"

export default function DetallePisoPage() {
  const params = useParams()
  const router = useRouter()
  const [piso, setPiso] = useState<Piso | null>(null)
  const [loading, setLoading] = useState(true)
  const [imagenActual, setImagenActual] = useState(0)

  useEffect(() => {
    const id = params.id as string
    if (id) {
      const pisoEncontrado = propietarioStore.getPiso(Number.parseInt(id))
      if (pisoEncontrado) {
        setPiso(pisoEncontrado)
      } else {
        router.push("/propietario/dashboard")
      }
    }
    setLoading(false)
  }, [params.id, router])

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "activo":
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>
      case "ocupado":
        return <Badge className="bg-blue-100 text-blue-800">Ocupado</Badge>
      case "borrador":
        return <Badge className="bg-gray-100 text-gray-800">Borrador</Badge>
      case "pausado":
        return <Badge className="bg-yellow-100 text-yellow-800">Pausado</Badge>
      default:
        return null
    }
  }

  const serviciosIconos: Record<string, any> = {
    wifi: Wifi,
    parking: Car,
    calefaccion: Home,
    aire: Home,
    lavadora: Home,
    lavavajillas: Home,
    terraza: Home,
    ascensor: Home,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!piso) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Piso no encontrado</h2>
          <p className="text-gray-600 mb-4">El piso que buscas no existe o ha sido eliminado.</p>
          <Link href="/propietario/dashboard">
            <Button>Volver al Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/propietario/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold">EsTuPiso</span>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  Detalles
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href={`/propietario/perfil?edit=${piso.id}`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galería de Imágenes */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={piso.fotos[imagenActual] || "/placeholder.svg"}
                    alt={piso.titulo}
                    className="w-full h-64 md:h-96 object-cover rounded-t-lg"
                  />
                  {piso.fotos.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {piso.fotos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setImagenActual(index)}
                          className={`w-3 h-3 rounded-full ${index === imagenActual ? "bg-white" : "bg-white/50"}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Información Principal */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{piso.titulo}</CardTitle>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{piso.direccion}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{piso.zona}</Badge>
                      {getEstadoBadge(piso.estado)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-600">{piso.precio}€</div>
                    <div className="text-sm text-gray-500">por mes</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Características */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bed className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold">{piso.habitaciones}</div>
                    <div className="text-sm text-gray-500">Habitaciones</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bath className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold">{piso.banos}</div>
                    <div className="text-sm text-gray-500">Baños</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Home className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold">{piso.metros}</div>
                    <div className="text-sm text-gray-500">m²</div>
                  </div>
                </div>

                {/* Descripción */}
                {piso.descripcion && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Descripción</h3>
                    <p className="text-gray-700">{piso.descripcion}</p>
                  </div>
                )}

                {/* Servicios */}
                {piso.servicios.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Servicios incluidos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {piso.servicios.map((servicio) => {
                        const Icon = serviciosIconos[servicio] || Home
                        return (
                          <div key={servicio} className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
                            <Icon className="w-4 h-4 text-orange-500" />
                            <span className="text-sm capitalize">{servicio}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Estadísticas */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-600">
                      <Eye className="w-4 h-4" />
                      <span className="font-semibold">{piso.visitas}</span>
                    </div>
                    <div className="text-xs text-gray-500">Visitas</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-600">
                      <Heart className="w-4 h-4" />
                      <span className="font-semibold">{piso.solicitudes}</span>
                    </div>
                    <div className="text-xs text-gray-500">Solicitudes</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="font-semibold">{new Date(piso.fechaPublicacion).toLocaleDateString()}</span>
                    </div>
                    <div className="text-xs text-gray-500">Publicado</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Matches Recientes */}
            {piso.matches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Solicitudes ({piso.matches.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {piso.matches.slice(0, 3).map((match) => (
                    <div key={match.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={match.imagen || "/placeholder.svg"} />
                        <AvatarFallback>
                          {match.nombre
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{match.nombre}</div>
                        <div className="text-xs text-gray-500">{match.carrera}</div>
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          {match.compatibilidad}% compatible
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Link href="/propietario/matches">
                    <Button className="w-full" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Ver Todas las Solicitudes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Acciones Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => propietarioStore.addRandomMatch(piso.id)}>
                  <Users className="w-4 h-4 mr-2" />
                  Simular Nuevo Match
                </Button>
                <Button className="w-full" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Contactar Soporte
                </Button>
                <Button className="w-full" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar por Email
                </Button>
              </CardContent>
            </Card>

            {/* Preferencias */}
            {piso.preferencias && (
              <Card>
                <CardHeader>
                  <CardTitle>Preferencias de Inquilino</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {piso.preferencias.edadMin && piso.preferencias.edadMax && (
                    <div>
                      <span className="text-sm font-medium">Edad:</span>
                      <span className="text-sm text-gray-600 ml-2">
                        {piso.preferencias.edadMin} - {piso.preferencias.edadMax} años
                      </span>
                    </div>
                  )}
                  {piso.preferencias.generoPreferido && (
                    <div>
                      <span className="text-sm font-medium">Género:</span>
                      <span className="text-sm text-gray-600 ml-2 capitalize">
                        {piso.preferencias.generoPreferido.replace("-", " ")}
                      </span>
                    </div>
                  )}
                  {piso.preferencias.carrerasPreferidas && piso.preferencias.carrerasPreferidas.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">Carreras preferidas:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {piso.preferencias.carrerasPreferidas.map((carrera) => (
                          <Badge key={carrera} variant="secondary" className="text-xs">
                            {carrera}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
