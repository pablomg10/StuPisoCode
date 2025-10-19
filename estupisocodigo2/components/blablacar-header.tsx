"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, User, Menu, X, MessageCircle, Building } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import VerifiedPill from "@/components/verified-pill"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function BlaBlaCarHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userType, setUserType] = useState<string | null>(null)
  const [userRoles, setUserRoles] = useState<string[] | null>(null)
  const [user, setUser] = useState<any | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [isPropietarioLocal, setIsPropietarioLocal] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setIsAuthenticated(true)
        setUser(user)
        const roles: string[] = user.user_metadata?.roles || []
        setUserRoles(roles)
        setUserType(roles.includes("propietario") ? "propietario" : roles.includes("estudiante") ? "estudiante" : null)
      }
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true)
        setUser(session.user)
        const roles: string[] = session.user.user_metadata?.roles || []
        setUserRoles(roles)
        setUserType(roles.includes("propietario") ? "propietario" : roles.includes("estudiante") ? "estudiante" : null)
      } else {
        setIsAuthenticated(false)
        setUser(null)
        setUserType(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // check localStorage fallback for propietario flag
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsPropietarioLocal(localStorage.getItem("is_propietario") === "true")
    }
  }, [])

  const handlePublishClick = (e: React.MouseEvent) => {
    // For best UX: always lead to the publish flow. The publish page will handle auth/host checks and fallbacks.
    e.preventDefault()
    // If the user is already verified (stored in localStorage or will be checked server-side) go to publicar,
    // otherwise lead them to the verification flow on the home page.
    try {
      const isVerified = typeof window !== "undefined" && localStorage.getItem("is_propietario") === "true"
      if (isVerified) {
        window.location.href = "/publicar"
      } else {
        // open verification wizard on home
        window.location.href = "/?verify=1"
      }
    } catch (e) {
      window.location.href = "/publicar"
    }
  }

  const handleLoginClick = () => {
    window.location.href = "/login"
  }

  const handleRegisterClick = () => {
    window.location.href = "/registro"
  }

  return (
    <>
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            {/* Global logo: larger but responsive */}
            <Link href="/" className="relative flex items-center hover:opacity-95 transition-opacity">
              {/* reserve a fixed width so nav spacing doesn't change; image is positioned absolutely and centered vertically */}
              <div className="w-28 md:w-40 lg:w-52 h-12 md:h-14 lg:h-16 relative overflow-visible">
                <Image src="/logo.png" alt="EsTuPiso" width={520} height={160} className="absolute left-0 top-1/2 -translate-y-1/2 h-28 md:h-40 lg:h-52 w-auto" priority />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/pisos" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Pisos compartidos
              </Link>
              <Link href="/mapa" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Mapa
              </Link>
              <Link href="/matches" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Matches
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  {(userRoles || []).includes("propietario") || isPropietarioLocal ? (
                    <VerifiedPill size="sm" label="Propietario verificado" variant="white" />
                  ) : (
                    <Button variant="ghost" className="text-[var(--verify-blue)] hover:bg-[rgba(10,116,255,0.06)]" onClick={() => (window.location.href = '/?verify=1')}>
                      Verificarse
                    </Button>
                  )}

                  {(userRoles || []).includes("estudiante") && (
                    <Badge variant="outline" className="flex items-center gap-2">
                      <User className="w-3 h-3" /> Estudiante
                    </Badge>
                  )}
                </div>
              )}

              <Link href="/pisos">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
              </Link>

              <div onClick={handlePublishClick}>
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium">
                  <Plus className="w-4 h-4 mr-2" />
                  Publicar un piso
                </Button>
              </div>

              {isAuthenticated ? (
                <>
                  <Link href="/chat">
                    <Button variant="ghost" size="icon" className="rounded-full relative">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                    </Button>
                  </Link>
                    <Link href="/perfil">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="w-5 h-5 text-blue-600" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                    onClick={handleLoginClick}
                  >
                    Iniciar sesión
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    onClick={handleRegisterClick}
                  >
                    Registrarse
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t py-4 space-y-3">
              {isAuthenticated && userRoles && (
                <div className="px-2 pb-3 flex gap-2">
                  {userRoles.includes("propietario") && (
                    <Badge variant="outline" className="flex items-center gap-2 w-fit">
                      <Building className="w-3 h-3" /> Propietario
                    </Badge>
                  )}
                  {userRoles.includes("estudiante") && (
                    <Badge variant="outline" className="flex items-center gap-2 w-fit">
                      <User className="w-3 h-3" /> Estudiante
                    </Badge>
                  )}
                </div>
              )}

              <Link
                href="/pisos"
                className="block text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pisos compartidos
              </Link>
              <Link
                href="/mapa"
                className="block text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mapa
              </Link>
              <Link
                href="/matches"
                className="block text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Matches
              </Link>
              <div className="border-t pt-3 mt-3 space-y-2">
                <Link href="/pisos" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-blue-600">
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </Link>

                <div
                  onClick={(e) => {
                    handlePublishClick(e)
                    setMobileMenuOpen(false)
                  }}
                >
                  <Button variant="ghost" className="w-full justify-start text-blue-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Publicar un piso
                  </Button>
                </div>

                {isAuthenticated ? (
                  <>
                    <Link href="/chat" className="block" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-blue-600">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                    </Link>
                    <Link href="/perfil" className="block" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Mi perfil
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => {
                        handleLoginClick()
                        setMobileMenuOpen(false)
                      }}
                    >
                      Iniciar sesión
                    </Button>
                    <Button
                      className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        handleRegisterClick()
                        setMobileMenuOpen(false)
                      }}
                    >
                      Registrarse
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Publicar un piso</DialogTitle>
            <DialogDescription className="text-base pt-4">
                Para publicar un piso necesitas activar la funcionalidad de anfitrión en tu perfil. Esto no crea una cuenta nueva; es una opción de tu cuenta actual.
              </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            <div className="space-y-2">
              <p className="text-sm">Activa la funcionalidad de anfitrión en tu perfil para publicar pisos. Si no estás registrado, crea una cuenta primero.</p>
              <Link href="/registro" onClick={() => setShowRoleDialog(false)}>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Crear cuenta</Button>
              </Link>
            </div>
            <Button variant="ghost" className="w-full" onClick={() => setShowRoleDialog(false)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
