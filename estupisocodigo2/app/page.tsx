"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight, ChevronDown, MapPin, Users, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import BlaBlaCarHeader from "@/components/blablacar-header"
import { useState } from "react"
import { useRouter } from "next/navigation"
import PropietarioVerification from "@/components/propietario-verification"
import VerifiedPill from "@/components/verified-pill"
import { createClient } from "@/lib/supabase/client"
import { useEffect } from "react"

const SPANISH_CITIES = [
  "Madrid",
  "Barcelona",
  "Valencia",
  "Sevilla",
  "Zaragoza",
  "Málaga",
  "Murcia",
  "Palma de Mallorca",
  "Las Palmas de Gran Canaria",
  "Bilbao",
  "Alicante",
  "Córdoba",
  "Valladolid",
  "Vigo",
  "Gijón",
  "L'Hospitalet de Llobregat",
  "A Coruña",
  "Vitoria-Gasteiz",
  "Granada",
  "Elche",
  "Oviedo",
  "Badalona",
  "Cartagena",
  "Terrassa",
  "Jerez de la Frontera",
  "Sabadell",
  "Santa Cruz de Tenerife",
  "Pamplona",
  "Almería",
  "Alcalá de Henares",
  "Fuenlabrada",
  "Leganés",
  "San Sebastián",
  "Getafe",
  "Burgos",
  "Santander",
  "Castellón de la Plana",
  "Albacete",
  "Alcorcón",
  "La Laguna",
  "Logroño",
  "Badajoz",
  "Salamanca",
  "Huelva",
  "Marbella",
  "Tarragona",
  "León",
  "Cádiz",
  "Dos Hermanas",
  "Lleida",
  "Mataró",
  "Torrejón de Ardoz",
  "Parla",
  "Algeciras",
  "Reus",
  "Alcobendas",
  "Ourense",
  "Telde",
  "Barakaldo",
  "Lugo",
  "Girona",
  "Santiago de Compostela",
  "Cáceres",
  "Lorca",
  "Jaén",
  "Pontevedra",
  "Toledo",
  "Guadalajara",
  "Torrevieja",
  "Palencia",
  "Zamora",
  "Chiclana de la Frontera",
  "Manresa",
  "Ciudad Real",
  "Rubí",
  "Benidorm",
  "Ponferrada",
  "Mérida",
  "Ávila",
  "Gandía",
  "Ceuta",
  "Melilla",
].sort()

export default function HomePage() {
  const router = useRouter()
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedZone, setSelectedZone] = useState("")
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [citySearch, setCitySearch] = useState("")
  const [entryDate, setEntryDate] = useState("15/10/2025")
  const [numPersons, setNumPersons] = useState(1)
  const [showPersonDropdown, setShowPersonDropdown] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [isPropietario, setIsPropietario] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const filteredCities = SPANISH_CITIES.filter((city) => city.toLowerCase().includes(citySearch.toLowerCase()))

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (selectedCity) params.append("city", selectedCity)
    if (selectedZone) params.append("zone", selectedZone)
    if (entryDate) params.append("date", entryDate)
    params.append("persons", numPersons.toString())

    router.push(`/pisos?${params.toString()}`)
  }

  useEffect(() => {
    const check = async () => {
      if (typeof window === "undefined") return
      const supabase = createClient()
      try {
        const { data } = await supabase.auth.getUser()
        if (data.user) {
          setIsAuthenticated(true)
          const roles = data.user.user_metadata?.roles || []
          if (roles.includes("propietario")) setIsPropietario(true)
          else setIsPropietario(localStorage.getItem("is_propietario") === "true")
        } else {
          setIsAuthenticated(false)
          setIsPropietario(localStorage.getItem("is_propietario") === "true")
        }
      } catch (e) {
        setIsAuthenticated(false)
        setIsPropietario(localStorage.getItem("is_propietario") === "true")
      }
    }
    check()
  }, [])

  // Open verification wizard automatically if URL contains ?verify=1
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search)
        if (params.get("verify") === "1") {
          // only open if user is authenticated and not already verified
          ;(async () => {
            try {
              const supabase = createClient()
              const { data } = await supabase.auth.getUser()
              if (data.user && localStorage.getItem("is_propietario") !== "true") {
                setShowVerification(true)
              }
            } catch (e) {
              // ignore
            }
          })()
        }
      } catch (e) {
        // ignore
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <BlaBlaCarHeader />

      {/* Hero Content - Rediseñado */}
      <section className="relative bg-gradient-to-b from-primary/10 to-transparent">
        <div
          className="relative h-[340px] md:h-[420px] overflow-hidden rounded-b-2xl"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(7, 38, 84, 0.45), rgba(7, 38, 84, 0.15)), url('/hero-spanish-city-modern.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 opacity-30 bg-gradient-to-b from-black/10 to-black/10" />
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
            <div className="text-center max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight text-balance drop-shadow-md">
                Pisos que se adaptan a tu presupuesto
              </h1>
              <p className="mt-4 text-lg md:text-xl text-white/90">Encuentra compañeros, compara opciones y ahorra tiempo en tu búsqueda.</p>
              <div className="mt-6 flex items-center justify-center gap-4">
                {isAuthenticated ? (
                  !isPropietario ? (
                    <VerifiedPill label="Verificarse" size="md" variant="white" iconPosition="left" onClick={() => setShowVerification(true)} />
                  ) : (
                    <VerifiedPill label="Propietario verificado" size="lg" variant="white" />
                  )
                ) : null}
              </div>
            </div>
          </div>

          {/* Wave SVG bottom */}
          <div className="absolute left-0 right-0 bottom-0" aria-hidden>
            <svg viewBox="0 0 1440 120" className="w-full h-20 md:h-28" preserveAspectRatio="none">
              <path d="M0,32L48,48C96,64,192,96,288,85.3C384,75,480,21,576,10.7C672,0,768,32,864,48C960,64,1056,64,1152,69.3C1248,75,1344,85,1392,90.7L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="#ffffff" />
            </svg>
          </div>
        </div>

        {/* Search form positioned overlapping the hero */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-12 relative z-30">
          <Card className="max-w-6xl mx-auto p-6 shadow-2xl bg-white/60 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-3 relative">
                <label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Ciudad
                </label>
                <div
                  className="flex items-center gap-3 p-4 h-[64px] border border-border rounded-xl hover:border-primary transition-smooth cursor-pointer bg-white/40"
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                >
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <input
                    type="text"
                    placeholder="Selecciona ciudad"
                    value={selectedCity || citySearch}
                    onChange={(e) => {
                      setCitySearch(e.target.value)
                      setShowCityDropdown(true)
                    }}
                    className="flex-1 outline-none text-foreground bg-transparent font-medium"
                  />
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </div>
                {showCityDropdown && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-border rounded-xl shadow-lg max-h-64 overflow-y-auto">
                    {filteredCities.map((city) => (
                      <div
                        key={city}
                        className="p-3 hover:bg-secondary cursor-pointer text-foreground font-medium transition-smooth"
                        onClick={() => {
                          setSelectedCity(city)
                          setCitySearch("")
                          setShowCityDropdown(false)
                        }}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Location To */}
              <div className="md:col-span-3">
                <label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-2">
                  <Home className="w-4 h-4 text-primary" />
                  Zona
                </label>
                <div className="flex items-center gap-3 p-4 h-[64px] border border-border rounded-xl hover:border-primary transition-smooth cursor-pointer bg-white/40">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <input
                    type="text"
                    placeholder="Centro, Norte, Sur..."
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="flex-1 outline-none text-foreground bg-transparent font-medium"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Fecha de entrada
                </label>
                <div className="flex items-center gap-3 p-4 h-[64px] border border-border rounded-xl hover:border-primary transition-smooth cursor-pointer bg-white/40">
                  <input
                    type="text"
                    className="flex-1 outline-none text-foreground bg-transparent font-medium"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="md:col-span-2 relative">
                <label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Personas
                </label>
                <div className="relative">
                  <div
                    className="p-4 h-[64px] flex flex-col justify-center border border-border rounded-xl hover:border-primary transition-smooth cursor-pointer bg-white/40"
                    onClick={() => setShowPersonDropdown((v) => !v)}
                  >
                    <div className="font-semibold text-foreground">
                      {numPersons} {numPersons === 1 ? "persona" : "personas"}
                    </div>
                    <div className="text-sm text-muted-foreground">Estudiante</div>
                  </div>

                  {showPersonDropdown && (
                    <div className="absolute left-0 mt-2 w-44 bg-white border border-border rounded-xl shadow-lg z-50">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <div
                          key={n}
                          className="p-3 hover:bg-secondary cursor-pointer text-foreground font-medium transition-smooth flex items-center justify-between"
                          onClick={() => {
                            setNumPersons(n)
                            setShowPersonDropdown(false)
                          }}
                        >
                          <span>{n} {n === 1 ? 'persona' : 'personas'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <Button
                  onClick={handleSearch}
                  className="w-full h-[64px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl shadow-lg transition-smooth"
                >
                  Buscar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Marketing two-column cards removed - unified experience */}

      <section className="py-12 bg-gradient-overlay">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 p-10 shadow-medium hover-lift">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <Badge className="bg-accent text-accent-foreground mb-4 px-4 py-1.5 text-sm font-semibold">
                  Promoción Especial
                </Badge>
                <h2 className="text-4xl font-bold text-foreground mb-3 text-balance">
                  ¡Consigue tu descuento del 10%!
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Cada vez que compartes piso con otros estudiantes.{" "}
                  <Link href="#" className="text-primary hover:underline font-semibold">
                    Ver condiciones →
                  </Link>
                </p>
              </div>
              <div className="hidden md:block flex-shrink-0">
                <Image
                  src="/discount-tickets-illustration-green.jpg"
                  alt="Discount"
                  width={160}
                  height={160}
                  className="drop-shadow-lg"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {showVerification && (
        <PropietarioVerification
          onVerified={() => {
            localStorage.setItem("is_propietario", "true")
            setIsPropietario(true)
            setShowVerification(false)
          }}
          onCancelled={() => setShowVerification(false)}
        />
      )}

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-4 text-balance">¿Qué tipo de alojamiento buscas?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Encuentra la opción perfecta para tu estilo de vida y presupuesto
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <Card className="p-10 hover-lift cursor-pointer bg-card border-2 border-border shadow-soft hover:border-primary transition-smooth group">
              <div className="mb-8 overflow-hidden rounded-2xl">
                <Image
                  src="/shared-apartment-illustration-blue.jpg"
                  alt="Piso compartido"
                  width={400}
                  height={240}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-4">Piso compartido</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                Comparte los gastos y vive directamente con tus compañeros ideales
              </p>
              <Link href="/pisos">
                <Button variant="ghost" className="text-primary hover:text-primary/80 p-0 h-auto font-semibold group">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-smooth">
                    <ArrowRight className="w-6 h-6 text-primary-foreground" />
                  </div>
                </Button>
              </Link>
            </Card>

            {/* Card 2 */}
            <Card className="p-10 hover-lift cursor-pointer bg-card border-2 border-border shadow-soft hover:border-primary transition-smooth group">
              <div className="mb-8 overflow-hidden rounded-2xl">
                <Image
                  src="/studio-apartment-illustration-blue.jpg"
                  alt="Estudio"
                  width={400}
                  height={240}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-4">Estudio individual</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                Explora miles de estudios en toda España con precios increíbles
              </p>
              <Link href="/pisos">
                <Button variant="ghost" className="text-primary hover:text-primary/80 p-0 h-auto font-semibold group">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-smooth">
                    <ArrowRight className="w-6 h-6 text-primary-foreground" />
                  </div>
                </Button>
              </Link>
            </Card>

            {/* Card 3 */}
            <Card className="p-10 hover-lift cursor-pointer bg-card border-2 border-border shadow-soft hover:border-primary transition-smooth group">
              <div className="mb-8 overflow-hidden rounded-2xl">
                <Image
                  src="/residence-building-illustration-blue.jpg"
                  alt="Residencia"
                  width={400}
                  height={240}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-4">Residencia</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                Tu próxima residencia universitaria sin coste adicional
              </p>
              <Link href="/pisos">
                <Button variant="ghost" className="text-primary hover:text-primary/80 p-0 h-auto font-semibold group">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-smooth">
                    <ArrowRight className="w-6 h-6 text-primary-foreground" />
                  </div>
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-secondary py-16 border-t-2 border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="font-bold text-lg mb-6 text-foreground">Estudiantes</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="/perfil" className="hover:text-primary transition-smooth font-medium">
                    Crear Perfil
                  </Link>
                </li>
                <li>
                  <Link href="/matches" className="hover:text-primary transition-smooth font-medium">
                    Ver Matches
                  </Link>
                </li>
                <li>
                  <Link href="/mapa" className="hover:text-primary transition-smooth font-medium">
                    Mapa de Pisos
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 text-foreground">Anfitriones</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="/publicar" className="hover:text-primary transition-smooth font-medium">
                    Publicar Piso
                  </Link>
                </li>
                <li>
                  <Link href="/perfil" className="hover:text-primary transition-smooth font-medium">
                    Panel de Control
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 text-foreground">Sobre nosotros</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary transition-smooth font-medium">
                    Cómo funciona
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-smooth font-medium">
                    Ayuda
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 text-foreground">Contacto</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="font-medium">info@estupiso.com</li>
                <li className="font-medium">+34 900 123 456</li>
              </ul>
            </div>
          </div>

          <div className="border-t-2 border-border pt-8 text-center text-muted-foreground">
            <p className="font-medium">© {new Date().getFullYear()} EsTuPiso. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
