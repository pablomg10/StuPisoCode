"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface HeroImage {
  id: number
  image_url: string
  title: string | null
  subtitle: string | null
}

const defaultImages: HeroImage[] = [
  {
    id: 1,
    image_url: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1600&h=900&fit=crop",
    title: "Encuentra tu hogar perfecto",
    subtitle: "Conecta con compañeros ideales en Salamanca",
  },
  {
    id: 2,
    image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&h=900&fit=crop",
    title: "Vive la experiencia universitaria",
    subtitle: "Comparte momentos inolvidables",
  },
  {
    id: 3,
    image_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&h=900&fit=crop",
    title: "Comunidad verificada",
    subtitle: "Estudiantes de confianza en toda la ciudad",
  },
  {
    id: 4,
    image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&h=900&fit=crop",
    title: "Tu espacio, tu estilo",
    subtitle: "Encuentra el piso que se adapta a ti",
  },
]

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [images] = useState<HeroImage[]>(defaultImages)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, images.length])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  return (
    <div className="relative w-full h-[600px] lg:h-[700px] overflow-hidden group">
      {/* Images */}
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image.image_url || "/placeholder.svg"}
            alt={image.title || "Hero image"}
            fill
            className="object-cover"
            priority={index === 0}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

          {/* Text content */}
          {image.title && (
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl space-y-6 text-white">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold leading-tight">{image.title}</h1>
                  {image.subtitle && <p className="text-xl sm:text-2xl text-white/90 font-light">{image.subtitle}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous image"
      >
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
          <ChevronLeft className="w-6 h-6 text-white" />
        </div>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next image"
      >
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
          <ChevronRight className="w-6 h-6 text-white" />
        </div>
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
