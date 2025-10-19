"use client"

import type React from "react"

import { useState } from "react"
import SiteLogo from "@/components/site-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, EyeOff, User, Building } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { ArrowRight as ArrowRightIcon } from "lucide-react"

export default function LoginPage() {
  const [step, setStep] = useState<"login">("login")
  const [userType, setUserType] = useState<null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // No type selection - all users use the same login flow

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      // No role checks: single unified account model

      sessionStorage.setItem("justLoggedIn", "true")

      // If a 'next' param exists, return there (useful when coming from /publicar)
      try {
        const params = new URLSearchParams(window.location.search)
        const next = params.get("next")
        if (next) {
          window.location.href = next
          return
        }
      } catch (e) {
        // ignore and fallback
      }

      window.location.href = "/perfil"
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al iniciar sesión"
      setError(errorMessage)
      toast.error("Error al iniciar sesión", {
        description: errorMessage,
      })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <SiteLogo />
                <Badge
                  variant="outline"
                  className="hidden sm:inline-flex text-xs bg-secondary text-foreground border-border"
                >
                  Salamanca
                </Badge>
              </Link>
            </div>

            <Link href="/">
              <Button variant="ghost" size="sm" className="text-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto w-full px-2 sm:px-0">
          <Card className="shadow-elegant">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-serif">Iniciar Sesión</CardTitle>
              <CardDescription>Accede a tu cuenta de EsTuPiso</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Tu contraseña"
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

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  ¿No tienes cuenta?{" "}
                  <Link href="/registro" className="text-black hover:text-black font-medium">
                    Regístrate aquí
                  </Link>
                </p>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">O inicia sesión rápidamente</p>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        const supabase = createClient()
                        await supabase.auth.signInWithOAuth({ provider: "google" })
                      } catch (e) {
                        toast.error("Error al iniciar con Google")
                      }
                    }}
                    className="flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                      <path d="M533.5 278.4c0-18.6-1.6-37.2-4.8-55.2H272v104.6h147.1c-6.4 34.4-25.6 63.5-54.6 83v68h88.2c51.6-47.5 82.8-117.8 82.8-200.4z" fill="#4285F4"/>
                      <path d="M272 544.3c73.6 0 135.5-24.4 180.7-66.4l-88.2-68c-24.6 16.6-56 26.4-92.5 26.4-71 0-131.2-47.8-152.7-112.1H28.1v70.7C71.9 493 165.5 544.3 272 544.3z" fill="#34A853"/>
                      <path d="M119.3 325.8c-10.2-30.5-10.2-63.6 0-94.1V161h-91.2C7.6 208.9 0 239.6 0 272s7.6 63.1 28.1 111l91.2-57.2z" fill="#FBBC05"/>
                      <path d="M272 107.7c39.9 0 75.9 13.7 104.3 40.5l78.3-78.3C407.4 24.5 346.9 0 272 0 165.5 0 71.9 51.3 28.1 129l91.2 57.2C140.8 155.5 201 107.7 272 107.7z" fill="#EA4335"/>
                    </svg>
                    Iniciar sesión con Google
                  </Button>
                </div>
              </div>

              <div className="mt-4 text-center">
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
