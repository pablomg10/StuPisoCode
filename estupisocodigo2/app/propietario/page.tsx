import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Euro,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Shield,
  Clock,
  Star,
  MessageSquare,
  BarChart3,
  Users,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import SiteLogo from "@/components/site-logo"

export default function PropietarioPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <SiteLogo />
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                  Propietarios
                </Badge>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/propietario/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Mi Dashboard
              </Link>
              <Link
                href="/propietario/matches"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Solicitudes
              </Link>
              <Link
                href="/mapa"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Ver Mapa
              </Link>
              <div className="h-4 w-px bg-border"></div>
              <Link href="/" className="text-primary hover:text-primary/80 font-semibold transition-colors text-sm">
                Para Estudiantes
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              <Link href="/propietario/login" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="text-sm">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/propietario/registro">
                <Button size="sm" className="text-xs px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <span className="hidden sm:inline">Publicar Piso</span>
                  <span className="sm:hidden">Publicar</span>
                  <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 lg:py-32 gradient-elegant">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 fade-in">
              <div className="space-y-6">
                <Badge variant="outline" className="w-fit bg-primary/10 text-primary border-primary/20">
                  🏠 Para Propietarios en Salamanca
                </Badge>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold leading-tight text-foreground">
                  <span>Alquila tu piso a</span>
                  <br />
                  <span className="text-primary">estudiantes</span>
                  <br />
                  <span>de confianza</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Conecta directamente con estudiantes verificados y maximiza la ocupación de tu propiedad con total
                  seguridad.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/propietario/registro">
                  <Button
                    size="lg"
                    className="text-base px-8 py-6 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-elegant"
                  >
                    Publicar Mi Piso
                    <Home className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/propietario/dashboard">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-base px-8 py-6 w-full sm:w-auto border-border hover:bg-secondary bg-transparent"
                  >
                    Ver Mi Dashboard
                    <BarChart3 className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Sin comisiones ocultas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Estudiantes verificados</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-3xl opacity-30"></div>
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center"
                alt="Propietario mostrando apartamento moderno"
                width={800}
                height={600}
                className="relative rounded-2xl shadow-elegant object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-5xl font-serif font-bold text-foreground text-balance">
              ¿Por qué elegir <span className="text-primary">EsTuPiso</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              La plataforma más eficiente para propietarios inteligentes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <Card className="border-0 shadow-elegant hover-lift text-center p-10 bg-white">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <TrendingUp className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl font-serif mb-4">Mayor Rentabilidad</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Accede a estudiantes con presupuestos verificados y reduce los períodos de vacancia.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-elegant hover-lift text-center p-10 bg-white">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-serif mb-4">Inquilinos Verificados</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Todos los estudiantes pasan por un proceso de verificación académica y personal.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-elegant hover-lift text-center p-10 bg-white">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <Clock className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl font-serif mb-4">Gestión Simplificada</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Panel de control intuitivo para gestionar solicitudes, mensajes y documentación.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-elegant hover-lift text-center p-10 bg-white">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <Euro className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-serif mb-4">Sin Comisiones</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Conecta directamente con inquilinos sin intermediarios ni comisiones adicionales.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-elegant hover-lift text-center p-10 bg-white">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <MessageSquare className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl font-serif mb-4">Comunicación Directa</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Chat integrado para comunicarte directamente con candidatos interesados.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-elegant hover-lift text-center p-10 bg-white">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-serif mb-4">Comunidad Activa</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Accede a una base de datos de más de 500 estudiantes activos buscando piso.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 gradient-elegant">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-5xl font-serif font-bold text-foreground text-balance">¿Cómo funciona?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tres pasos simples para empezar a recibir solicitudes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <Card className="border-0 shadow-elegant text-center p-10 bg-white">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <span className="text-2xl font-bold text-primary-foreground">1</span>
                </div>
                <CardTitle className="text-2xl font-serif mb-4">Publica tu piso</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Crea un anuncio completo con fotos, descripción, precio y características de tu propiedad.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-elegant text-center p-10 bg-white">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <CardTitle className="text-2xl font-serif mb-4">Recibe solicitudes</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Los estudiantes interesados te contactarán directamente a través de la plataforma.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-elegant text-center p-10 bg-white">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <span className="text-2xl font-bold text-primary-foreground">3</span>
                </div>
                <CardTitle className="text-2xl font-serif mb-4">Elige inquilinos</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Revisa perfiles, chatea con candidatos y selecciona a los inquilinos ideales.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif font-bold text-foreground mb-4 text-balance">
              Resultados que <span className="text-primary">hablan por sí solos</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-12 text-center max-w-5xl mx-auto">
            <div className="space-y-3">
              <div className="text-5xl font-serif font-bold text-primary">120+</div>
              <div className="text-muted-foreground">Propietarios activos</div>
            </div>
            <div className="space-y-3">
              <div className="text-5xl font-serif font-bold text-accent">95%</div>
              <div className="text-muted-foreground">Tasa de ocupación</div>
            </div>
            <div className="space-y-3">
              <div className="text-5xl font-serif font-bold text-primary">15</div>
              <div className="text-muted-foreground">Días promedio para alquilar</div>
            </div>
            <div className="space-y-3">
              <div className="text-5xl font-serif font-bold text-accent">4.8★</div>
              <div className="text-muted-foreground">Satisfacción promedio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 gradient-elegant">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-5xl font-serif font-bold text-foreground text-balance">
              Lo que dicen nuestros propietarios
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-elegant p-8 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">MG</span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">María González</div>
                    <div className="text-sm text-muted-foreground">Propietaria desde 2023</div>
                  </div>
                </div>
                <div className="flex text-accent mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  "En solo 10 días encontré inquilinos perfectos para mi piso. Los estudiantes son muy responsables y la
                  plataforma hace todo muy fácil."
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-elegant p-8 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">JR</span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">José Rodríguez</div>
                    <div className="text-sm text-muted-foreground">Propietario desde 2022</div>
                  </div>
                </div>
                <div className="flex text-accent mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  "Tengo 3 pisos en la plataforma y todos están ocupados. El sistema de verificación me da mucha
                  tranquilidad."
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-elegant p-8 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">AL</span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Ana López</div>
                    <div className="text-sm text-muted-foreground">Propietaria desde 2023</div>
                  </div>
                </div>
                <div className="flex text-accent mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  "La mejor decisión que tomé fue usar EsTuPiso. Sin comisiones y con inquilinos de calidad.
                  ¡Recomendado 100%!"
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-10">
            <h2 className="text-5xl font-serif font-bold text-balance">¿Listo para maximizar tus ingresos?</h2>
            <p className="text-xl opacity-90 leading-relaxed">
              Únete a más de 120 propietarios que ya confían en EsTuPiso para alquilar sus propiedades.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/propietario/registro">
                <Button
                  size="lg"
                  className="text-base px-8 py-6 bg-white text-foreground hover:bg-white/90 shadow-elegant"
                >
                  Publicar Mi Piso Gratis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/propietario/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 py-6 border-white/30 text-white hover:bg-white/10 bg-transparent"
                >
                  Ver Panel de Control
                  <BarChart3 className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary py-20 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-serif font-semibold text-foreground">EsTuPiso</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                La plataforma líder para propietarios en Salamanca.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-foreground text-lg">Para Propietarios</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li>
                  <Link href="/propietario/registro" className="hover:text-accent transition-colors">
                    Publicar Piso
                  </Link>
                </li>
                <li>
                  <Link href="/propietario/dashboard" className="hover:text-accent transition-colors">
                    Panel de Control
                  </Link>
                </li>
                <li>
                  <Link href="/propietario/matches" className="hover:text-accent transition-colors">
                    Solicitudes
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-foreground text-lg">Para Estudiantes</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-accent transition-colors">
                    Buscar Piso
                  </Link>
                </li>
                <li>
                  <Link href="/perfil" className="hover:text-accent transition-colors">
                    Crear Perfil
                  </Link>
                </li>
                <li>
                  <Link href="/mapa" className="hover:text-accent transition-colors">
                    Mapa Interactivo
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-foreground text-lg">Contacto</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li>propietarios@estupiso.com</li>
                <li>+34 923 456 789</li>
                <li>Salamanca, España</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} EsTuPiso. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
