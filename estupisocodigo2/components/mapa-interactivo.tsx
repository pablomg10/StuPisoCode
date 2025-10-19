"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Bed, Bath, Home, Heart, X } from "lucide-react"

interface Piso {
  id: number
  titulo: string
  direccion: string
  zona: string
  precio: number
  habitaciones: number
  banos: number
  metros: number
  descripcion: string
  servicios: string[]
  contacto: {
    nombre: string
    telefono: string
    email: string
  }
  coordenadas: {
    lat: number
    lng: number
  }
  imagenes: string[]
}

interface MapaInteractivoProps {
  pisos: Piso[]
  onPisoClick: (piso: Piso) => void
}

export default function MapaInteractivo({ pisos, onPisoClick }: MapaInteractivoProps) {
  const [pisoHover, setPisoHover] = useState<number | null>(null)
  const [pisoSeleccionado, setPisoSeleccionado] = useState<Piso | null>(null)

  // Salamanca bounds: lat 40.945-40.98, lng -5.672 to -5.645
  const coordenadasAPixeles = (lat: number, lng: number) => {
    const minLat = 40.945
    const maxLat = 40.98
    const minLng = -5.672
    const maxLng = -5.645

    const x = ((lng - minLng) / (maxLng - minLng)) * 100
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100

    return { x, y }
  }

  const obtenerColorPrecio = (precio: number) => {
    if (precio < 300) return "bg-green-500"
    if (precio < 400) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
            linear-gradient(to right, #94a3b8 1px, transparent 1px),
            linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
          `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="absolute top-4 left-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
          <h3 className="font-serif text-xl font-semibold text-gray-800">Salamanca</h3>
          <p className="text-sm text-gray-600">{pisos.length} propiedades disponibles</p>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg">
          <p className="text-xs font-medium text-gray-700 mb-2">Precio por mes</p>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">&lt; 300€</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs text-gray-600">300€ - 400€</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-600">&gt; 400€</span>
            </div>
          </div>
        </div>
      </div>

      {pisos.map((piso) => {
        const { x, y } = coordenadasAPixeles(piso.coordenadas.lat, piso.coordenadas.lng)
        const isHovered = pisoHover === piso.id

        return (
          <div
            key={piso.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ left: `${x}%`, top: `${y}%` }}
            onMouseEnter={() => setPisoHover(piso.id)}
            onMouseLeave={() => setPisoHover(null)}
            onClick={() => setPisoSeleccionado(piso)}
          >
            {/* Marker */}
            <div
              className={`
                ${obtenerColorPrecio(piso.precio)} 
                text-white rounded-full px-3 py-1 text-xs font-bold 
                shadow-lg cursor-pointer transition-all duration-200
                border-2 border-white
                ${isHovered ? "scale-125 shadow-2xl" : "hover:scale-110"}
              `}
            >
              {piso.precio}€
            </div>

            {/* Hover tooltip */}
            {isHovered && (
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 w-48 pointer-events-none">
                <Card className="shadow-xl">
                  <CardContent className="p-3">
                    <p className="font-semibold text-sm text-gray-900 mb-1">{piso.titulo}</p>
                    <div className="flex items-center text-gray-600 text-xs mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{piso.zona}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <div className="flex items-center">
                        <Bed className="w-3 h-3 mr-1" />
                        <span>{piso.habitaciones}</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-3 h-3 mr-1" />
                        <span>{piso.banos}</span>
                      </div>
                      <div className="flex items-center">
                        <Home className="w-3 h-3 mr-1" />
                        <span>{piso.metros}m²</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )
      })}

      {pisoSeleccionado && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <Card className="max-w-md w-full max-h-[80vh] overflow-y-auto">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={pisoSeleccionado.imagenes[0] || "/placeholder.svg"}
                  alt={pisoSeleccionado.titulo}
                  className="w-full h-48 object-cover"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => setPisoSeleccionado(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">{pisoSeleccionado.titulo}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{pisoSeleccionado.direccion}</span>
                    </div>
                    <Badge variant="secondary">{pisoSeleccionado.zona}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">{pisoSeleccionado.precio}€</div>
                    <div className="text-xs text-gray-500">por mes</div>
                  </div>
                </div>

                <p className="text-sm text-gray-700">{pisoSeleccionado.descripcion}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Bed className="w-4 h-4" />
                    <span>{pisoSeleccionado.habitaciones} hab.</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bath className="w-4 h-4" />
                    <span>{pisoSeleccionado.banos} baños</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Home className="w-4 h-4" />
                    <span>{pisoSeleccionado.metros} m²</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {pisoSeleccionado.servicios.map((servicio) => (
                    <Badge key={servicio} variant="outline" className="text-xs">
                      {servicio}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{pisoSeleccionado.contacto.nombre}</p>
                    <p className="text-xs text-gray-500">Propietario</p>
                  </div>
                  <Button
                    onClick={() => {
                      onPisoClick(pisoSeleccionado)
                      setPisoSeleccionado(null)
                    }}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Me interesa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
