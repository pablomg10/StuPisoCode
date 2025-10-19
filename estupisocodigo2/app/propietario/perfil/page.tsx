"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Home, Building, Users, ArrowLeft, Camera, Wifi, Car, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { propietarioStore, type Piso } from "@/lib/propietario-store"

export default function PerfilPropietarioPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const isEditing = !!editId

  const [fotoPiso, setFotoPiso] = useState<string[]>([])
  const [edadPreferida, setEdadPreferida] = useState([18, 30])
  const [loading, setLoading] = useState(false)
  const [pisoExistente, setPisoExistente] = useState<Piso | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [perfilPiso, setPerfilPiso] = useState({
    titulo: "",
    direccion: "",
    zona: "",
    precio: "",
    habitaciones: "",
    banos: "",
    metros: "",
    descripcion: "",
    tipoVivienda: "",
    amueblado: false,
    mascotas: false,
    fumadores: false,
  })

  const [preferenciasInquilino, setPreferenciasInquilino] = useState({
    generoPreferido: "",
    carrerasPreferidas: [] as string[],
    limpiezaRequerida: "",
    horarioPreferido: "",
    experienciaCompartir: "",
    ingresosMinimosMes: "",
  })

  const [servicios, setServicios] = useState<string[]>([])

  // Cargar datos existentes si estamos editando
  useEffect(() => {
    if (isEditing && editId) {
      const piso = propietarioStore.getPiso(Number.parseInt(editId))
      if (piso) {
        setPisoExistente(piso)

        // Cargar datos del piso
        setPerfilPiso({
          titulo: piso.titulo,
          direccion: piso.direccion,
          zona: piso.zona,
          precio: piso.precio.toString(),
          habitaciones: piso.habitaciones.toString(),
          banos: piso.banos.toString(),
          metros: piso.metros.toString(),
          descripcion: piso.descripcion,
          tipoVivienda: "",
          amueblado: false,
          mascotas: false,
          fumadores: false,
        })

        // Cargar fotos
        setFotoPiso(piso.fotos || [])

        // Cargar servicios
        setServicios(piso.servicios || [])

        // Cargar preferencias
        if (piso.preferencias) {
          setPreferenciasInquilino({
            generoPreferido: piso.preferencias.generoPreferido || "",
            carrerasPreferidas: piso.preferencias.carrerasPreferidas || [],
            limpiezaRequerida: piso.preferencias.limpiezaRequerida || "",
            horarioPreferido: piso.preferencias.horarioPreferido || "",
            experienciaCompartir: "",
            ingresosMinimosMes: piso.preferencias.ingresosMinimosMes?.toString() || "",
          })

          if (piso.preferencias.edadMin && piso.preferencias.edadMax) {
            setEdadPreferida([piso.preferencias.edadMin, piso.preferencias.edadMax])
          }
        }
      } else {
        alert("Piso no encontrado")
        router.push("/propietario/dashboard")
      }
    }
  }, [isEditing, editId, router])

  const zonasSalamanca = [
    "Centro Histórico",
    "Van Dyck",
    "Garrido Norte",
    "Universidad",
    "Capuchinos",
    "Buenos Aires",
    "Pizarrales",
    "Vistahermosa",
  ]

  const serviciosDisponibles = [
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "parking", label: "Parking", icon: Car },
    { id: "calefaccion", label: "Calefacción", icon: Home },
    { id: "aire", label: "Aire acondicionado", icon: Home },
    { id: "lavadora", label: "Lavadora", icon: Home },
    { id: "lavavajillas", label: "Lavavajillas", icon: Home },
    { id: "terraza", label: "Terraza/Balcón", icon: Home },
    { id: "ascensor", label: "Ascensor", icon: Building },
  ]

  const carrerasDisponibles = [
    "Medicina",
    "Derecho",
    "Ingeniería",
    "Psicología",
    "Económicas",
    "Farmacia",
    "Historia",
    "Biología",
    "Física",
    "Filología",
    "Arquitectura",
    "Química",
  ]

  const toggleServicio = (servicio: string) => {
    setServicios((prev) => (prev.includes(servicio) ? prev.filter((s) => s !== servicio) : [...prev, servicio]))
  }

  const toggleCarrera = (carrera: string) => {
    setPreferenciasInquilino((prev) => ({
      ...prev,
      carrerasPreferidas: prev.carrerasPreferidas.includes(carrera)
        ? prev.carrerasPreferidas.filter((c) => c !== carrera)
        : [...prev.carrerasPreferidas, carrera],
    }))
  }

  const handleFotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleFotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = (e) => {
            setFotoPiso((prev) => [...prev, e.target?.result as string])
          }
          reader.readAsDataURL(file)
        }
      })
    }
  }

  const eliminarFoto = (index: number) => {
    setFotoPiso((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validar campos requeridos
      if (!perfilPiso.titulo || !perfilPiso.direccion || !perfilPiso.precio) {
        alert("Por favor completa todos los campos obligatorios")
        setLoading(false)
        return
      }

      // Crear el objeto del piso
      const datosPiso = {
        titulo: perfilPiso.titulo,
        direccion: perfilPiso.direccion,
        zona: perfilPiso.zona,
        precio: Number.parseInt(perfilPiso.precio),
        habitaciones: Number.parseInt(perfilPiso.habitaciones) || 1,
        banos: Number.parseInt(perfilPiso.banos) || 1,
        metros: Number.parseInt(perfilPiso.metros),
        descripcion: perfilPiso.descripcion,
        servicios: servicios,
        fotos:
          fotoPiso.length > 0
            ? fotoPiso
            : ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"],
        estado: "activo" as const,
        preferencias: {
          generoPreferido: preferenciasInquilino.generoPreferido,
          edadMin: edadPreferida[0],
          edadMax: edadPreferida[1],
          limpiezaRequerida: preferenciasInquilino.limpiezaRequerida,
          horarioPreferido: preferenciasInquilino.horarioPreferido,
          carrerasPreferidas: preferenciasInquilino.carrerasPreferidas,
          ingresosMinimosMes: Number.parseInt(preferenciasInquilino.ingresosMinimosMes) || 0,
        },
      }

      // Simular un pequeño delay para mostrar el loading
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (isEditing && editId) {
        // Actualizar piso existente
        propietarioStore.updatePiso(Number.parseInt(editId), datosPiso)
        alert(`¡Piso "${datosPiso.titulo}" actualizado exitosamente!`)
      } else {
        // Crear nuevo piso
        const pisoGuardado = propietarioStore.addPiso(datosPiso)
        alert(`¡Piso "${pisoGuardado.titulo}" publicado exitosamente!`)
      }

      // Redirigir al dashboard
      router.push("/propietario/dashboard")
    } catch (error) {
      console.error("Error al guardar el piso:", error)
      alert("Error al guardar el piso. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
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
                <span className="text-sm text-gray-500">{isEditing ? "Editar Piso" : "Publicar Piso"}</span>
              </div>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/propietario/matches" className="text-gray-600 hover:text-gray-900">
                Matches
              </Link>
              <Link href="/propietario/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isEditing ? "Editar Piso" : "Publicar Nuevo Piso"}
            </h1>
            <p className="text-gray-600">
              {isEditing ? "Actualiza la información de tu piso" : "Describe tu piso y encuentra el inquilino perfecto"}
            </p>
            {isEditing && pisoExistente && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    Editando: <strong>{pisoExistente.titulo}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información del Piso */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-orange-500" />
                  <span>Información del Piso</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Fotos del Piso */}
                <div className="space-y-4">
                  <Label>Fotos del piso *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {fotoPiso.map((foto, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={foto || "/placeholder.svg"}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => eliminarFoto(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <div
                      onClick={handleFotoClick}
                      className="w-full h-24 border-2 border-dashed border-orange-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors"
                    >
                      <Camera className="w-6 h-6 text-orange-400" />
                      <span className="text-xs text-orange-600 mt-1 font-medium">Agregar foto</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {fotoPiso.length === 0 && "Se usará una imagen por defecto si no subes fotos"}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFotoChange}
                    className="hidden"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título del anuncio *</Label>
                    <Input
                      id="titulo"
                      value={perfilPiso.titulo}
                      onChange={(e) => setPerfilPiso({ ...perfilPiso, titulo: e.target.value })}
                      placeholder="Ej: Piso céntrico cerca de la Universidad"
                      required
                      className="border-gray-300 focus:border-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="precio">Precio mensual (€) *</Label>
                    <Input
                      id="precio"
                      type="number"
                      value={perfilPiso.precio}
                      onChange={(e) => setPerfilPiso({ ...perfilPiso, precio: e.target.value })}
                      placeholder="350"
                      required
                      min="100"
                      max="2000"
                      className="border-gray-300 focus:border-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección *</Label>
                    <Input
                      id="direccion"
                      value={perfilPiso.direccion}
                      onChange={(e) => setPerfilPiso({ ...perfilPiso, direccion: e.target.value })}
                      placeholder="Calle Toro, 15"
                      required
                      className="border-gray-300 focus:border-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Zona *</Label>
                    <Select
                      value={perfilPiso.zona}
                      onValueChange={(value) => setPerfilPiso({ ...perfilPiso, zona: value })}
                      required
                    >
                      <SelectTrigger className="border-gray-300 focus:border-orange-500">
                        <SelectValue placeholder="Selecciona zona" />
                      </SelectTrigger>
                      <SelectContent>
                        {zonasSalamanca.map((zona) => (
                          <SelectItem key={zona} value={zona}>
                            {zona}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Habitaciones *</Label>
                    <Select
                      value={perfilPiso.habitaciones}
                      onValueChange={(value) => setPerfilPiso({ ...perfilPiso, habitaciones: value })}
                      required
                    >
                      <SelectTrigger className="border-gray-300 focus:border-orange-500">
                        <SelectValue placeholder="Número de habitaciones" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 habitación</SelectItem>
                        <SelectItem value="2">2 habitaciones</SelectItem>
                        <SelectItem value="3">3 habitaciones</SelectItem>
                        <SelectItem value="4">4+ habitaciones</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Baños *</Label>
                    <Select
                      value={perfilPiso.banos}
                      onValueChange={(value) => setPerfilPiso({ ...perfilPiso, banos: value })}
                      required
                    >
                      <SelectTrigger className="border-gray-300 focus:border-orange-500">
                        <SelectValue placeholder="Número de baños" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 baño</SelectItem>
                        <SelectItem value="2">2 baños</SelectItem>
                        <SelectItem value="3">3+ baños</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metros">Metros cuadrados</Label>
                    <Input
                      id="metros"
                      type="number"
                      value={perfilPiso.metros}
                      onChange={(e) => setPerfilPiso({ ...perfilPiso, metros: e.target.value })}
                      placeholder="85"
                      min="20"
                      max="500"
                      className="border-gray-300 focus:border-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de vivienda</Label>
                    <Select
                      value={perfilPiso.tipoVivienda}
                      onValueChange={(value) => setPerfilPiso({ ...perfilPiso, tipoVivienda: value })}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-orange-500">
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="piso-completo">Piso completo</SelectItem>
                        <SelectItem value="habitacion-individual">Habitación individual</SelectItem>
                        <SelectItem value="habitacion-compartida">Habitación compartida</SelectItem>
                        <SelectItem value="estudio">Estudio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción del piso</Label>
                  <Textarea
                    id="descripcion"
                    value={perfilPiso.descripcion}
                    onChange={(e) => setPerfilPiso({ ...perfilPiso, descripcion: e.target.value })}
                    placeholder="Describe tu piso, sus características, ubicación, ambiente, etc."
                    rows={4}
                    className="border-gray-300 focus:border-orange-500"
                  />
                </div>

                {/* Servicios */}
                <div className="space-y-4">
                  <Label>Servicios incluidos</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {serviciosDisponibles.map((servicio) => {
                      const Icon = servicio.icon
                      const isSelected = servicios.includes(servicio.id)
                      return (
                        <div
                          key={servicio.id}
                          onClick={() => toggleServicio(servicio.id)}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? "border-orange-500 bg-orange-50 shadow-sm"
                              : "border-gray-200 hover:border-orange-300 hover:bg-orange-25"
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <Icon className={`w-5 h-5 ${isSelected ? "text-orange-500" : "text-gray-400"}`} />
                            <span className={`text-xs font-medium ${isSelected ? "text-orange-700" : "text-gray-600"}`}>
                              {servicio.label}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Políticas */}
                <div className="space-y-4">
                  <Label>Políticas del piso</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="amueblado"
                        checked={perfilPiso.amueblado}
                        onCheckedChange={(checked) => setPerfilPiso({ ...perfilPiso, amueblado: checked as boolean })}
                      />
                      <Label htmlFor="amueblado">Piso amueblado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mascotas"
                        checked={perfilPiso.mascotas}
                        onCheckedChange={(checked) => setPerfilPiso({ ...perfilPiso, mascotas: checked as boolean })}
                      />
                      <Label htmlFor="mascotas">Se permiten mascotas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fumadores"
                        checked={perfilPiso.fumadores}
                        onCheckedChange={(checked) => setPerfilPiso({ ...perfilPiso, fumadores: checked as boolean })}
                      />
                      <Label htmlFor="fumadores">Se permite fumar</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferencias del Inquilino */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  <span>Preferencias del Inquilino</span>
                </CardTitle>
                <CardDescription>Define el perfil ideal de tu inquilino (opcional)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Género preferido</Label>
                    <Select
                      value={preferenciasInquilino.generoPreferido}
                      onValueChange={(value) =>
                        setPreferenciasInquilino({ ...preferenciasInquilino, generoPreferido: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sin preferencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sin-preferencia">Sin preferencia</SelectItem>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Nivel de limpieza requerido</Label>
                    <Select
                      value={preferenciasInquilino.limpiezaRequerida}
                      onValueChange={(value) =>
                        setPreferenciasInquilino({ ...preferenciasInquilino, limpiezaRequerida: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sin preferencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="muy-ordenado">Muy ordenado/a</SelectItem>
                        <SelectItem value="ordenado">Ordenado/a</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="relajado">Relajado/a</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Horario preferido</Label>
                    <Select
                      value={preferenciasInquilino.horarioPreferido}
                      onValueChange={(value) =>
                        setPreferenciasInquilino({ ...preferenciasInquilino, horarioPreferido: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sin preferencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sin-preferencia">Sin preferencia</SelectItem>
                        <SelectItem value="matutino">Matutino</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="nocturno">Nocturno</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ingresos">Ingresos mínimos mensuales (€)</Label>
                    <Input
                      id="ingresos"
                      type="number"
                      value={preferenciasInquilino.ingresosMinimosMes}
                      onChange={(e) =>
                        setPreferenciasInquilino({ ...preferenciasInquilino, ingresosMinimosMes: e.target.value })
                      }
                      placeholder="800"
                      min="0"
                      max="5000"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>
                    Edad preferida: {edadPreferida[0]} - {edadPreferida[1]} años
                  </Label>
                  <Slider
                    value={edadPreferida}
                    onValueChange={setEdadPreferida}
                    max={35}
                    min={18}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>18 años</span>
                    <span>35 años</span>
                  </div>
                </div>

                {/* Carreras Preferidas */}
                <div className="space-y-4">
                  <Label>Carreras preferidas (opcional)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {carrerasDisponibles.map((carrera) => {
                      const isSelected = preferenciasInquilino.carrerasPreferidas.includes(carrera)
                      return (
                        <div
                          key={carrera}
                          onClick={() => toggleCarrera(carrera)}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                            isSelected ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"
                          }`}
                        >
                          <span className={`text-sm font-medium ${isSelected ? "text-orange-700" : "text-gray-600"}`}>
                            {carrera}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center pb-8">
              <Button
                type="submit"
                size="lg"
                className="px-12 gradient-accent text-white hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEditing ? "Actualizando..." : "Publicando..."}
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 w-5 h-5" />
                    {isEditing ? "Actualizar Piso" : "Publicar Piso"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
