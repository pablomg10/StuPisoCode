"use client"

import type React from "react"
import Image from "next/image"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import {
  Home,
  User,
  Heart,
  Music,
  Coffee,
  Book,
  Gamepad2,
  Utensils,
  Users,
  ArrowLeft,
  Bot,
  Star,
  Camera,
  Upload,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import SiteLogo from "@/components/site-logo"

export default function PerfilPage() {
  const [presupuesto, setPresupuesto] = useState([300])
  const [intereses, setIntereses] = useState<string[]>([])
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [visibleEnMatches, setVisibleEnMatches] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const [perfil, setPerfil] = useState({
    nombre: "",
    edad: "",
    carrera: "",
    descripcion: "",
    genero: "",
    tipoVivienda: "",
    zona: "",
    fumador: false,
    mascotas: false,
    fiestas: false,
    limpieza: "",
    horario: "",
  })
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      setUserId(user.id)

      const { data: profileData, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profileData) {
        setPerfil({
          nombre: profileData.nombre || "",
          edad: profileData.edad?.toString() || "",
          carrera: profileData.carrera || "",
          descripcion: profileData.bio || "",
          genero: profileData.genero || "",
          tipoVivienda: profileData.tipo_vivienda_preferida || "",
          zona: profileData.zona_preferida || "",
          fumador: profileData.fumador || false,
          mascotas: profileData.mascotas || false,
          fiestas: profileData.fiestas || false,
          limpieza: profileData.nivel_limpieza || "",
          horario: profileData.horario || "",
        })
        setPresupuesto([profileData.presupuesto_max || 300])
        setIntereses(profileData.intereses || [])
        setFotoPerfil(profileData.foto_perfil || null)
        setVisibleEnMatches(profileData.visible_en_matches ?? true)
      } else {
        if (user.user_metadata) {
          setPerfil((prev) => ({
            ...prev,
            nombre: user.user_metadata.nombre || "",
            edad: user.user_metadata.edad || "",
            carrera: user.user_metadata.carrera || "",
            genero: user.user_metadata.genero || "",
          }))
        }
      }

      setLoading(false)
    }

    loadProfile()
  }, [])

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

  const interesesDisponibles = [
    { id: "musica", label: "Música", icon: Music },
    { id: "deportes", label: "Deportes", icon: Users },
    { id: "lectura", label: "Lectura", icon: Book },
    { id: "videojuegos", label: "Videojuegos", icon: Gamepad2 },
    { id: "cocina", label: "Cocinar", icon: Utensils },
    { id: "cafe", label: "Café", icon: Coffee },
  ]

  const toggleInteres = (interes: string) => {
    setIntereses((prev) => (prev.includes(interes) ? prev.filter((i) => i !== interes) : [...prev, interes]))
  }

  const handleFotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleFotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setFotoPerfil(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        alert("Por favor, selecciona un archivo de imagen válido.")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      alert("Error: No se pudo identificar al usuario")
      return
    }

    if (!perfil.nombre.trim()) {
      alert("Por favor, ingresa tu nombre completo")
      return
    }

    setSaving(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user?.email) {
        throw new Error("No se pudo obtener el email del usuario")
      }

      const profileData = {
        id: userId,
        nombre: perfil.nombre,
        email: user.email,
        edad: perfil.edad ? Number.parseInt(perfil.edad) : null,
        carrera: perfil.carrera || null,
        bio: perfil.descripcion || null,
        genero: perfil.genero || null,
        tipo_vivienda_preferida: perfil.tipoVivienda || null,
        zona_preferida: perfil.zona || null,
        presupuesto_max: presupuesto[0],
        fumador: perfil.fumador,
        mascotas: perfil.mascotas,
        fiestas: perfil.fiestas,
        nivel_limpieza: perfil.limpieza || null,
        horario: perfil.horario || null,
        intereses: intereses,
        foto_perfil: fotoPerfil,
        visible_en_matches: visibleEnMatches,
      }

      const { data, error } = await supabase
        .from("profiles")
        .upsert(profileData, {
          onConflict: "id",
        })
        .select()

      if (error) {
        throw new Error(`Error de Supabase: ${error.message || "Error desconocido"}`)
      }

      alert("¡Perfil guardado exitosamente! Ahora puedes ver tus matches.")
      router.push("/matches")
    } catch (error) {
      console.error("[v0] Error saving profile:", error)

      if (error instanceof Error) {
        alert(`Error al guardar el perfil: ${error.message}`)
      } else {
        alert("Error desconocido al guardar el perfil. Por favor, revisa la consola.")
      }
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-muted-foreground">Cargando perfil...</p>
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
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <SiteLogo />
              </Link>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/matches" className="text-gray-600 hover:text-gray-900">
                Matches
              </Link>
              <Link href="/mapa" className="text-gray-600 hover:text-gray-900">
                Mapa
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Crea tu perfil</h1>
            <p className="text-gray-600">Cuéntanos sobre ti para encontrar el compañero perfecto</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {visibleEnMatches ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  <span>Configuración de Visibilidad</span>
                </CardTitle>
                <CardDescription>Controla quién puede ver tu perfil en el sistema de matches</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="visible-matches" className="text-base font-medium cursor-pointer">
                      Aparecer en matches
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {visibleEnMatches
                        ? "Tu perfil es visible para otros usuarios"
                        : "Tu perfil está oculto, no aparecerás en búsquedas"}
                    </p>
                  </div>
                  <Switch
                    id="visible-matches"
                    checked={visibleEnMatches}
                    onCheckedChange={setVisibleEnMatches}
                    className="ml-4"
                  />
                </div>

                {!visibleEnMatches && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Nota:</strong> Mientras tu perfil esté oculto, no recibirás nuevos matches ni aparecerás
                      en las búsquedas de otros usuarios. Tus matches existentes se mantendrán.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Información Personal</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center mb-6">
                  <div className="relative group">
                    <Avatar
                      className="w-24 h-24 cursor-pointer transition-all duration-200 group-hover:ring-4 group-hover:ring-orange-200"
                      onClick={handleFotoClick}
                    >
                      <AvatarImage src={fotoPerfil || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl bg-gray-100">{perfil.nombre.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>

                    <div
                      className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                      onClick={handleFotoClick}
                    >
                      <Camera className="w-6 h-6 text-white" />
                    </div>

                    {!fotoPerfil && (
                      <div className="absolute -bottom-2 -right-2 bg-orange-500 rounded-full p-2 shadow-lg">
                        <Upload className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFotoChange}
                    className="hidden"
                  />
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    {fotoPerfil ? "¡Foto subida correctamente!" : "Haz clic en el avatar para subir tu foto"}
                  </p>
                  <p className="text-xs text-gray-500">Formatos admitidos: JPG, PNG, GIF (máx. 5MB)</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre completo</Label>
                    <Input
                      id="nombre"
                      value={perfil.nombre}
                      onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edad">Edad</Label>
                    <Input
                      id="edad"
                      type="number"
                      value={perfil.edad}
                      onChange={(e) => setPerfil({ ...perfil, edad: e.target.value })}
                      placeholder="Tu edad"
                      min="18"
                      max="35"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carrera">Carrera/Estudios</Label>
                    <Input
                      id="carrera"
                      value={perfil.carrera}
                      onChange={(e) => setPerfil({ ...perfil, carrera: e.target.value })}
                      placeholder="Ej: Derecho, Medicina, etc."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="genero">Género</Label>
                    <Select value={perfil.genero} onValueChange={(value) => setPerfil({ ...perfil, genero: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                        <SelectItem value="prefiero-no-decir">Prefiero no decir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción personal</Label>
                  <Textarea
                    id="descripcion"
                    value={perfil.descripcion}
                    onChange={(e) => setPerfil({ ...perfil, descripcion: e.target.value })}
                    placeholder="Cuéntanos un poco sobre ti, tus aficiones, qué buscas en un compañero de piso..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferencias de Vivienda */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Home className="w-5 h-5" />
                  <span>Preferencias de Vivienda</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Tipo de vivienda</Label>
                    <Select
                      value={perfil.tipoVivienda}
                      onValueChange={(value) => setPerfil({ ...perfil, tipoVivienda: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="piso-compartido">Piso compartido</SelectItem>
                        <SelectItem value="residencia">Residencia universitaria</SelectItem>
                        <SelectItem value="estudio">Estudio</SelectItem>
                        <SelectItem value="habitacion">Habitación individual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Zona preferida</Label>
                    <Select value={perfil.zona} onValueChange={(value) => setPerfil({ ...perfil, zona: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona zona" />
                      </SelectTrigger>
                      <SelectContent>
                        {zonasSalamanca.map((zona) => (
                          <SelectItem key={zona} value={zona.toLowerCase().replace(/\s+/g, "-")}>
                            {zona}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Presupuesto mensual: {presupuesto[0]}€</Label>
                  <Slider
                    value={presupuesto}
                    onValueChange={setPresupuesto}
                    max={800}
                    min={200}
                    step={25}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>200€</span>
                    <span>800€</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estilo de Vida */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Estilo de Vida</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Nivel de limpieza</Label>
                    <Select
                      value={perfil.limpieza}
                      onValueChange={(value) => setPerfil({ ...perfil, limpieza: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona nivel" />
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
                    <Label>Horario</Label>
                    <Select value={perfil.horario} onValueChange={(value) => setPerfil({ ...perfil, horario: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona horario" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="matutino">Matutino (madrugador)</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="nocturno">Nocturno (trasnocho)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Hábitos</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fumador"
                        checked={perfil.fumador}
                        onCheckedChange={(checked) => setPerfil({ ...perfil, fumador: checked as boolean })}
                      />
                      <Label htmlFor="fumador">Fumador/a</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mascotas"
                        checked={perfil.mascotas}
                        onCheckedChange={(checked) => setPerfil({ ...perfil, mascotas: checked as boolean })}
                      />
                      <Label htmlFor="mascotas">Tengo mascotas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fiestas"
                        checked={perfil.fiestas}
                        onCheckedChange={(checked) => setPerfil({ ...perfil, fiestas: checked as boolean })}
                      />
                      <Label htmlFor="fiestas">Me gusta hacer fiestas en casa</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intereses */}
            <Card>
              <CardHeader>
                <CardTitle>Intereses y Aficiones</CardTitle>
                <CardDescription>Selecciona tus intereses para encontrar personas afines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {interesesDisponibles.map((interes) => {
                    const Icon = interes.icon
                    const isSelected = intereses.includes(interes.id)
                    return (
                      <div
                        key={interes.id}
                        onClick={() => toggleInteres(interes.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <Icon className={`w-6 h-6 ${isSelected ? "text-orange-500" : "text-gray-400"}`} />
                          <span className={`text-sm font-medium ${isSelected ? "text-orange-700" : "text-gray-600"}`}>
                            {interes.label}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chatbot">
                <Button variant="outline" size="lg" className="px-8 bg-transparent">
                  <Bot className="mr-2 w-5 h-5" />
                  Asistente IA
                </Button>
              </Link>
              <Link href="/valoraciones">
                <Button variant="outline" size="lg" className="px-8 bg-transparent">
                  <Star className="mr-2 w-5 h-5" />
                  Mis Valoraciones
                </Button>
              </Link>
            </div>
            <div className="flex justify-center">
              <Button type="submit" size="lg" className="px-12" disabled={saving}>
                {saving ? "Guardando..." : "Guardar Perfil y Buscar Matches"}
                <Heart className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
