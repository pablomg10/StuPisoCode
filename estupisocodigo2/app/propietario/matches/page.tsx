"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, ArrowLeft, GraduationCap, MapPin, Sparkles, Calendar } from "lucide-react"
import Link from "next/link"

// Matches inventados estáticos
const matchesInventados = [
  {
    id: 1,
    nombre: "María García",
    edad: 21,
    carrera: "Medicina",
    compatibilidad: 95,
    estado: "nuevo",
    fechaSolicitud: "2024-01-20",
    imagen: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    mensaje: "¡Hola! Me interesa mucho tu piso. Soy estudiante de medicina, muy responsable y ordenada.",
    pisoTitulo: "Piso céntrico cerca de la Universidad",
    motivos: ["Carrera compatible", "Edad adecuada", "Perfil ordenado"],
  },
  {
    id: 2,
    nombre: "Ana Martín",
    edad: 20,
    carrera: "Psicología",
    compatibilidad: 92,
    estado: "interesante",
    fechaSolicitud: "2024-01-18",
    imagen: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    mensaje: "Busco un lugar tranquilo para estudiar. Me parece perfecto tu piso en el centro.",
    pisoTitulo: "Piso céntrico cerca de la Universidad",
    motivos: ["Zona preferida", "Presupuesto compatible", "Horarios similares"],
  },
  {
    id: 3,
    nombre: "Laura Sánchez",
    edad: 22,
    carrera: "Derecho",
    compatibilidad: 88,
    estado: "mutuo",
    fechaSolicitud: "2024-01-15",
    imagen: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    mensaje: "¡Es un match! Me encanta el apartamento y creo que sería perfecta inquilina.",
    pisoTitulo: "Apartamento moderno - Van Dyck",
    motivos: ["Zona exacta", "Presupuesto alto", "Perfil profesional"],
  },
  {
    id: 4,
    nombre: "Carlos Ruiz",
    edad: 23,
    carrera: "Ingeniería Informática",
    compatibilidad: 85,
    estado: "nuevo",
    fechaSolicitud: "2024-01-19",
    imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    mensaje: "Hola, soy estudiante de informática y me interesa tu piso. Soy tranquilo y responsable.",
    pisoTitulo: "Piso céntrico cerca de la Universidad",
    motivos: ["Cerca de universidad", "Presupuesto adecuado", "Perfil tecnológico"],
  },
  {
    id: 5,
    nombre: "Sofía Ruiz",
    edad: 19,
    carrera: "Farmacia",
    compatibilidad: 90,
    estado: "rechazado",
    fechaSolicitud: "2024-01-12",
    imagen: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    mensaje: "Me interesa mucho tu piso. Soy muy ordenada y tengo excelentes referencias.",
    pisoTitulo: "Piso céntrico cerca de la Universidad",
    motivos: ["Zona preferida", "Estudiante ejemplar", "Referencias excelentes"],
  },
  {
    id: 6,
    nombre: "Diego Fernández",
    edad: 24,
    carrera: "Arquitectura",
    compatibilidad: 87,
    estado: "nuevo",
    fechaSolicitud: "2024-01-21",
    imagen: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    mensaje: "Soy estudiante de arquitectura, busco un lugar inspirador para vivir y estudiar.",
    pisoTitulo: "Piso céntrico cerca de la Universidad",
    motivos: ["Perfil creativo", "Zona artística", "Presupuesto adecuado"],
  },
  {
    id: 7,
    nombre: "Elena Morales",
    edad: 20,
    carrera: "Enfermería",
    compatibilidad: 93,
    estado: "interesante",
    fechaSolicitud: "2024-01-17",
    imagen: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
    mensaje: "Estudiante de enfermería, muy responsable y con horarios organizados.",
    pisoTitulo: "Apartamento moderno - Van Dyck",
    motivos: ["Carrera sanitaria", "Horarios compatibles", "Perfil responsable"],
  },
]

export default function MatchesPropietarioPage() {
  const matchesNuevos = matchesInventados.filter((m) => m.estado === "nuevo").length
  const matchesInteresantes = matchesInventados.filter((m) => m.estado === "interesante").length
  const matchesMutuos = matchesInventados.filter((m) => m.estado === "mutuo").length

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "nuevo":
        return <Badge className="bg-blue-100 text-blue-800">Nuevo</Badge>
      case "interesante":
        return <Badge className="bg-orange-100 text-orange-800">Te interesa</Badge>
      case "mutuo":
        return <Badge className="bg-green-100 text-green-800">Match!</Badge>
      case "rechazado":
        return <Badge className="bg-gray-100 text-gray-800">Rechazado</Badge>
      default:
        return null
    }
  }

  const getCompatibilidadColor = (compatibilidad: number) => {
    if (compatibilidad >= 90) return "text-green-600"
    if (compatibilidad >= 75) return "text-orange-600"
    return "text-gray-600"
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
                  Matches
                </Badge>
              </div>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/propietario/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/propietario/perfil" className="text-gray-600 hover:text-gray-900">
                Publicar Piso
              </Link>
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Inicio
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Solicitudes Nuevas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{matchesNuevos}</div>
              <p className="text-xs text-gray-500">Pendientes de revisar</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Te Interesan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{matchesInteresantes}</div>
              <p className="text-xs text-gray-500">Marcados como interesantes</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Matches Mutuos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{matchesMutuos}</div>
              <p className="text-xs text-gray-500">Conexiones exitosas</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Solicitudes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{matchesInventados.length}</div>
              <p className="text-xs text-gray-500">Todas las solicitudes</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Solicitudes de Estudiantes</h1>
          <p className="text-gray-600">Estudiantes interesados en tus pisos</p>
        </div>

        {/* Lista de Matches */}
        <div className="grid gap-6">
          {matchesInventados.map((match) => (
            <Card key={match.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-6">
                  {/* Avatar */}
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={match.imagen || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">
                      {match.nombre
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  {/* Información Principal */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {match.nombre}, {match.edad}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <GraduationCap className="w-4 h-4" />
                            <span>{match.carrera}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(match.fechaSolicitud).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-gray-50">
                            <MapPin className="w-3 h-3 mr-1" />
                            {match.pisoTitulo}
                          </Badge>
                          {getEstadoBadge(match.estado)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-2xl font-bold ${getCompatibilidadColor(match.compatibilidad)} flex items-center`}
                        >
                          <Sparkles className="w-5 h-5 mr-1" />
                          {match.compatibilidad}%
                        </div>
                        <div className="text-sm text-gray-500">compatibilidad</div>
                      </div>
                    </div>

                    {/* Mensaje */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-700 italic">"{match.mensaje}"</p>
                    </div>

                    {/* Motivos de Compatibilidad */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">¿Por qué es compatible?</h4>
                      <div className="flex flex-wrap gap-2">
                        {match.motivos.map((motivo, index) => (
                          <Badge key={index} variant="secondary" className="bg-green-50 text-green-700">
                            {motivo}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Estado del Match */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Solicitud recibida el {new Date(match.fechaSolicitud).toLocaleDateString()}
                      </div>
                      {match.estado === "mutuo" && (
                        <Badge className="bg-green-100 text-green-800 px-3 py-1">¡Match confirmado!</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
