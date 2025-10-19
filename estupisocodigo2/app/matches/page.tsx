"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Heart,
  X,
  MapPin,
  GraduationCap,
  Clock,
  Euro,
  Users,
  Star,
  MessageCircle,
  Search,
  Sparkles,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import AvatarUsuario from "@/components/avatar-usuario"
import { useRouter } from "next/navigation"
import Image from "next/image"
import SiteLogo from "@/components/site-logo"
import { createClient } from "@/lib/supabase/client"
import MatchModal from "@/components/match-modal"

interface Profile {
  id: string
  nombre: string
  edad: number
  carrera: string
  bio: string
  zona_preferida: string
  presupuesto_max: number
  intereses: string[]
  nivel_limpieza: string
  horario: string
  foto_perfil: string
  genero: string
}

interface Match {
  id: string
  nombre: string
  edad: number
  carrera: string
  zona: string
  foto_perfil: string
  created_at: string
}

export default function MatchesPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [usuariosPotenciales, setUsuariosPotenciales] = useState<Profile[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [vistaActual, setVistaActual] = useState<"descubrir" | "matches">("descubrir")
  const [busqueda, setBusqueda] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [newMatchData, setNewMatchData] = useState<{ name: string; image: string } | null>(null)
  const [likedUsers, setLikedUsers] = useState<Set<string>>(new Set())

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      setCurrentUserId(user.id)

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        // profiles.roles is a text[] column; use contains to find estudiantes
        .contains("roles", ["estudiante"])
        .eq("visible_en_matches", true)
        .neq("id", user.id)

      if (profilesError) throw profilesError

      setUsuariosPotenciales(profiles || [])

      const { data: existingLikes } = await supabase.from("likes").select("to_user_id").eq("from_user_id", user.id)

      if (existingLikes) {
        setLikedUsers(new Set(existingLikes.map((like) => like.to_user_id)))
      }

      const { data: matchesData, error: matchesError } = await supabase
        .from("matches")
        .select(
          `
          id,
          user1_id,
          user2_id,
          created_at,
          user1:profiles!matches_user1_id_fkey(nombre, edad, carrera, zona_preferida, foto_perfil),
          user2:profiles!matches_user2_id_fkey(nombre, edad, carrera, zona_preferida, foto_perfil)
        `,
        )
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)

      if (!matchesError && matchesData) {
        const formattedMatches = matchesData.map((match: any) => {
          const otherUser = match.user1_id === user.id ? match.user2 : match.user1
          return {
            id: match.id,
            nombre: otherUser.nombre,
            edad: otherUser.edad,
            carrera: otherUser.carrera,
            zona: otherUser.zona_preferida,
            foto_perfil: otherUser.foto_perfil,
            created_at: match.created_at,
          }
        })
        setMatches(formattedMatches)
      }
    } catch (error) {
      console.error("[v0] Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateCompatibility = (profile?: Profile | null) => {
    // Defensive compatibility algorithm: return 0 if no profile
    if (!profile) return 0

    // Ensure intereses is an array
    const intereses = Array.isArray(profile.intereses) ? profile.intereses : []

    let score = 70 // Base score

    // Add points for matching preferences
    if (intereses.length > 0) {
      score += Math.min(intereses.length * 5, 20)
    }

    return Math.min(score, 99)
  }

  const handleLike = async () => {
    if (!currentUserId || usuariosPotenciales.length === 0) return

    const usuario = usuariosPotenciales[currentIndex]

    try {
      const { error: likeError } = await supabase.from("likes").insert({
        from_user_id: currentUserId,
        to_user_id: usuario.id,
      })

      if (likeError) throw likeError

      const { data: mutualLike } = await supabase
        .from("likes")
        .select("*")
        .eq("from_user_id", usuario.id)
        .eq("to_user_id", currentUserId)
        .single()

      if (mutualLike) {
        // It's a match!
        setNewMatchData({
          name: usuario.nombre,
          image: usuario.foto_perfil || "/placeholder.svg",
        })
        setShowMatchModal(true)

        // Ensure there is a record in `matches` for this pair (avoid duplicates)
        try {
          const { data: existingMatches, error: existingError } = await supabase
            .from("matches")
            .select("id")
            .or(
              `and(user1_id.eq.${currentUserId},user2_id.eq.${usuario.id}),and(user1_id.eq.${usuario.id},user2_id.eq.${currentUserId})`,
            )

          if (existingError) {
            console.warn("Error checking existing match:", existingError)
          }

          if (!existingMatches || existingMatches.length === 0) {
            const { error: insertMatchError } = await supabase.from("matches").insert({
              user1_id: currentUserId,
              user2_id: usuario.id,
            })

            if (insertMatchError) console.warn("Error inserting match:", insertMatchError)
          }
        } catch (err) {
          console.warn("Unexpected error ensuring match record:", err)
        }

        // Reload matches
        await loadData()
      }

      // Mark as liked
      setLikedUsers((prev) => new Set([...prev, usuario.id]))
    } catch (error) {
      console.error("[v0] Error creating like:", error)
    }

    nextUser()
  }

  const handlePass = () => {
    nextUser()
  }

  const nextUser = () => {
    if (currentIndex < usuariosPotenciales.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  const matchesFiltrados = matches.filter(
    (match) =>
      match.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      match.carrera.toLowerCase().includes(busqueda.toLowerCase()),
  )

  const availableUsers = usuariosPotenciales.filter((user) => !likedUsers.has(user.id))
  const currentUser = availableUsers[currentIndex]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Cargando matches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <SiteLogo />
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/perfil"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Mi Perfil
              </Link>
              <Link href="/matches" className="text-foreground transition-colors text-sm font-medium">
                Matches
              </Link>
              <Link
                href="/mapa"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Mapa de Pisos
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-sm">
                  Inicio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Encuentra tu compañero ideal</h1>
            <p className="text-muted-foreground text-lg">
              Descubre personas compatibles y conecta con tu match perfecto
            </p>
          </div>

          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <div className="flex gap-2">
              <Button
                variant={vistaActual === "descubrir" ? "default" : "outline"}
                onClick={() => setVistaActual("descubrir")}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Descubrir
              </Button>
              <Button
                variant={vistaActual === "matches" ? "default" : "outline"}
                onClick={() => setVistaActual("matches")}
                className="gap-2"
              >
                <Heart className="w-4 h-4" />
                Mis Matches
                {matches.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {matches.length}
                  </Badge>
                )}
              </Button>
            </div>

            {vistaActual === "matches" && (
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar matches..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
          </div>

          {vistaActual === "descubrir" ? (
            <>
              {availableUsers.length === 0 ? (
                <div className="text-center py-16">
                  <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No hay más perfiles disponibles</h3>
                  <p className="text-muted-foreground mb-6">
                    Has visto todos los perfiles disponibles. Vuelve más tarde para ver nuevos usuarios.
                  </p>
                  <Button onClick={() => setVistaActual("matches")}>
                    <Heart className="w-4 h-4 mr-2" />
                    Ver mis matches
                  </Button>
                </div>
              ) : (
                <div className="lg:flex lg:items-start lg:gap-8">
                  <div className="lg:flex-1">
                    <div className="max-w-3xl mx-auto">
                      <Card className="shadow-lg border-0 overflow-visible rounded-lg">
                        <div className="relative">
                          {currentUser?.foto_perfil ? (
                            <img
                              src={currentUser.foto_perfil}
                              alt={currentUser?.nombre || "Perfil"}
                              className="w-full h-[300px] md:h-[340px] object-cover bg-gray-100 rounded-t-md"
                            />
                          ) : (
                            <div className="w-full h-[300px] md:h-[340px] bg-gray-100 rounded-t-md flex items-center justify-center">
                              <div className="text-gray-300 flex flex-col items-center">
                                {/* High-quality SVG placeholder */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-20 h-20">
                                  <path strokeWidth="1.5" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                                  <path strokeWidth="1.5" d="M6 20c0-2.21 3.582-4 6-4s6 1.79 6 4" />
                                </svg>
                                <p className="mt-3 text-gray-500">Foto no disponible</p>
                              </div>
                            </div>
                          )}

                          <div className="absolute inset-x-4 top-4 flex justify-end">
                            <Badge className="bg-green-600 text-white text-sm px-3 py-1.5 rounded-full">
                              {calculateCompatibility(currentUser)}% compatible
                            </Badge>
                          </div>

                          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent rounded-b-md flex items-end z-10">
                            <div className="p-4 text-white">
                              <h2 className="text-2xl font-bold">{currentUser?.nombre || "—"}, {currentUser?.edad || ""}</h2>
                              <p className="text-sm opacity-90 mb-1">{currentUser?.carrera || ""} • {currentUser?.zona_preferida || ""}</p>
                            </div>
                          </div>

                          {/* Absolute action buttons inside image container so they're always visible */}
                          <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-30">
                            <Button
                              onClick={handlePass}
                              size="lg"
                              variant="outline"
                              className="w-14 h-14 rounded-full p-0 border-2 hover:border-destructive hover:bg-destructive/10 bg-white shadow-lg ring-1 ring-white"
                            >
                              <X className="w-7 h-7 text-destructive" />
                            </Button>
                          </div>

                          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-30">
                            <Button
                              onClick={handleLike}
                              size="lg"
                              className="w-14 h-14 rounded-full p-0 bg-accent hover:bg-accent/95 shadow-lg ring-1 ring-white"
                            >
                              <Heart className="w-7 h-7 text-white" />
                            </Button>
                          </div>


                          {/* action buttons removed from overlay to avoid covering content */}
                        </div>

                        <CardContent className="p-6 md:p-8">
                          <p className="text-foreground leading-relaxed mb-4">{currentUser?.bio || "Sin descripción"}</p>

                          <div className="flex flex-wrap gap-3 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Horario:</span>
                              <span className="font-medium">{currentUser?.horario || "No especificado"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Limpieza:</span>
                              <span className="font-medium">{currentUser?.nivel_limpieza || "No especificado"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Euro className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Presupuesto:</span>
                              <span className="font-medium">{currentUser?.presupuesto_max || 0}€/mes</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {(currentUser?.intereses ?? []).slice(0, 8).map((interes) => (
                              <Badge key={interes} variant="secondary" className="text-sm">
                                {interes}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>

                        {/* Actions below the card so they never cover the overlay */}
                        

                      </Card>
                    </div>
                  </div>

                  <aside className="mt-8 lg:mt-0 lg:w-80">
                    <Card className="p-4 mb-6">
                      <h3 className="font-semibold text-lg mb-3">Próximos perfiles</h3>
                      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                        {usuariosPotenciales
                          .filter((u) => u.id !== currentUserId)
                          .map((usuario) => (
                            <div key={usuario.id} className="w-32 flex-shrink-0">
                              <div className="h-20 w-32 rounded-md overflow-hidden mb-2 bg-gray-100 flex items-center justify-center">
                                {usuario.foto_perfil ? (
                                  <img src={usuario.foto_perfil} alt={usuario.nombre} className="w-full h-full object-cover" />
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10 text-gray-300">
                                    <path strokeWidth="1.5" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                                    <path strokeWidth="1.5" d="M6 20c0-2.21 3.582-4 6-4s6 1.79 6 4" />
                                  </svg>
                                )}
                              </div>
                              <p className="text-sm font-medium truncate">{usuario.nombre}</p>
                              <p className="text-xs text-muted-foreground truncate">{usuario.carrera}</p>
                            </div>
                          ))}
                      </div>
                    </Card>

                    <Card className="p-4 bg-primary text-primary-foreground">
                      <h3 className="font-semibold text-lg mb-2">Consejo del día</h3>
                      <p className="text-sm opacity-90">Los perfiles con mayor compatibilidad comparten tus preferencias de horario y limpieza.</p>
                    </Card>
                  </aside>
                </div>
              )}
            </>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchesFiltrados.map((match) => (
                <Card key={match.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={match.foto_perfil || "/placeholder.svg?height=200&width=400"}
                      alt={match.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-xl mb-1">
                        {match.nombre}, {match.edad}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {match.carrera} • {match.zona}
                      </p>
                    </div>

                    <div className="mb-4 p-3 bg-secondary rounded-lg">
                      <p className="text-sm text-foreground">¡Es un match! Empezad a chatear</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(match.created_at).toLocaleDateString("es-ES")}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Link href="/chat" className="flex-1">
                        <Button size="sm" className="w-full">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" onClick={() => router.push("/valoraciones")}>
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {matchesFiltrados.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {busqueda ? "No se encontraron matches" : "Aún no tienes matches"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {busqueda
                      ? "Intenta con otra búsqueda"
                      : "Sigue descubriendo personas para encontrar tu compañero ideal"}
                  </p>
                  {!busqueda && (
                    <Button onClick={() => setVistaActual("descubrir")}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Descubrir personas
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {newMatchData && (
        <MatchModal
          isOpen={showMatchModal}
          onClose={() => setShowMatchModal(false)}
          matchName={newMatchData.name}
          matchImage={newMatchData.image}
        />
      )}
    </div>
  )
}
