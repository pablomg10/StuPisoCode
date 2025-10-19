"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Eye, EyeOff, Building } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

export default function RegistroPropietarioPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    tipoPropiedad: "",
    experiencia: "",
    aceptaTerminos: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (!formData.aceptaTerminos) {
      setError("Debes aceptar los términos y condiciones")
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/propietario/dashboard`,
          data: {
            nombre: formData.nombre,
            telefono: formData.telefono,
            tipo_propiedad: formData.tipoPropiedad,
            experiencia: formData.experiencia,
            tipo_usuario: "propietario",
          },
        },
      })

      if (signUpError) throw signUpError

      alert("¡Registro exitoso! Por favor, revisa tu email para confirmar tu cuenta.")
      router.push("/propietario/login")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al registrarse")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
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
                <div className="w-28 md:w-40 lg:w-52 h-12 md:h-14 lg:h-16 relative overflow-visible">
                  <Image src="/logo.png" alt="EsTuPiso" width={520} height={160} className="absolute left-0 top-1/2 -translate-y-1/2 h-28 md:h-40 lg:h-52 w-auto" priority />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-elegant">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-serif">Registro de Propietario</CardTitle>
              <CardDescription className="text-base">Encuentra el inquilino perfecto para tu piso</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="+34 123 456 789"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoPropiedad">Tipo de propiedad</Label>
                    <Select
                      value={formData.tipoPropiedad}
                      onValueChange={(value) => setFormData({ ...formData, tipoPropiedad: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="piso">Piso</SelectItem>
                        <SelectItem value="estudio">Estudio</SelectItem>
                        <SelectItem value="habitacion">Habitación</SelectItem>
                        <SelectItem value="casa">Casa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experiencia">Experiencia</Label>
                    <Select
                      value={formData.experiencia}
                      onValueChange={(value) => setFormData({ ...formData, experiencia: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primera-vez">Primera vez</SelectItem>
                        <SelectItem value="poca">Poca experiencia</SelectItem>
                        <SelectItem value="mucha">Mucha experiencia</SelectItem>
                        <SelectItem value="profesional">Profesional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                      minLength={6}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Repite tu contraseña"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="bg-primary/5 p-6 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-3">¿Por qué EsTuPiso para propietarios?</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Encuentra inquilinos compatibles con tus preferencias</li>
                    <li>• Sistema de matching inteligente</li>
                    <li>• Verificación de perfiles de estudiantes</li>
                    <li>• Gestión simplificada de solicitudes</li>
                  </ul>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terminos"
                    checked={formData.aceptaTerminos}
                    onCheckedChange={(checked) => setFormData({ ...formData, aceptaTerminos: checked as boolean })}
                  />
                  <Label htmlFor="terminos" className="text-sm">
                    Acepto los{" "}
                    <Link href="#" className="text-primary hover:underline font-medium">
                      términos y condiciones
                    </Link>{" "}
                    para propietarios
                  </Label>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? "Creando cuenta..." : "Crear Cuenta de Propietario"}
                </Button>
              </form>

              <div className="mt-8 text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  ¿Ya tienes cuenta?{" "}
                  <Link href="/propietario/login" className="text-primary hover:underline font-medium">
                    Inicia sesión aquí
                  </Link>
                </p>
                <p className="text-sm text-muted-foreground">
                  ¿Eres estudiante?{" "}
                  <Link href="/registro" className="text-primary hover:underline font-medium">
                    Regístrate como estudiante
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
