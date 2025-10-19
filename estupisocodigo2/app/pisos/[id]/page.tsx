"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Home, MapPin, Bed, Bath, Maximize, Calendar, MessageCircle, ArrowLeft, Mail, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
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
  postal_code?: string
  price_monthly: number
  bedrooms: number
  bathrooms: number
  size_sqm: number
  available_from?: string
  images: string[]
  amenities: string[]
  active: boolean
  owner_id: string
  created_at: string
}

type Profile = {
  id: string
  nombre: string
  email: string
  foto_perfil?: string
  bio?: string
  universidad?: string
  carrera?: string
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [owner, setOwner] = useState<Profile | null>(null)
  const [tenants, setTenants] = useState<Profile[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    loadCurrentUser()
    loadPropertyDetails()
  }, [params.id])

  const loadCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      setCurrentUser(profile)
    }
  }

  const loadPropertyDetails = async () => {
    try {
      // Load property
      const { data: propertyData, error: propertyError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", params.id)
        .single()

      if (propertyError) throw propertyError

      if (propertyData) {
        setProperty(propertyData)

        // Load owner profile
        if (propertyData.owner_id) {
          const { data: ownerData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", propertyData.owner_id)
            .single()

          if (ownerData) {
            setOwner(ownerData)
          }
        }

        // Load tenants (users who have matched with this property or are living here)
        // For now, we'll check matches table to find potential tenants
        const { data: matchesData } = await supabase
          .from("matches")
          .select("user1_id, user2_id")
          .or(`user1_id.eq.${propertyData.owner_id},user2_id.eq.${propertyData.owner_id}`)
          .eq("status", "accepted")

        if (matchesData && matchesData.length > 0) {
          const tenantIds = matchesData
            .map((match) => (match.user1_id === propertyData.owner_id ? match.user2_id : match.user1_id))
            .filter((id) => id !== propertyData.owner_id)

          if (tenantIds.length > 0) {
            const { data: tenantsData } = await supabase.from("profiles").select("*").in("id", tenantIds)

            if (tenantsData) {
              setTenants(tenantsData)
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading property details:", error)
      toast.error("Error al cargar los detalles del piso")
    } finally {
      setLoading(false)
    }
  }

  const handleChatWithUser = (userId: string, userName: string) => {
    if (!currentUser) {
      toast.error("Debes iniciar sesión para chatear")
      router.push("/login")
      return
    }
    router.push(`/chat?user=${userId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando detalles del piso...</p>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Piso no encontrado</h2>
          <p className="text-muted-foreground mb-4">El piso que buscas no existe o ha sido eliminado</p>
          <Link href="/pisos">
            <Button>Volver al listado</Button>
          </Link>
        </div>
      </div>
    )
  }

  const images =
    property.images && property.images.length > 0 ? property.images : ["/placeholder.svg?height=600&width=800"]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/pisos">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-xl font-serif font-bold line-clamp-1">{property.title}</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative h-96 bg-muted">
                  <img
                    src={images[selectedImage] || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground text-lg px-4 py-2">
                    {property.price_monthly}€/mes
                  </Badge>
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === idx ? "border-primary" : "border-transparent"
                        }`}
                      >
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`Vista ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Detalles del Piso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{property.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {property.city}
                      {property.postal_code && `, ${property.postal_code}`}
                    </p>
                  </div>
                </div>

                  {/* Map */}
                  {property.latitude && property.longitude && (
                    <div className="mt-4">
                      <LeafletMap markers={[{ lat: Number(property.latitude), lng: Number(property.longitude), price: property.price_monthly, title: property.title }]} zoom={15} height="280px" />
                    </div>
                  )}

                <Separator />

                {/* Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Habitaciones</p>
                      <p className="font-medium">{property.bedrooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Baños</p>
                      <p className="font-medium">{property.bathrooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Superficie</p>
                      <p className="font-medium">{property.size_sqm}m²</p>
                    </div>
                  </div>
                  {property.available_from && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Disponible</p>
                        <p className="font-medium">{new Date(property.available_from).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Descripción</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description || "Sin descripción disponible"}
                  </p>
                </div>

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">Comodidades</h3>
                      <div className="flex flex-wrap gap-2">
                        {property.amenities.map((amenity, idx) => (
                          <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Card */}
            {owner && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-serif">Propietario</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={owner.foto_perfil || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg">{owner.nombre?.[0] || "P"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{owner.nombre || "Propietario"}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{owner.email}</span>
                      </div>
                    </div>
                  </div>

                  {owner.bio && <p className="text-sm text-muted-foreground leading-relaxed">{owner.bio}</p>}

                  {(owner.universidad || owner.carrera) && (
                    <div className="text-sm">
                      {owner.universidad && (
                        <p className="text-muted-foreground">
                          <span className="font-medium">Universidad:</span> {owner.universidad}
                        </p>
                      )}
                      {owner.carrera && (
                        <p className="text-muted-foreground">
                          <span className="font-medium">Carrera:</span> {owner.carrera}
                        </p>
                      )}
                    </div>
                  )}

                  <Button onClick={() => handleChatWithUser(owner.id, owner.nombre)} className="w-full" size="lg">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chatear con Propietario
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Tenants Card */}
            {tenants.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-serif">Inquilinos Actuales ({tenants.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tenants.map((tenant) => (
                    <div
                      key={tenant.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={tenant.foto_perfil || "/placeholder.svg"} />
                        <AvatarFallback>{tenant.nombre?.[0] || "I"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{tenant.nombre || "Inquilino"}</p>
                        {tenant.universidad && (
                          <p className="text-xs text-muted-foreground truncate">{tenant.universidad}</p>
                        )}
                      </div>
                      <Button onClick={() => handleChatWithUser(tenant.id, tenant.nombre)} size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Contact Info Card */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Home className="w-5 h-5" />
                  <p className="font-semibold">¿Interesado en este piso?</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Contacta directamente con el propietario o los inquilinos actuales para obtener más información.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
