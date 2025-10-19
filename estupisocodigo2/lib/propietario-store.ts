"use client"

// Store para manejar pisos y matches de propietarios
export interface Match {
  id: number
  nombre: string
  edad: number
  carrera: string
  compatibilidad: number
  estado: "nuevo" | "interesante" | "mutuo" | "rechazado"
  fechaSolicitud: string
  imagen: string
  mensaje: string
  motivos: string[]
}

export interface Piso {
  id: number
  titulo: string
  direccion: string
  zona: string
  precio: number
  habitaciones: number
  banos: number
  metros: number
  descripcion: string
  servicios: string[]
  fotos: string[]
  estado: "activo" | "ocupado" | "pausado" | "borrador"
  visitas: number
  solicitudes: number
  fechaPublicacion: string
  matches: Match[]
  preferencias?: {
    generoPreferido?: string
    edadMin?: number
    edadMax?: number
    limpiezaRequerida?: string
    horarioPreferido?: string
    carrerasPreferidas?: string[]
    ingresosMinimosMes?: number
  }
}

class PropietarioStore {
  private static instance: PropietarioStore
  private pisos: Piso[] = []
  private listeners: (() => void)[] = []

  private constructor() {
    this.loadFromStorage()
    this.initializeDefaultData()
  }

  static getInstance(): PropietarioStore {
    if (!PropietarioStore.instance) {
      PropietarioStore.instance = new PropietarioStore()
    }
    return PropietarioStore.instance
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("propietario-pisos")
        if (stored) {
          this.pisos = JSON.parse(stored)
        }
      } catch (error) {
        console.error("Error loading from storage:", error)
        this.pisos = []
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("propietario-pisos", JSON.stringify(this.pisos))
        this.notifyListeners()
      } catch (error) {
        console.error("Error saving to storage:", error)
      }
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener()
      } catch (error) {
        console.error("Error in listener:", error)
      }
    })
  }

  private initializeDefaultData() {
    if (this.pisos.length === 0) {
      // Añadir algunos pisos de ejemplo
      const ejemploPiso: Piso = {
        id: 1,
        titulo: "Piso céntrico cerca de la Universidad",
        direccion: "Calle Toro, 15",
        zona: "Centro Histórico",
        precio: 350,
        habitaciones: 3,
        banos: 2,
        metros: 85,
        descripcion: "Piso luminoso y bien comunicado, perfecto para estudiantes.",
        servicios: ["wifi", "calefaccion", "lavadora"],
        fotos: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"],
        estado: "activo",
        visitas: 45,
        solicitudes: 3,
        fechaPublicacion: new Date().toISOString(),
        matches: [
          {
            id: 1,
            nombre: "María García",
            edad: 21,
            carrera: "Medicina",
            compatibilidad: 95,
            estado: "nuevo",
            fechaSolicitud: new Date().toISOString(),
            imagen: "/placeholder.svg?height=100&width=100&text=MG&bg=fce7f3&color=be185d",
            mensaje: "¡Hola! Me interesa mucho tu piso. Soy estudiante de medicina, muy responsable y ordenada.",
            motivos: ["Carrera compatible", "Edad adecuada", "Perfil ordenado"],
          },
        ],
        preferencias: {
          generoPreferido: "sin-preferencia",
          edadMin: 18,
          edadMax: 30,
          limpiezaRequerida: "ordenado",
          horarioPreferido: "normal",
          carrerasPreferidas: ["Medicina", "Derecho"],
          ingresosMinimosMes: 800,
        },
      }
      this.pisos = [ejemploPiso]
      this.saveToStorage()
    }
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  getPisos(): Piso[] {
    return [...this.pisos]
  }

  getPiso(id: number): Piso | undefined {
    return this.pisos.find((piso) => piso.id === id)
  }

  addPiso(pisoData: Omit<Piso, "id" | "visitas" | "solicitudes" | "fechaPublicacion" | "matches">): Piso {
    const nuevoPiso: Piso = {
      ...pisoData,
      id: Date.now(),
      visitas: 0,
      solicitudes: 0,
      fechaPublicacion: new Date().toISOString(),
      matches: [],
    }

    this.pisos.push(nuevoPiso)
    this.saveToStorage()
    return nuevoPiso
  }

  updatePiso(id: number, updates: Partial<Piso>): boolean {
    const index = this.pisos.findIndex((piso) => piso.id === id)
    if (index !== -1) {
      this.pisos[index] = { ...this.pisos[index], ...updates }
      this.saveToStorage()
      return true
    }
    return false
  }

  deletePiso(id: number): boolean {
    const index = this.pisos.findIndex((piso) => piso.id === id)
    if (index !== -1) {
      this.pisos.splice(index, 1)
      this.saveToStorage()
      return true
    }
    return false
  }

  addRandomMatch(pisoId: number): boolean {
    const piso = this.getPiso(pisoId)
    if (!piso) return false

    const nombres = ["Ana Martín", "Carlos Ruiz", "Laura Sánchez", "David López", "Elena Torres"]
    const carreras = ["Medicina", "Derecho", "Ingeniería", "Psicología", "Económicas", "Farmacia"]
    const mensajes = [
      "Me interesa mucho tu piso, soy muy responsable.",
      "Busco un lugar tranquilo para estudiar.",
      "Tu piso parece perfecto para mí.",
      "Soy estudiante serio y ordenado.",
      "Me encanta la ubicación de tu piso.",
    ]

    const nuevoMatch: Match = {
      id: Date.now(),
      nombre: nombres[Math.floor(Math.random() * nombres.length)],
      edad: 18 + Math.floor(Math.random() * 8),
      carrera: carreras[Math.floor(Math.random() * carreras.length)],
      compatibilidad: 70 + Math.floor(Math.random() * 30),
      estado: "nuevo",
      fechaSolicitud: new Date().toISOString(),
      imagen: `/placeholder.svg?height=100&width=100&text=${Math.random().toString(36).substring(2, 4).toUpperCase()}&bg=f3e8ff&color=7c3aed`,
      mensaje: mensajes[Math.floor(Math.random() * mensajes.length)],
      motivos: ["Perfil compatible", "Edad adecuada"],
    }

    piso.matches.push(nuevoMatch)
    piso.solicitudes = piso.matches.length
    this.saveToStorage()
    return true
  }

  updateMatchStatus(pisoId: number, matchId: number, nuevoEstado: Match["estado"]): boolean {
    const piso = this.getPiso(pisoId)
    if (!piso) return false

    const match = piso.matches.find((m) => m.id === matchId)
    if (!match) return false

    match.estado = nuevoEstado
    this.saveToStorage()
    return true
  }

  getAllMatches(): { piso: Piso; match: Match }[] {
    const allMatches: { piso: Piso; match: Match }[] = []

    this.pisos.forEach((piso) => {
      piso.matches.forEach((match) => {
        allMatches.push({ piso, match })
      })
    })

    return allMatches
  }
}

export const propietarioStore = PropietarioStore.getInstance()
