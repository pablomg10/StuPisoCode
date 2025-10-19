"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AvatarUsuarioProps {
  nombre: string
  imagen?: string
  size?: "sm" | "md" | "lg" | "xl"
  online?: boolean
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
}

// Función para generar avatares consistentes basados en el nombre
const getAvatarUrl = (nombre: string) => {
  const colors = [
    "FF6B6B", // Rosa
    "4ECDC4", // Turquesa
    "45B7D1", // Azul
    "96CEB4", // Verde
    "FFEAA7", // Amarillo
    "DDA0DD", // Púrpura
    "98D8C8", // Verde agua
    "F7DC6F", // Dorado
  ]

  const backgrounds = [
    "2C3E50", // Azul oscuro
    "8E44AD", // Púrpura
    "2980B9", // Azul
    "27AE60", // Verde
    "F39C12", // Naranja
    "E74C3C", // Rojo
    "34495E", // Gris azulado
    "16A085", // Verde azulado
  ]

  const colorIndex = nombre.charCodeAt(0) % colors.length
  const bgIndex = (nombre.charCodeAt(0) + nombre.length) % backgrounds.length

  const initials = nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${backgrounds[bgIndex]}&color=${colors[colorIndex]}&size=200&bold=true`
}

export default function AvatarUsuario({ nombre, imagen, size = "md", online = false }: AvatarUsuarioProps) {
  const avatarUrl = imagen || getAvatarUrl(nombre)

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={nombre} />
        <AvatarFallback>
          {nombre
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {online && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
      )}
    </div>
  )
}
