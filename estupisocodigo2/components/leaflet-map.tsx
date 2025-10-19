"use client"

import React, { useEffect, useRef } from "react"

type Marker = {
  id?: string
  lat: number
  lng: number
  price?: number
  title?: string
}

export default function LeafletMap({
  center,
  markers = [],
  zoom = 13,
  height = "400px",
}: {
  center?: [number, number]
  markers?: Marker[]
  zoom?: number
  height?: string
}) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const instanceRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const Lcss = document.querySelector('link[data-leaflet]') as HTMLLinkElement | null
    if (!Lcss) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      link.setAttribute("data-leaflet", "1")
      document.head.appendChild(link)
    }

    const scriptId = "leaflet-js"
    const existing = document.getElementById(scriptId)
    const loadLeaflet = () => {
      const L = (window as any).L
      if (!L || !mapRef.current) return

      // create map
      instanceRef.current = L.map(mapRef.current, { zoomControl: true })
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      }).addTo(instanceRef.current)

      // add markers
      const leafletMarkers: any[] = []
      markers.forEach((m) => {
        if (typeof m.lat !== "number" || typeof m.lng !== "number") return
        const iconHtml = m.price ? `<div style="background:#ff7a18;color:white;padding:4px 8px;border-radius:12px;font-weight:700;font-size:12px">${m.price}€</div>` : `<div style="background:#0a74ff;color:white;padding:6px;border-radius:12px;width:12px;height:12px"></div>`
        const icon = L.divIcon({ className: "", html: iconHtml, iconSize: [40, 24], iconAnchor: [20, 12] })
        const marker = L.marker([m.lat, m.lng], { icon })
        if (m.title) marker.bindPopup(`<strong>${m.title}</strong><br/>${m.price ? m.price + '€/mes' : ''}`)
        marker.addTo(instanceRef.current)
        leafletMarkers.push(marker)
      })

      // fit bounds
      if (leafletMarkers.length > 0) {
        const group = L.featureGroup(leafletMarkers)
        instanceRef.current.fitBounds(group.getBounds().pad(0.2))
      } else if (center) {
        instanceRef.current.setView(center, zoom)
      }
    }

    if (!existing) {
      const script = document.createElement("script")
      script.id = scriptId
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.async = true
      script.onload = () => loadLeaflet()
      document.body.appendChild(script)
    } else {
      // already loaded
      loadLeaflet()
    }

    return () => {
      try {
        const L = (window as any).L
        if (instanceRef.current && L) {
          instanceRef.current.remove()
          instanceRef.current = null
        }
      } catch (e) {
        // ignore
      }
    }
  }, [markers.map((m) => `${m.lat},${m.lng},${m.price}`).join("|")])

  return <div ref={mapRef} style={{ width: "100%", height }} className="rounded-lg overflow-hidden" />
}
