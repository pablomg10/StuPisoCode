"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Home } from "lucide-react"

interface Piso {
  id: number
  titulo: string
  direccion: string
  zona: string
  precio: number
  contacto: {
    nombre: string
    telefono: string
    email: string
  }
}

interface FormularioInteresProps {
  piso: Piso | null
  abierto: boolean
  onClose: () => void
}

export default function FormularioInteres({ piso, abierto, onClose }: FormularioInteresProps) {
  const [paso, setPaso] = useState<"formulario" | "contacto">("formulario")
  const [cargando, setCargando] = useState(false)
  const [datos, setDatos] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    // Simular envío de datos
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Aquí se enviarían los datos a EsTuPiso para gestionar el contacto
    console.log("Lead generado para EsTuPiso:", {
      usuario: datos,
      piso: {
        id: piso?.id,
        titulo: piso?.titulo,
        direccion: piso?.direccion,
        precio: piso?.precio,
      },
      fechaSolicitud: new Date().toISOString(),
      estado: "pendiente_revision",
    })

    setCargando(false)
    setPaso("contacto")
  }

  const handleClose = () => {
    setPaso("formulario")
    setDatos({ nombre: "", email: "", telefono: "", mensaje: "" })
    onClose()
  }

  if (!piso) return null

  return (
    <Dialog open={abierto} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {paso === "formulario" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Home className="w-5 h-5 text-orange-500" />
                <span>Me interesa este piso</span>
              </DialogTitle>
              <DialogDescription>
                Completa tus datos para contactar con el arrendador de "{piso.titulo}"
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre completo *</Label>
                <Input
                  id="nombre"
                  value={datos.nombre}
                  onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={datos.email}
                  onChange={(e) => setDatos({ ...datos, email: e.target.value })}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={datos.telefono}
                  onChange={(e) => setDatos({ ...datos, telefono: e.target.value })}
                  placeholder="+34 123 456 789"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensaje">Mensaje (opcional)</Label>
                <Textarea
                  id="mensaje"
                  value={datos.mensaje}
                  onChange={(e) => setDatos({ ...datos, mensaje: e.target.value })}
                  placeholder="Cuéntale al arrendador por qué te interesa este piso..."
                  rows={3}
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>¿Por qué pedimos tus datos?</strong>
                  <br />
                  Esto nos ayuda a conectarte mejor con el arrendador y a mejorar nuestro servicio. Tus datos están
                  protegidos y solo se compartirán con el propietario de este piso.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={cargando}>
                {cargando ? "Enviando..." : "Obtener datos de contacto"}
              </Button>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>¡Solicitud enviada correctamente!</span>
              </DialogTitle>
              <DialogDescription>Hemos recibido tu interés en este piso</DialogDescription>
            </DialogHeader>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Tu solicitud está en proceso!</h3>
                  <p className="text-gray-600 mb-4">
                    Hemos enviado tu información al arrendador y nos pondremos en contacto contigo pronto.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">¿Qué sigue ahora?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Revisaremos tu perfil y compatibilidad</li>
                    <li>• Contactaremos al arrendador en tu nombre</li>
                    <li>• Te notificaremos por email y WhatsApp</li>
                    <li>• Coordinaremos la visita si hay interés mutuo</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">Información del piso solicitado:</h4>
                  <div className="text-sm text-orange-800 space-y-1">
                    <p>
                      <strong>Piso:</strong> {piso.titulo}
                    </p>
                    <p>
                      <strong>Ubicación:</strong> {piso.direccion}
                    </p>
                    <p>
                      <strong>Precio:</strong> {piso.precio}€/mes
                    </p>
                    <p>
                      <strong>Zona:</strong> {piso.zona}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Tiempo estimado de respuesta:</strong> 24-48 horas laborables
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>¿Tienes preguntas?</strong> Contacta con nosotros en{" "}
                    <a href="mailto:info@estupiso.com" className="text-orange-600 hover:underline">
                      info@estupiso.com
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleClose} className="w-full">
              Entendido
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
