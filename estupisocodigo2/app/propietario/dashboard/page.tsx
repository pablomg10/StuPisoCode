"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight, ChevronDown, MapPin, Users, Home, Shield, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import BlaBlaCarHeader from "@/components/blablacar-header.tsx"
import { useState } from "react"

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
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedZone, setSelectedZone] = useState("")
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [citySearch, setCitySearch] = useState("")

  const filteredCities = SPANISH_CITIES.filter((city) => city.toLowerCase().includes(citySearch.toLowerCase()))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <BlaBlaCarHeader />

      <section className="relative min-h-[650px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/coastal-road-with-apartments-and-city-view.jpg"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 gradient-hero" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12 fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight text-balance">
              Encuentra tu hogar ideal
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Pisos que se adaptan a tu presupuesto y estilo de vida
            </p>
          </div>

          <Card className="max-w-6xl mx-auto p-8 shadow-strong glass-card scale-in">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-3 relative">
                <label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Ciudad
                </label>
                <div
                  className="flex items-center gap-3 p-4 border-2 border-border rounded-xl hover:border-primary transition-smooth cursor-pointer bg-background"
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
                  <div className="absolute z-50 w-full mt-2 bg-card border-2 border-border rounded-xl shadow-strong max-h-64 overflow-y-auto">
                    {filteredCities.map((city) => (
                      <div
                        key={city}
                        className="p-4 hover:bg-secondary cursor-pointer text-foreground font-medium transition-smooth"
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
                <div className="flex items-center gap-3 p-4 border-2 border-border rounded-xl hover:border-primary transition-smooth cursor-pointer bg-background">
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
                  Fecha
                </label>
                <div className="flex items-center gap-3 p-4 border-2 border-border rounded-xl hover:border-primary transition-smooth cursor-pointer bg-background">
                  <input
                    type="date"
                    className="flex-1 outline-none text-foreground bg-transparent font-medium"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              {/* Passengers */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Personas
                </label>
                <div className="p-4 border-2 border-border rounded-xl hover:border-primary transition-smooth cursor-pointer bg-background">
                  <div className="font-semibold text-foreground">1 persona</div>
                  <div className="text-sm text-muted-foreground">Estudiante</div>
                </div>
              </div>

              {/* Search Button */}
              <div className="md:col-span-2">
                <Link href="/pisos" className="block">
                  <Button className="w-full h-[64px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl shadow-medium hover:shadow-strong transition-smooth">
                    Buscar
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-white/90 fade-in">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Verificado y seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-white" />
              <span className="font-medium">+10,000 estudiantes felices</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Mejor precio garantizado</span>
            </div>
          </div>
        </div>
      </section>

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
              <h3 className="font-bold text-lg mb-6 text-foreground">Propietarios</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="/propietario" className="hover:text-primary transition-smooth font-medium">
                    Publicar Piso
                  </Link>
                </li>
                <li>
                  <Link href="/propietario/perfil" className="hover:text-primary transition-smooth font-medium">
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
