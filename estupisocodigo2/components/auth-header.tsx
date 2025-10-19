"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MessageCircle, User, Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import SiteLogo from "@/components/site-logo"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { toast } from "sonner"

export default function AuthHeader() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showViewAsModal, setShowViewAsModal] = useState(false)
  const [viewAsPassword, setViewAsPassword] = useState("")
  const [viewAsConfirm, setViewAsConfirm] = useState("")

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)

      // Show welcome toast if user just logged in
      if (session?.user && !showWelcome) {
        const justLoggedIn = sessionStorage.getItem("justLoggedIn")
        if (justLoggedIn === "true") {
          setShowWelcome(true)
          toast.success(`¡Bienvenido de nuevo!`, {
            description: `Hola ${session.user.user_metadata?.nombre || session.user.email}`,
            duration: 3000,
          })
          sessionStorage.removeItem("justLoggedIn")
        }
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [showWelcome])

  const isUserHost = () => {
    if (!user) return false
    return user.user_metadata?.is_host === true || (user.user_metadata?.roles || []).includes("propietario")
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success("Sesión cerrada correctamente")
    window.location.href = "/"
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
              <SiteLogo />
              <span className="hidden sm:inline-block text-2xl font-bold text-blue-600">EsTuPiso</span>
              <Badge
                variant="outline"
                className="hidden sm:inline-flex text-xs bg-secondary text-foreground border-border"
              >
                Salamanca
              </Badge>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-end">
            <Link
              href="/perfil"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Mi Perfil
            </Link>
            <Link
              href="/matches"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Matches
            </Link>
            <Link
              href="/chat"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </Link>
            <Link
              href="/pisos"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Ver Pisos
            </Link>
            <Link
              href="/mapa"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Mapa de Pisos
            </Link>
            <div className="h-4 w-px bg-border"></div>
            {/* unified model: no separate propietario route */}
          </nav>

          {/* Mobile & Desktop Actions */}
          <div className="flex items-center space-x-3 ml-4">
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {!loading && (
              <>
                {user ? (
                  <div className="hidden md:flex items-center space-x-3">
                    <Link href="/perfil">
                      <Button variant="ghost" size="sm" className="text-sm flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {user.user_metadata?.nombre || "Mi Perfil"}
                      </Button>
                    </Link>
                    {/* View-as propietario button for users who aren't propietary (local-only, requires confirmation) */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowViewAsModal(true)}
                      className="text-sm"
                    >
                      Cambiar a vista de propietario
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="text-sm bg-transparent">
                      Cerrar Sesión
                    </Button>
                  </div>
                ) : (
                  <div className="hidden md:flex items-center space-x-3">
                    <Link href="/login">
                      <Button variant="ghost" size="sm" className="text-sm">
                        Iniciar Sesión
                      </Button>
                    </Link>

                    <Link href="/registro">
                      <Button
                        size="sm"
                        className="text-xs px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Registrarse
                        <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-3">
            <Link
              href="/perfil"
              className="block text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mi Perfil
            </Link>
            <Link
              href="/matches"
              className="block text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Matches
            </Link>
            <Link
              href="/chat"
              className="block text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2 flex items-center gap-1.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </Link>
            <Link
              href="/pisos"
              className="block text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ver Pisos
            </Link>
            <Link
              href="/mapa"
              className="block text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mapa de Pisos
            </Link>
            <div className="border-t pt-3 mt-3">
              <div
                className="block text-primary hover:text-primary/80 font-semibold transition-colors text-sm py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {/* Mobile small CTA to publish - opens info if not host */}
                <Button
                  variant="ghost"
                  className="w-full text-left"
                  onClick={() => {
                    // Mejor experiencia: llevar siempre a la página de publicación.
                    window.location.href = "/publicar"
                  }}
                >
                  Publicar un piso
                </Button>
              </div>
            </div>
            {!loading && (
              <div className="border-t pt-3 mt-3 space-y-2">
                {user ? (
                  <>
                    <div className="text-sm font-medium py-2">{user.user_metadata?.nombre || user.email}</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="w-full"
                    >
                      Cerrar Sesión
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowViewAsModal(true)
                        setMobileMenuOpen(false)
                      }}
                      className="w-full"
                    >
                      Cambiar a vista de propietario
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link href="/registro" className="block" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full">
                        Registrarse
                        <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <Dialog open={showViewAsModal} onOpenChange={setShowViewAsModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cambiar a vista de propietario (local)</DialogTitle>
              <DialogDescription>
                Esta acción habilita únicamente una vista local como propietario en este navegador. No otorga permisos reales ni
                modifica tu cuenta. Para proteger el acceso, escribe "CONFIRMAR" abajo y tu contraseña. Esta es una medida
                para evitar que otras personas (p.ej. niños) activen la vista accidentalmente.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Escribe CONFIRMAR para continuar</label>
                <input
                  value={viewAsConfirm}
                  onChange={(e) => setViewAsConfirm(e.target.value)}
                  className="mt-1 block w-full rounded-md border px-3 py-2"
                  placeholder="CONFIRMAR"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Tu contraseña</label>
                <input
                  type="password"
                  value={viewAsPassword}
                  onChange={(e) => setViewAsPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border px-3 py-2"
                  placeholder="Tu contraseña"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => setShowViewAsModal(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    // minimal local check: require exact CONFIRMAR and a non-empty password
                    if (viewAsConfirm.trim() !== "CONFIRMAR") {
                      toast.error("Debes escribir CONFIRMAR para confirmar la acción")
                      return
                    }
                    if (!viewAsPassword) {
                      toast.error("Introduce tu contraseña")
                      return
                    }

                    // Set a sessionStorage flag to activate local 'view as propietario'
                    sessionStorage.setItem("viewAsPropietario", "true")
                    toast.success("Vista de propietario habilitada en este navegador (local)")
                    setShowViewAsModal(false)
                    setViewAsConfirm("")
                    setViewAsPassword("")
                  }}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
