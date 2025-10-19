"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

// Galería de estudiantes universitarios jóvenes
const estudiantesEjemplo = [
  {
    nombre: "María García",
    carrera: "Medicina",
    imagen: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
  },
  {
    nombre: "Carlos Ruiz",
    carrera: "Ingeniería",
    imagen: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face",
  },
  {
    nombre: "Ana Martín",
    carrera: "Psicología",
    imagen: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face",
  },
  {
    nombre: "Laura Sánchez",
    carrera: "Derecho",
    imagen: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop&crop=face",
  },
  {
    nombre: "David López",
    carrera: "Económicas",
    imagen: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop&crop=face",
  },
  {
    nombre: "Sofía Ruiz",
    carrera: "Farmacia",
    imagen: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face",
  },
  {
    nombre: "Javier Moreno",
    carrera: "Historia",
    imagen: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
  },
  {
    nombre: "Elena Vega",
    carrera: "Biología",
    imagen: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
  },
]

export default function GaleriaUsuarios() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Estudiantes en EsTuPiso</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          {estudiantesEjemplo.map((estudiante, index) => (
            <div key={index} className="text-center space-y-2">
              <Avatar className="w-16 h-16 mx-auto">
                <AvatarImage src={estudiante.imagen || "/placeholder.svg"} alt={estudiante.nombre} />
                <AvatarFallback>{estudiante.nombre.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{estudiante.nombre}</p>
                <Badge variant="secondary" className="text-xs">
                  {estudiante.carrera}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
