// Datos simulados para la aplicación

export interface Usuario {
  id: number
  nombre: string
  edad: number
  carrera: string
  descripcion: string
  zona: string
  presupuesto: number
  intereses: string[]
  limpieza: string
  horario: string
  genero: string
  fumador: boolean
  mascotas: boolean
  fiestas: boolean
  compatibilidad?: number
  imagen: string
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
  contacto: { nombre: string; telefono: string; email: string }
  coordenadas: { lat: number; lng: number }
  imagenes: string[]
  // Preferencias del propietario
  preferencias?: {
    genero?: string
    edadMin?: number
    edadMax?: number
    limpieza?: string
    horario?: string
    carreras?: string[]
    fumador?: boolean
    mascotas?: boolean
    fiestas?: boolean
  }
  // Inquilino actual (si existe)
  inquilinoActual?: Usuario
  compatibilidad?: number
}

// 50+ usuarios expandidos
export const usuariosDisponibles: Usuario[] = [
  {
    id: 1,
    nombre: "María García",
    edad: 21,
    carrera: "Medicina",
    descripcion: "Estudiante de medicina, me gusta mantener el piso limpio y estudiar en un ambiente tranquilo.",
    zona: "Centro Histórico",
    presupuesto: 350,
    intereses: ["Lectura", "Deportes", "Café"],
    limpieza: "Muy ordenada",
    horario: "Matutino",
    genero: "Femenino",
    fumador: false,
    mascotas: false,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=María&bg=fce7f3&color=be185d",
  },
  {
    id: 2,
    nombre: "Carlos Ruiz",
    edad: 23,
    carrera: "Ingeniería Informática",
    descripcion: "Programador y gamer, busco ambiente relajado pero respetuoso.",
    zona: "Universidad",
    presupuesto: 400,
    intereses: ["Videojuegos", "Cocinar", "Música"],
    limpieza: "Normal",
    horario: "Nocturno",
    genero: "Masculino",
    fumador: false,
    mascotas: false,
    fiestas: true,
    imagen: "/placeholder.svg?height=300&width=300&text=Carlos&bg=dbeafe&color=1d4ed8",
  },
  {
    id: 3,
    nombre: "Ana Martín",
    edad: 20,
    carrera: "Psicología",
    descripcion: "Estudiante de psicología, sociable pero respeto los espacios personales.",
    zona: "Van Dyck",
    presupuesto: 320,
    intereses: ["Música", "Lectura", "Café"],
    limpieza: "Ordenada",
    horario: "Normal",
    genero: "Femenino",
    fumador: false,
    mascotas: true,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Ana&bg=f3e8ff&color=7c3aed",
  },
  {
    id: 4,
    nombre: "Laura Sánchez",
    edad: 22,
    carrera: "Derecho",
    descripcion: "Estudiante de derecho, organizada y responsable.",
    zona: "Centro Histórico",
    presupuesto: 380,
    intereses: ["Lectura", "Deportes", "Cocinar"],
    limpieza: "Muy ordenada",
    horario: "Matutino",
    genero: "Femenino",
    fumador: false,
    mascotas: false,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Laura&bg=f0f9ff&color=0369a1",
  },
  {
    id: 5,
    nombre: "David López",
    edad: 24,
    carrera: "Económicas",
    descripcion: "Estudiante de económicas, me gusta cocinar y hacer deporte.",
    zona: "Universidad",
    presupuesto: 350,
    intereses: ["Deportes", "Cocinar", "Música"],
    limpieza: "Normal",
    horario: "Normal",
    genero: "Masculino",
    fumador: false,
    mascotas: false,
    fiestas: true,
    imagen: "/placeholder.svg?height=300&width=300&text=David&bg=fef3c7&color=d97706",
  },
  {
    id: 6,
    nombre: "Sofía Ruiz",
    edad: 19,
    carrera: "Farmacia",
    descripcion: "Estudiante de farmacia, tranquila y estudiosa.",
    zona: "Capuchinos",
    presupuesto: 300,
    intereses: ["Lectura", "Café", "Música"],
    limpieza: "Ordenada",
    horario: "Matutino",
    genero: "Femenino",
    fumador: false,
    mascotas: false,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Sofía&bg=f0fdf4&color=16a34a",
  },
  {
    id: 7,
    nombre: "Javier Moreno",
    edad: 25,
    carrera: "Historia",
    descripcion: "Estudiante de historia, me encanta leer y debatir.",
    zona: "Centro Histórico",
    presupuesto: 370,
    intereses: ["Lectura", "Café", "Videojuegos"],
    limpieza: "Normal",
    horario: "Nocturno",
    genero: "Masculino",
    fumador: false,
    mascotas: true,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Javier&bg=fef2f2&color=dc2626",
  },
  {
    id: 8,
    nombre: "Elena Vega",
    edad: 21,
    carrera: "Biología",
    descripcion: "Bióloga en formación, amante de la naturaleza.",
    zona: "Universidad",
    presupuesto: 340,
    intereses: ["Deportes", "Lectura", "Cocinar"],
    limpieza: "Muy ordenada",
    horario: "Matutino",
    genero: "Femenino",
    fumador: false,
    mascotas: true,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Elena&bg=fffbeb&color=d97706",
  },
  {
    id: 9,
    nombre: "Pablo Jiménez",
    edad: 22,
    carrera: "Física",
    descripcion: "Estudiante de física, me gusta la música y los videojuegos.",
    zona: "Van Dyck",
    presupuesto: 330,
    intereses: ["Música", "Videojuegos", "Café"],
    limpieza: "Normal",
    horario: "Nocturno",
    genero: "Masculino",
    fumador: false,
    mascotas: false,
    fiestas: true,
    imagen: "/placeholder.svg?height=300&width=300&text=Pablo&bg=e0e7ff&color=3730a3",
  },
  {
    id: 10,
    nombre: "Carmen Díaz",
    edad: 20,
    carrera: "Filología",
    descripcion: "Estudiante de filología, me encantan los idiomas.",
    zona: "Centro Histórico",
    presupuesto: 360,
    intereses: ["Lectura", "Música", "Café"],
    limpieza: "Ordenada",
    horario: "Normal",
    genero: "Femenino",
    fumador: false,
    mascotas: false,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Carmen&bg=fdf2f8&color=be185d",
  },
  {
    id: 11,
    nombre: "Alejandro Torres",
    edad: 23,
    carrera: "Arquitectura",
    descripcion: "Estudiante de arquitectura, creativo y organizado.",
    zona: "Garrido Norte",
    presupuesto: 380,
    intereses: ["Deportes", "Música", "Cocinar"],
    limpieza: "Ordenado",
    horario: "Normal",
    genero: "Masculino",
    fumador: false,
    mascotas: false,
    fiestas: true,
    imagen: "/placeholder.svg?height=300&width=300&text=Alejandro&bg=ecfdf5&color=059669",
  },
  {
    id: 12,
    nombre: "Lucía Fernández",
    edad: 19,
    carrera: "Química",
    descripcion: "Estudiante de química, meticulosa y responsable.",
    zona: "Universidad",
    presupuesto: 320,
    intereses: ["Lectura", "Deportes", "Café"],
    limpieza: "Muy ordenada",
    horario: "Matutino",
    genero: "Femenino",
    fumador: false,
    mascotas: false,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Lucía&bg=f0f9ff&color=0369a1",
  },
  {
    id: 13,
    nombre: "Miguel Herrera",
    edad: 24,
    carrera: "Periodismo",
    descripcion: "Periodista en formación, sociable y curioso.",
    zona: "Centro Histórico",
    presupuesto: 390,
    intereses: ["Música", "Café", "Videojuegos"],
    limpieza: "Normal",
    horario: "Nocturno",
    genero: "Masculino",
    fumador: false,
    mascotas: true,
    fiestas: true,
    imagen: "/placeholder.svg?height=300&width=300&text=Miguel&bg=fef3c7&color=d97706",
  },
  {
    id: 14,
    nombre: "Natalia Romero",
    edad: 21,
    carrera: "Matemáticas",
    descripcion: "Estudiante de matemáticas, tranquila y estudiosa.",
    zona: "Van Dyck",
    presupuesto: 310,
    intereses: ["Lectura", "Música", "Deportes"],
    limpieza: "Ordenada",
    horario: "Matutino",
    genero: "Femenino",
    fumador: false,
    mascotas: false,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Natalia&bg=f3e8ff&color=7c3aed",
  },
  {
    id: 15,
    nombre: "Sergio Castillo",
    edad: 22,
    carrera: "Educación",
    descripcion: "Futuro maestro, paciente y comprensivo.",
    zona: "Buenos Aires",
    presupuesto: 340,
    intereses: ["Deportes", "Cocinar", "Música"],
    limpieza: "Normal",
    horario: "Normal",
    genero: "Masculino",
    fumador: false,
    mascotas: true,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Sergio&bg=dbeafe&color=1d4ed8",
  },
  {
    id: 16,
    nombre: "Andrea Silva",
    edad: 20,
    carrera: "Veterinaria",
    descripcion: "Estudiante de veterinaria, amante de los animales.",
    zona: "Capuchinos",
    presupuesto: 350,
    intereses: ["Deportes", "Lectura", "Cocinar"],
    limpieza: "Ordenada",
    horario: "Matutino",
    genero: "Femenino",
    fumador: false,
    mascotas: true,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Andrea&bg=f0fdf4&color=16a34a",
  },
  {
    id: 17,
    nombre: "Roberto Mendoza",
    edad: 25,
    carrera: "Filosofía",
    descripcion: "Filósofo en formación, reflexivo y tranquilo.",
    zona: "Centro Histórico",
    presupuesto: 370,
    intereses: ["Lectura", "Café", "Música"],
    limpieza: "Normal",
    horario: "Nocturno",
    genero: "Masculino",
    fumador: false,
    mascotas: false,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Roberto&bg=fef2f2&color=dc2626",
  },
  {
    id: 18,
    nombre: "Cristina Vargas",
    edad: 19,
    carrera: "Enfermería",
    descripcion: "Estudiante de enfermería, empática y cuidadosa.",
    zona: "Universidad",
    presupuesto: 330,
    intereses: ["Deportes", "Música", "Café"],
    limpieza: "Muy ordenada",
    horario: "Matutino",
    genero: "Femenino",
    fumador: false,
    mascotas: false,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Cristina&bg=fce7f3&color=be185d",
  },
  {
    id: 19,
    nombre: "Daniel Ortega",
    edad: 23,
    carrera: "Sociología",
    descripcion: "Sociólogo en formación, interesado en temas sociales.",
    zona: "Van Dyck",
    presupuesto: 360,
    intereses: ["Lectura", "Videojuegos", "Cocinar"],
    limpieza: "Normal",
    horario: "Normal",
    genero: "Masculino",
    fumador: false,
    mascotas: false,
    fiestas: true,
    imagen: "/placeholder.svg?height=300&width=300&text=Daniel&bg=e0e7ff&color=3730a3",
  },
  {
    id: 20,
    nombre: "Valeria Ramos",
    edad: 21,
    carrera: "Bellas Artes",
    descripcion: "Artista en formación, creativa y expresiva.",
    zona: "Centro Histórico",
    presupuesto: 380,
    intereses: ["Música", "Café", "Deportes"],
    limpieza: "Ordenada",
    horario: "Nocturno",
    genero: "Femenino",
    fumador: false,
    mascotas: true,
    fiestas: true,
    imagen: "/placeholder.svg?height=300&width=300&text=Valeria&bg=fffbeb&color=d97706",
  },
  {
    id: 21,
    nombre: "Fernando Aguilar",
    edad: 24,
    carrera: "Ingeniería Civil",
    descripcion: "Ingeniero civil en formación, práctico y organizado.",
    zona: "Garrido Norte",
    presupuesto: 400,
    intereses: ["Deportes", "Cocinar", "Videojuegos"],
    limpieza: "Ordenado",
    horario: "Matutino",
    genero: "Masculino",
    fumador: false,
    mascotas: false,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Fernando&bg=ecfdf5&color=059669",
  },
  {
    id: 22,
    nombre: "Isabella Cruz",
    edad: 20,
    carrera: "Traducción",
    descripcion: "Estudiante de traducción, políglota y cultural.",
    zona: "Universidad",
    presupuesto: 340,
    intereses: ["Lectura", "Música", "Café"],
    limpieza: "Muy ordenada",
    horario: "Normal",
    genero: "Femenino",
    fumador: false,
    mascotas: false,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Isabella&bg=f0f9ff&color=0369a1",
  },
  {
    id: 23,
    nombre: "Adrián Peña",
    edad: 22,
    carrera: "Informática",
    descripcion: "Programador apasionado, innovador y tecnológico.",
    zona: "Van Dyck",
    presupuesto: 370,
    intereses: ["Videojuegos", "Música", "Cocinar"],
    limpieza: "Normal",
    horario: "Nocturno",
    genero: "Masculino",
    fumador: false,
    mascotas: false,
    fiestas: true,
    imagen: "/placeholder.svg?height=300&width=300&text=Adrián&bg=dbeafe&color=1d4ed8",
  },
  {
    id: 24,
    nombre: "Camila Reyes",
    edad: 19,
    carrera: "Nutrición",
    descripcion: "Estudiante de nutrición, saludable y activa.",
    zona: "Buenos Aires",
    presupuesto: 320,
    intereses: ["Deportes", "Cocinar", "Lectura"],
    limpieza: "Ordenada",
    horario: "Matutino",
    genero: "Femenino",
    fumador: false,
    mascotas: false,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Camila&bg=f3e8ff&color=7c3aed",
  },
  {
    id: 25,
    nombre: "Gonzalo Morales",
    edad: 23,
    carrera: "Administración",
    descripcion: "Futuro administrador, organizado y ambicioso.",
    zona: "Centro Histórico",
    presupuesto: 390,
    intereses: ["Deportes", "Música", "Café"],
    limpieza: "Ordenado",
    horario: "Normal",
    genero: "Masculino",
    fumador: false,
    mascotas: false,
    fiestas: true,
    imagen: "/placeholder.svg?height=300&width=300&text=Gonzalo&bg=fef3c7&color=d97706",
  },
  {
    id: 26,
    nombre: "Paola Guerrero",
    edad: 21,
    carrera: "Odontología",
    descripcion: "Estudiante de odontología, detallista y cuidadosa.",
    zona: "Capuchinos",
    presupuesto: 360,
    intereses: ["Lectura", "Deportes", "Música"],
    limpieza: "Muy ordenada",
    horario: "Matutino",
    genero: "Femenino",
    fumador: false,
    mascotas: false,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Paola&bg=f0fdf4&color=16a34a",
  },
  {
    id: 27,
    nombre: "Rodrigo Campos",
    edad: 24,
    carrera: "Geología",
    descripcion: "Geólogo en formación, aventurero y curioso.",
    zona: "Universidad",
    presupuesto: 350,
    intereses: ["Deportes", "Videojuegos", "Cocinar"],
    limpieza: "Normal",
    horario: "Normal",
    genero: "Masculino",
    fumador: false,
    mascotas: true,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Rodrigo&bg=fef2f2&color=dc2626",
  },
  {
    id: 28,
    nombre: "Martina López",
    edad: 20,
    carrera: "Trabajo Social",
    descripcion: "Trabajadora social en formación, empática y solidaria.",
    zona: "Van Dyck",
    presupuesto: 330,
    intereses: ["Lectura", "Música", "Café"],
    limpieza: "Ordenada",
    horario: "Normal",
    genero: "Femenino",
    fumador: false,
    mascotas: true,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Martina&bg=fce7f3&color=be185d",
  },
  {
    id: 29,
    nombre: "Emilio Santos",
    edad: 22,
    carrera: "Turismo",
    descripcion: "Estudiante de turismo, viajero y sociable.",
    zona: "Centro Histórico",
    presupuesto: 380,
    intereses: ["Música", "Deportes", "Cocinar"],
    limpieza: "Normal",
    horario: "Nocturno",
    genero: "Masculino",
    fumador: false,
    mascotas: false,
    fiestas: true,
    imagen: "/placeholder.svg?height=300&width=300&text=Emilio&bg=e0e7ff&color=3730a3",
  },
  {
    id: 30,
    nombre: "Gabriela Herrera",
    edad: 19,
    carrera: "Fisioterapia",
    descripcion: "Estudiante de fisioterapia, activa y saludable.",
    zona: "Garrido Norte",
    presupuesto: 340,
    intereses: ["Deportes", "Lectura", "Música"],
    limpieza: "Ordenada",
    horario: "Matutino",
    genero: "Femenino",
    fumador: false,
    mascotas: false,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Gabriela&bg=fffbeb&color=d97706",
  },
  {
    id: 31,
    nombre: "Nicolás Rivera",
    edad: 25,
    carrera: "Música",
    descripcion: "Músico en formación, creativo y apasionado.",
    zona: "Centro Histórico",
    presupuesto: 370,
    intereses: ["Música", "Café", "Videojuegos"],
    limpieza: "Normal",
    horario: "Nocturno",
    genero: "Masculino",
    fumador: false,
    mascotas: true,
    fiestas: true,
    imagen: "/placeholder.svg?height=300&width=300&text=Nicolás&bg=ecfdf5&color=059669",
  },
  {
    id: 32,
    nombre: "Valentina Molina",
    edad: 21,
    carrera: "Comunicación",
    descripcion: "Estudiante de comunicación, expresiva y social.",
    zona: "Universidad",
    presupuesto: 350,
    intereses: ["Música", "Deportes", "Café"],
    limpieza: "Ordenada",
    horario: "Normal",
    genero: "Femenino",
    fumador: false,
    mascotas: false,
    fiestas: true,
    imagen: "/placeholder.svg?height=300&width=300&text=Valentina&bg=f0f9ff&color=0369a1",
  },
  {
    id: 33,
    nombre: "Mateo Vargas",
    edad: 23,
    carrera: "Estadística",
    descripcion: "Estadístico en formación, analítico y preciso.",
    zona: "Van Dyck",
    presupuesto: 360,
    intereses: ["Lectura", "Videojuegos", "Deportes"],
    limpieza: "Muy ordenado",
    horario: "Matutino",
    genero: "Masculino",
    fumador: false,
    mascotas: false,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Mateo&bg=dbeafe&color=1d4ed8",
  },
  {
    id: 34,
    nombre: "Renata Jiménez",
    edad: 20,
    carrera: "Antropología",
    descripcion: "Antropóloga en formación, curiosa y cultural.",
    zona: "Buenos Aires",
    presupuesto: 330,
    intereses: ["Lectura", "Música", "Cocinar"],
    limpieza: "Ordenada",
    horario: "Normal",
    genero: "Femenino",
    fumador: false,
    mascotas: true,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Renata&bg=f3e8ff&color=7c3aed",
  },
  {
    id: 35,
    nombre: "Sebastián Torres",
    edad: 24,
    carrera: "Ingeniería Química",
    descripcion: "Ingeniero químico en formación, meticuloso y científico.",
    zona: "Centro Histórico",
    presupuesto: 400,
    intereses: ["Deportes", "Cocinar", "Lectura"],
    limpieza: "Muy ordenado",
    horario: "Matutino",
    genero: "Masculino",
    fumador: false,
    mascotas: false,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Sebastián&bg=fef3c7&color=d97706",
  },
  {
    id: 36,
    nombre: "Florencia Ruiz",
    edad: 19,
    carrera: "Diseño Gráfico",
    descripcion: "Diseñadora gráfica en formación, creativa y visual.",
    zona: "Capuchinos",
    presupuesto: 340,
    intereses: ["Música", "Café", "Deportes"],
    limpieza: "Ordenada",
    horario: "Nocturno",
    genero: "Femenino",
    fumador: false,
    mascotas: false,
    fiestas: true,
    imagen: "/placeholder.svg?height=300&width=300&text=Florencia&bg=f0fdf4&color=16a34a",
  },
  {
    id: 37,
    nombre: "Ignacio Mendez",
    edad: 22,
    carrera: "Relaciones Internacionales",
    descripcion: "Estudiante de relaciones internacionales, diplomático y culto.",
    zona: "Universidad",
    presupuesto: 380,
    intereses: ["Lectura", "Música", "Videojuegos"],
    limpieza: "Normal",
    horario: "Normal",
    genero: "Masculino",
    fumador: false,
    mascotas: false,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Ignacio&bg=fef2f2&color=dc2626",
  },
  {
    id: 38,
    nombre: "Antonella García",
    edad: 21,
    carrera: "Terapia Ocupacional",
    descripcion: "Terapeuta ocupacional en formación, paciente y comprensiva.",
    zona: "Van Dyck",
    presupuesto: 320,
    intereses: ["Deportes", "Lectura", "Cocinar"],
    limpieza: "Ordenada",
    horario: "Matutino",
    genero: "Femenino",
    fumador: false,
    mascotas: false,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Antonella&bg=fce7f3&color=be185d",
  },
  {
    id: 39,
    nombre: "Tomás Herrera",
    edad: 23,
    carrera: "Economía",
    descripcion: "Economista en formación, analítico y estratégico.",
    zona: "Centro Histórico",
    presupuesto: 390,
    intereses: ["Lectura", "Deportes", "Música"],
    limpieza: "Ordenado",
    horario: "Normal",
    genero: "Masculino",
    fumador: false,
    mascotas: false,
    fiestas: true,
    imagen: "/placeholder.svg?height=300&width=300&text=Tomás&bg=e0e7ff&color=3730a3",
  },
  {
    id: 40,
    nombre: "Jimena Silva",
    edad: 20,
    carrera: "Biotecnología",
    descripcion: "Estudiante de biotecnología, innovadora y científica.",
    zona: "Universidad",
    presupuesto: 350,
    intereses: ["Lectura", "Café", "Videojuegos"],
    limpieza: "Muy ordenada",
    horario: "Matutino",
    genero: "Femenino",
    fumador: false,
    mascotas: true,
    fiestas: false,
    imagen: "/placeholder.svg?height=300&width=300&text=Jimena&bg=fffbeb&color=d97706",
  },
]

// Función para obtener usuarios compatibles
export function obtenerUsuariosCompatibles(usuarioActual: Partial<Usuario>): Usuario[] {
  return usuariosDisponibles
    .filter((usuario) => usuario.id !== usuarioActual.id)
    .map((usuario) => {
      // Calcular compatibilidad basada en intereses, zona, presupuesto, etc.
      let compatibilidad = 50 // Base

      // Intereses comunes
      if (usuarioActual.intereses) {
        const interesesComunes = usuario.intereses.filter((interes) =>
          usuarioActual.intereses?.includes(interes),
        ).length
        compatibilidad += interesesComunes * 10
      }

      // Zona similar
      if (usuarioActual.zona === usuario.zona) {
        compatibilidad += 15
      }

      // Presupuesto similar
      if (usuarioActual.presupuesto && Math.abs(usuarioActual.presupuesto - usuario.presupuesto) <= 50) {
        compatibilidad += 10
      }

      // Limpieza compatible
      if (usuarioActual.limpieza === usuario.limpieza) {
        compatibilidad += 10
      }

      // Horario compatible
      if (usuarioActual.horario === usuario.horario) {
        compatibilidad += 10
      }

      return { ...usuario, compatibilidad: Math.min(compatibilidad, 100) }
    })
    .sort((a, b) => (b.compatibilidad || 0) - (a.compatibilidad || 0))
}

// Función para filtrar usuarios
export function filtrarUsuarios(
  usuarios: Usuario[],
  filtros: {
    zona?: string
    presupuestoMin?: number
    presupuestoMax?: number
    intereses?: string[]
    limpieza?: string
    horario?: string
  },
): Usuario[] {
  return usuarios.filter((usuario) => {
    if (filtros.zona && usuario.zona !== filtros.zona) return false
    if (filtros.presupuestoMin && usuario.presupuesto < filtros.presupuestoMin) return false
    if (filtros.presupuestoMax && usuario.presupuesto > filtros.presupuestoMax) return false
    if (filtros.limpieza && usuario.limpieza !== filtros.limpieza) return false
    if (filtros.horario && usuario.horario !== filtros.horario) return false
    if (
      filtros.intereses &&
      filtros.intereses.length > 0 &&
      !filtros.intereses.some((interes) => usuario.intereses.includes(interes))
    ) {
      return false
    }
    return true
  })
}

// Función para calcular compatibilidad entre dos usuarios
export function calcularCompatibilidadUsuarios(usuario1: Partial<Usuario>, usuario2: Usuario): number {
  let compatibilidad = 50 // Base

  // Intereses comunes
  if (usuario1.intereses) {
    const interesesComunes = usuario2.intereses.filter((interes) => usuario1.intereses?.includes(interes)).length
    compatibilidad += interesesComunes * 8
  }

  // Zona similar
  if (usuario1.zona === usuario2.zona) {
    compatibilidad += 10
  }

  // Presupuesto similar
  if (usuario1.presupuesto && Math.abs(usuario1.presupuesto - usuario2.presupuesto) <= 50) {
    compatibilidad += 8
  }

  // Limpieza compatible
  if (usuario1.limpieza === usuario2.limpieza) {
    compatibilidad += 12
  } else if (
    (usuario1.limpieza === "Muy ordenada" && usuario2.limpieza === "Ordenada") ||
    (usuario1.limpieza === "Ordenada" && usuario2.limpieza === "Normal")
  ) {
    compatibilidad += 6
  }

  // Horario compatible
  if (usuario1.horario === usuario2.horario) {
    compatibilidad += 10
  } else if (usuario1.horario === "Normal" || usuario2.horario === "Normal") {
    compatibilidad += 5
  }

  // Carrera relacionada (bonus pequeño)
  const carrerasAfines = {
    Medicina: ["Enfermería", "Farmacia", "Biología"],
    Ingeniería: ["Física", "Matemáticas", "Informática"],
    Derecho: ["Administración", "Economía", "Relaciones Internacionales"],
  }

  if (usuario1.carrera && usuario2.carrera) {
    const afines = carrerasAfines[usuario1.carrera as keyof typeof carrerasAfines] || []
    if (afines.includes(usuario2.carrera)) {
      compatibilidad += 5
    }
  }

  // Penalizaciones por incompatibilidades
  if (usuario1.fumador !== usuario2.fumador && (usuario1.fumador === false || usuario2.fumador === false)) {
    compatibilidad -= 15
  }

  if (usuario1.mascotas !== usuario2.mascotas && (usuario1.mascotas === false || usuario2.mascotas === false)) {
    compatibilidad -= 10
  }

  if (usuario1.fiestas !== usuario2.fiestas) {
    compatibilidad -= 8
  }

  return Math.max(0, Math.min(100, compatibilidad))
}

// Función para calcular compatibilidad entre estudiante y piso
export function calcularCompatibilidadPiso(estudiante: Partial<Usuario>, piso: Piso): number {
  let compatibilidad = 50 // Base

  // Compatibilidad de presupuesto (muy importante)
  if (estudiante.presupuesto) {
    const diferenciaPrecio = Math.abs(estudiante.presupuesto - piso.precio)
    if (diferenciaPrecio <= 25) {
      compatibilidad += 20
    } else if (diferenciaPrecio <= 50) {
      compatibilidad += 15
    } else if (diferenciaPrecio <= 100) {
      compatibilidad += 10
    } else if (diferenciaPrecio > 150) {
      compatibilidad -= 15
    }
  }

  // Compatibilidad de zona
  if (estudiante.zona === piso.zona) {
    compatibilidad += 15
  }

  // Si hay un inquilino actual, calcular compatibilidad con él (peso importante)
  if (piso.inquilinoActual) {
    const compatibilidadInquilino = calcularCompatibilidadUsuarios(estudiante, piso.inquilinoActual)
    // Dar peso del 40% a la compatibilidad con el inquilino
    compatibilidad += (compatibilidadInquilino - 50) * 0.4
  }

  // Preferencias del propietario
  if (piso.preferencias) {
    const prefs = piso.preferencias

    // Género
    if (prefs.genero && prefs.genero !== "Indiferente" && estudiante.genero === prefs.genero) {
      compatibilidad += 10
    }

    // Edad
    if (prefs.edadMin && prefs.edadMax && estudiante.edad) {
      if (estudiante.edad >= prefs.edadMin && estudiante.edad <= prefs.edadMax) {
        compatibilidad += 10
      } else {
        compatibilidad -= 10
      }
    }

    // Limpieza
    if (prefs.limpieza && estudiante.limpieza) {
      if (prefs.limpieza === estudiante.limpieza) {
        compatibilidad += 15
      } else if (
        (prefs.limpieza === "Muy ordenada" && estudiante.limpieza === "Ordenada") ||
        (prefs.limpieza === "Ordenada" && estudiante.limpieza === "Normal")
      ) {
        compatibilidad += 5
      }
    }

    // Horario
    if (prefs.horario && estudiante.horario === prefs.horario) {
      compatibilidad += 10
    }

    // Carrera
    if (prefs.carreras && prefs.carreras.length > 0 && estudiante.carrera) {
      if (prefs.carreras.includes(estudiante.carrera)) {
        compatibilidad += 10
      }
    }

    // Fumador
    if (prefs.fumador !== undefined && estudiante.fumador === prefs.fumador) {
      compatibilidad += 8
    } else if (prefs.fumador === false && estudiante.fumador === true) {
      compatibilidad -= 20
    }

    // Mascotas
    if (prefs.mascotas !== undefined && estudiante.mascotas === prefs.mascotas) {
      compatibilidad += 8
    } else if (prefs.mascotas === false && estudiante.mascotas === true) {
      compatibilidad -= 15
    }

    // Fiestas
    if (prefs.fiestas !== undefined && estudiante.fiestas === prefs.fiestas) {
      compatibilidad += 8
    } else if (prefs.fiestas === false && estudiante.fiestas === true) {
      compatibilidad -= 10
    }
  }

  return Math.max(0, Math.min(100, compatibilidad))
}

// Función para obtener pisos compatibles con un estudiante
export function obtenerPisosCompatibles(estudiante: Partial<Usuario>, pisos: Piso[]): Piso[] {
  return pisos
    .map((piso) => ({
      ...piso,
      compatibilidad: calcularCompatibilidadPiso(estudiante, piso),
    }))
    .sort((a, b) => (b.compatibilidad || 0) - (a.compatibilidad || 0))
}
