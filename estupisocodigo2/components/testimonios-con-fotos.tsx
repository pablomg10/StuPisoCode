"use client"

import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Star } from "lucide-react"
import AvatarUsuario from "./avatar-usuario"

const testimoniosConFotos = [
  {
    id: 1,
    nombre: "María García",
    edad: 21,
    carrera: "Medicina",
    testimonio:
      "EsTuPiso me ayudó a encontrar a mi compañera ideal. Ahora vivimos en el centro y estamos súper contentas. ¡100% recomendado!",
    puntuacion: 5,
    imagen: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: 2,
    nombre: "Carlos Ruiz",
    edad: 23,
    carrera: "Ingeniería Informática",
    testimonio:
      "La plataforma es genial. El sistema de matches funciona perfectamente y encontré compañeros con mis mismos gustos.",
    puntuacion: 5,
    imagen: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: 3,
    nombre: "Ana Martín",
    edad: 20,
    carrera: "Psicología",
    testimonio:
      "Me encanta lo fácil que es usar la app. El chatbot me ayudó a definir mis preferencias y ahora tengo el piso perfecto.",
    puntuacion: 5,
    imagen: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face",
  },
]

export default function TestimoniosConFotos() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {testimoniosConFotos.map((testimonio) => (
        <Card key={testimonio.id} className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-base text-gray-700">"{testimonio.testimonio}"</p>
          </CardHeader>
          <CardFooter>
            <div className="flex items-center space-x-3">
              <AvatarUsuario nombre={testimonio.nombre} imagen={testimonio.imagen} size="md" />
              <div>
                <p className="font-semibold text-gray-900">
                  {testimonio.nombre}, {testimonio.edad}
                </p>
                <p className="text-sm text-gray-600">{testimonio.carrera}</p>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
