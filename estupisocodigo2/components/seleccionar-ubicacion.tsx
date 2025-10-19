"use client"

import React, { useEffect, useRef, useState } from "react"

type Props = { initial?: { lat: number; lng: number } | null; onChange?: (coords: { lat: number; lng: number } | null) => void }

export default function SeleccionarUbicacion({ initial = null, onChange }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let map: any = null
    let marker: any = null
    let mounted = true

    const ensure = async () => {
      if (typeof window === 'undefined') return
      const cssHref = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      if (!document.querySelector(`link[href='${cssHref}']`)) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = cssHref
        document.head.appendChild(link)
      }
      if (!(window as any).L) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script')
          s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
          s.async = true
          s.onload = () => resolve()
          s.onerror = () => reject()
          document.body.appendChild(s)
        })
      }

      if (!mounted) return
      const L = (window as any).L
      const center = initial ? [initial.lat, initial.lng] : [40.964, -5.6636]
      map = L.map(ref.current).setView(center, 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map)

      if (initial) {
        marker = L.marker([initial.lat, initial.lng], { draggable: true }).addTo(map)
        marker.on('dragend', () => {
          const latlng = marker.getLatLng()
          onChange && onChange({ lat: latlng.lat, lng: latlng.lng })
        })
      }

      map.on('click', function (e: any) {
        const { lat, lng } = e.latlng
        if (marker) marker.setLatLng([lat, lng])
        else marker = L.marker([lat, lng], { draggable: true }).addTo(map)
        onChange && onChange({ lat, lng })
      })

      setLoading(false)
    }

    ensure().catch((err) => {
      console.error('Error cargando Leaflet en selector:', err)
      setLoading(false)
    })

    return () => {
      mounted = false
      try { if (map) map.remove() } catch(e) {}
    }
  }, [])

  return (
    <div>
      <div ref={ref} className="w-full h-64 bg-gray-100 rounded-md" />
      {loading && <div className="text-sm text-gray-500 mt-2">Cargando mapa...</div>}
      <div className="text-xs text-gray-600 mt-2">Haz clic en el mapa para seleccionar la ubicación exacta. Arrastra el marcador para ajustar.</div>
    </div>
  )
}
