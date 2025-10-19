"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, MapPin, Bed, Bath, Search, MessageCircle, Filter } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

const LeafletMap = dynamic(() => import("@/components/leaflet-map"), { ssr: false })

type Property = {
  id: string
  title: string
  description: string
  address: string
  city: string
  latitude?: number | null
  longitude?: number | null
  price_monthly: number
  bedrooms: number
  bathrooms: number
  size_sqm: number
  images: string[]
  amenities: string[]
  active: boolean
  owner_id: string
  owner?: {
    id: string
    nombre: string
    email: string
    foto_perfil?: string
  }
  tenants?: Array<{
    id: string
    nombre: string
    email: string
    foto_perfil?: string
  }>
}

export default function PisosPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")
  const [bedroomsFilter, setBedroomsFilter] = useState("all")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Read URL filters
  const urlCity = searchParams?.get("city") || ""
  const urlZone = searchParams?.get("zone") || ""
  const urlStreet = searchParams?.get("street") || ""

  useEffect(() => {
    loadCurrentUser()
    loadProperties({ city: urlCity })
  }, [])

  useEffect(() => {
    filterProperties()
  }, [properties, searchQuery, priceFilter, bedroomsFilter])

  const loadCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      setCurrentUser(profile)
    }
  }

  type LoadOptions = { city?: string }

  const loadProperties = async (opts?: LoadOptions) => {
    try {
      // If a city is provided in the URL, request only properties in that city from Supabase
      let query = supabase.from("properties").select("*").eq("active", true).order("created_at", { ascending: false })
      if (opts?.city) {
        // Prefer exact match on city to avoid returning all properties
        query = query.eq("city", opts.city)
      }

      const { data: propertiesData, error } = await query

      if (error) throw error

      if (propertiesData) {
        // Load owner profiles for each property
        const propertiesWithOwners = await Promise.all(
          propertiesData.map(async (property) => {
            if (property.owner_id) {
              const { data: owner } = await supabase
                .from("profiles")
                .select("id, nombre, email, foto_perfil")
                .eq("id", property.owner_id)
                .single()

              return { ...property, owner }
            }
            return property
          }),
        )

        setProperties(propertiesWithOwners)
      }
    } catch (error) {
      console.error("Error loading properties:", error)
      toast.error("Error al cargar los pisos")
    } finally {
      setLoading(false)
    }
  }

  const filterProperties = () => {
    let filtered = [...properties]

    // Apply URL filters (city/zone/street) if present
    if (urlCity) {
      filtered = filtered.filter((p) => p.city.toLowerCase() === urlCity.toLowerCase())
    }
    if (urlZone) {
      filtered = filtered.filter((p) => p.address.toLowerCase().includes(urlZone.toLowerCase()) || p.city.toLowerCase().includes(urlZone.toLowerCase()))
    }

    // Search filter (searchQuery still supported)
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.city.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Price filter
    if (priceFilter !== "all") {
      const [min, max] = priceFilter.split("-").map(Number)
      filtered = filtered.filter((property) => {
        if (max) {
          return property.price_monthly >= min && property.price_monthly <= max
        }
        return property.price_monthly >= min
      })
    }

    // Bedrooms filter
    if (bedroomsFilter !== "all") {
      const beds = Number(bedroomsFilter)
      filtered = filtered.filter((property) => property.bedrooms === beds)
    }

    // If a street is provided in the URL, prioritize properties that contain the street in the address
    if (urlStreet) {
      const matches = filtered.filter((p) => p.address.toLowerCase().includes(urlStreet.toLowerCase()))
      const others = filtered.filter((p) => !p.address.toLowerCase().includes(urlStreet.toLowerCase()))
      filtered = [...matches, ...others]
    }

    setFilteredProperties(filtered)
  }

  const handleChatWithOwner = (ownerId: string) => {
    if (!currentUser) {
      toast.error("Debes iniciar sesión para chatear")
      router.push("/login")
      return
    }
    // Redirect to chat with owner selected
    router.push(`/chat?user=${ownerId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando pisos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Volver
                </Button>
              </Link>
              <h1 className="text-2xl font-serif font-bold">Todos los Pisos</h1>
            </div>
            <Link href="/chat">
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Mis Chats
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Map removed from listing as requested; use /mapa for map view */}
        {/* Filters Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Filtros</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título, dirección o ciudad..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Price Filter */}
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Precio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los precios</SelectItem>
                  <SelectItem value="0-300">Hasta 300€</SelectItem>
                  <SelectItem value="300-400">300€ - 400€</SelectItem>
                  <SelectItem value="400-500">400€ - 500€</SelectItem>
                  <SelectItem value="500-99999">Más de 500€</SelectItem>
                </SelectContent>
              </Select>

              {/* Bedrooms Filter */}
              <Select value={bedroomsFilter} onValueChange={setBedroomsFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Habitaciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="1">1 habitación</SelectItem>
                  <SelectItem value="2">2 habitaciones</SelectItem>
                  <SelectItem value="3">3 habitaciones</SelectItem>
                  <SelectItem value="4">4+ habitaciones</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-muted-foreground">
              {filteredProperties.length} {filteredProperties.length === 1 ? "piso encontrado" : "pisos encontrados"}
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No se encontraron pisos</h3>
            <p className="text-muted-foreground">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Link key={property.id} href={`/pisos/${property.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                  {/* Property Image */}
                  <div className="relative h-48 bg-muted">
                    <img
                      src={
                        property.images && property.images.length > 0
                          ? property.images[0]
                          : "/placeholder.svg?height=200&width=400"
                      }
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                      {property.price_monthly}€/mes
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    {/* Title and Address */}
                    <h3 className="font-serif text-lg font-semibold mb-2 line-clamp-1">{property.title}</h3>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">
                        {property.address}, {property.city}
                      </span>
                    </div>

                    {/* Property Details */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        <span>{property.size_sqm}m²</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {property.description || "Sin descripción disponible"}
                    </p>

                    {/* Owner Info */}
                    {property.owner && (
                      <div className="border-t pt-4">
                        <p className="text-xs text-muted-foreground mb-2">Propietario</p>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={property.owner.foto_perfil || "/placeholder.svg"} />
                            <AvatarFallback>{property.owner.nombre?.[0] || "P"}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{property.owner.nombre || "Propietario"}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
