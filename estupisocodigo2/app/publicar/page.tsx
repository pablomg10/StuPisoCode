"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import SiteLogo from "@/components/site-logo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Home, Building, Users, Camera, Wifi, Car, CheckCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import SeleccionarUbicacion from "@/components/seleccionar-ubicacion"
import PropietarioVerification from "@/components/propietario-verification"

export default function PublicarPage() {
  const router = useRouter()
  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.length > 1 ? router.back() : router.push('/')
    }
  }
  const [fotoPiso, setFotoPiso] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

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
  const [edadPreferida, setEdadPreferida] = useState<[number, number]>([18, 30])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [showVerification, setShowVerification] = useState(false)
  const [userLogged, setUserLogged] = useState<boolean | null>(null)
  const [isPropietario, setIsPropietario] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("is_propietario") === "true"
    }
    return false
  })

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

  useEffect(() => {
    const draft = localStorage.getItem("publicar-draft")
    if (draft) {
      try {
        const data = JSON.parse(draft)
        if (data.perfilPiso) setPerfilPiso((p) => ({ ...p, ...data.perfilPiso }))
        if (data.preferenciasInquilino) setPreferenciasInquilino((p) => ({ ...p, ...data.preferenciasInquilino }))
        setServicios(data.servicios || [])
        setFotoPiso(data.fotoPiso || [])
        setEdadPreferida(data.edadPreferida || [18, 30])
        setMessage("Se ha cargado un borrador local. Revísalo antes de publicar.")
        if (data.coords) setCoords(data.coords)
      } catch (e) {
        // ignore
      }
    }
  }, [])

  useEffect(() => {
    // Check if user is authenticated to enable publish button
    const checkUser = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase.auth.getUser()
        setUserLogged(!!data.user)
      } catch (e) {
        setUserLogged(false)
      }
    }
    checkUser()
  }, [])

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

  const handleFotoClick = () => fileInputRef.current?.click()

  const handleFotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = (e) => setFotoPiso((prev) => [...prev, e.target?.result as string])
          reader.readAsDataURL(file)
        }
      })
    }
  }

  const eliminarFoto = (index: number) => setFotoPiso((prev) => prev.filter((_, i) => i !== index))

  const saveDraft = () => {
    const draft = { perfilPiso, preferenciasInquilino, servicios, fotoPiso, edadPreferida, updatedAt: new Date().toISOString() }
    if (coords) (draft as any).coords = coords
    localStorage.setItem("publicar-draft", JSON.stringify(draft))
    setMessage("Borrador guardado en tu navegador")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (!perfilPiso.titulo || !perfilPiso.direccion || !perfilPiso.precio) {
        setMessage("Por favor completa los campos obligatorios: título, dirección y precio")
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { data: sessionData } = await supabase.auth.getUser()
      const user = sessionData.user

      if (!user) {
        saveDraft()
        setLoading(false)
        const next = encodeURIComponent(window.location.pathname)
        window.location.href = `/login?next=${next}`
        return
      }

      const datosPiso = {
        titulo: perfilPiso.titulo,
        direccion: perfilPiso.direccion,
        zona: perfilPiso.zona,
        precio: Number.parseInt(perfilPiso.precio) || 0,
        habitaciones: Number.parseInt(perfilPiso.habitaciones) || 1,
        banos: Number.parseInt(perfilPiso.banos) || 1,
        metros: Number.parseInt(perfilPiso.metros) || null,
        descripcion: perfilPiso.descripcion,
        tipoVivienda: perfilPiso.tipoVivienda,
        amueblado: perfilPiso.amueblado,
        mascotas: perfilPiso.mascotas,
        fumadores: perfilPiso.fumadores,
        servicios,
        fotos: fotoPiso.length > 0 ? fotoPiso : ["/placeholder.jpg"],
        latitude: null,
        longitude: null,
        estado: "activo",
        preferencias: {
          generoPreferido: preferenciasInquilino.generoPreferido,
          edadMin: edadPreferida[0],
          edadMax: edadPreferida[1],
          limpiezaRequerida: preferenciasInquilino.limpiezaRequerida,
          horarioPreferido: preferenciasInquilino.horarioPreferido,
          carrerasPreferidas: preferenciasInquilino.carrerasPreferidas,
          ingresosMinimosMes: Number.parseInt(preferenciasInquilino.ingresosMinimosMes) || 0,
        },
        owner_id: user.id,
      }

      // If user selected coords, use them; otherwise estimate by zona
      if (coords) {
        ;(datosPiso as any).latitude = coords.lat
        ;(datosPiso as any).longitude = coords.lng
      } else {
        // Simple zone centroid estimations (hardcoded for Salamanca zones)
        const zoneEstimates: Record<string, { lat: number; lng: number }> = {
          "Centro Histórico": { lat: 40.9692, lng: -5.664 },
          "Van Dyck": { lat: 40.965, lng: -5.655 },
          "Garrido Norte": { lat: 40.975, lng: -5.66 },
          "Universidad": { lat: 40.964, lng: -5.668 },
          "Capuchinos": { lat: 40.958, lng: -5.672 },
          "Buenos Aires": { lat: 40.952, lng: -5.658 },
          "Pizarrales": { lat: 40.945, lng: -5.645 },
          "Vistahermosa": { lat: 40.98, lng: -5.65 },
        }
        const est = zoneEstimates[perfilPiso.zona]
        if (est) {
          ;(datosPiso as any).latitude = est.lat
          ;(datosPiso as any).longitude = est.lng
        }
      }

      // Map our front-end datosPiso shape to the actual `properties` table schema
      const dbRow = {
        owner_id: user.id,
        title: datosPiso.titulo,
        description: datosPiso.descripcion,
        address: datosPiso.direccion,
        city: datosPiso.zona || "Salamanca",
        price_monthly: datosPiso.precio,
        bedrooms: datosPiso.habitaciones,
        bathrooms: datosPiso.banos,
        size_sqm: datosPiso.metros || null,
        latitude: (datosPiso as any).latitude || null,
        longitude: (datosPiso as any).longitude || null,
        images: datosPiso.fotos || [],
        amenities: datosPiso.servicios || [],
        active: datosPiso.estado === "activo",
      }

      // Try inserting into the properties table (this matches your SQL scripts)
      const insert = await supabase.from("properties").insert([dbRow]).select()
      // Log the full result for debugging
      console.log("Insert result:", insert)

      if (insert.error) {
        console.error("Error al insertar property:", insert.error)
        const err = insert.error
        const detailed = [err.message, (err as any).details, (err as any).hint].filter(Boolean).join(" — ")
        saveDraft()
        setMessage(`Error al publicar: ${detailed || JSON.stringify(insert)}`)
        setLoading(false)
        return
      }

      localStorage.removeItem("publicar-draft")
      setMessage("Piso publicado correctamente")
      setLoading(false)
      // If insert returned data, redirect to its detail page
      const newId = (insert.data && Array.isArray(insert.data) && insert.data[0] && (insert.data[0] as any).id) || null
      if (newId) {
        router.push(`/pisos/${newId}`)
      } else {
        router.push("/perfil")
      }
    } catch (err) {
      console.error(err)
      saveDraft()
      setMessage("Error inesperado. Se ha guardado un borrador localmente.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <button type="button" onClick={handleBack} aria-label="Volver" className="p-2 rounded-md inline-flex text-gray-600 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <Link href="/" className="flex items-center" aria-label="Ir a la página principal">
                <SiteLogo />
              </Link>
            </div>

            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">Inicio</Link>
              <span className="text-sm font-semibold text-orange-600">Publicar</span>
              <Link href="/perfil" className="text-sm text-gray-600 hover:text-gray-900">Mi perfil</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Publicar Nuevo Piso</h1>
            <p className="text-gray-600">Describe tu piso y encuentra el inquilino perfecto</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-end space-x-3 mb-2">
              {!isPropietario ? (
                <Button onClick={() => setShowVerification(true)} variant="outline">Soy propietario</Button>
              ) : (
                <div className="text-sm text-green-600 font-medium">Verificado como propietario</div>
              )}
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-orange-500" />
                  <span>Información del Piso</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                  <p className="text-sm text-gray-500">{fotoPiso.length === 0 && "Se usará una imagen por defecto si no subes fotos"}</p>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFotoChange} className="hidden" />
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
                    <Select value={perfilPiso.zona} onValueChange={(value) => setPerfilPiso({ ...perfilPiso, zona: value })} required>
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
                    <Label>Ubicación exacta (opcional)</Label>
                    <p className="text-sm text-gray-500">Selecciona la ubicación exacta en el mapa. Si no la seleccionas, se estimará automáticamente según la zona.</p>
                    <SeleccionarUbicacion initial={coords} onChange={(c) => setCoords(c)} />
                    {coords && (
                      <div className="text-sm text-gray-700 mt-2">Coordenadas seleccionadas: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Habitaciones *</Label>
                    <Select value={perfilPiso.habitaciones} onValueChange={(value) => setPerfilPiso({ ...perfilPiso, habitaciones: value })} required>
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
                    <Select value={perfilPiso.banos} onValueChange={(value) => setPerfilPiso({ ...perfilPiso, banos: value })} required>
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
                    <Input id="metros" type="number" value={perfilPiso.metros} onChange={(e) => setPerfilPiso({ ...perfilPiso, metros: e.target.value })} placeholder="85" min="20" max="500" className="border-gray-300 focus:border-orange-500" />
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de vivienda</Label>
                    <Select value={perfilPiso.tipoVivienda} onValueChange={(value) => setPerfilPiso({ ...perfilPiso, tipoVivienda: value })}>
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-orange-500" />
                    <span>Preferencias del Inquilino</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Género preferido</Label>
                      <Select
                        value={preferenciasInquilino.generoPreferido}
                        onValueChange={(value) => setPreferenciasInquilino({ ...preferenciasInquilino, generoPreferido: value })}
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
                        onValueChange={(value) => setPreferenciasInquilino({ ...preferenciasInquilino, limpiezaRequerida: value })}
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
                        onValueChange={(value) => setPreferenciasInquilino({ ...preferenciasInquilino, horarioPreferido: value })}
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
                        onChange={(e) => setPreferenciasInquilino({ ...preferenciasInquilino, ingresosMinimosMes: e.target.value })}
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
                    <Slider value={edadPreferida as unknown as number[]} onValueChange={(v: number[]) => setEdadPreferida([v[0], v[1]])} max={35} min={18} step={1} className="w-full" />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>18 años</span>
                      <span>35 años</span>
                    </div>
                  </div>

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

                <div className="flex flex-col items-center gap-3 justify-center pb-8">
                <div className="flex items-center gap-3">
                  <Button type="submit" size="lg" className="px-12 gradient-accent text-white hover:opacity-90 transition-opacity" disabled={loading || !isPropietario || userLogged === false}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Publicando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 w-5 h-5" />
                      Publicar Piso
                    </>
                  )}
                </Button>
                
                <Button variant="outline" onClick={saveDraft} className="ml-4">
                  Guardar borrador
                </Button>
                </div>

                {userLogged === false && (
                  <div className="text-sm text-gray-700 mt-2">
                    Debes <a href="/login" className="text-orange-600 font-semibold">iniciar sesión</a> para publicar un piso. Si ya tienes cuenta, inicia sesión; si no, regístrate con Google o correo.
                  </div>
                )}
              </div>
              {showVerification && (
                <PropietarioVerification
                  onVerified={() => {
                    setIsPropietario(true)
                    localStorage.setItem("is_propietario", "true")
                    setShowVerification(false)
                  }}
                  onCancelled={() => setShowVerification(false)}
                />
              )}
            </form>
          </div>
        </div>
      </div>
    )
  }
