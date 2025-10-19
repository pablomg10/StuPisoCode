"use client"

import React from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
// Load Leaflet CSS dynamically on client to avoid build-time resolution issues
if (typeof window !== "undefined") {
  const href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  if (!document.querySelector(`link[href='${href}']`)) {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = href
    document.head.appendChild(link)
  }
}

// Inline default icon (SVG data URI) to avoid external asset dependencies
const svgIcon = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='%23FF7A00'/><text x='12' y='16' font-size='10' text-anchor='middle' fill='white' font-family='Arial'>E</text></svg>`

const DefaultIcon = L.icon({
  iconUrl: svgIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

;(L as any).Marker.prototype.options.icon = DefaultIcon

export type Listing = {
  id: string | number
  titulo?: string
  lat?: number
  lng?: number
  precio?: number
}

export default function MapaLeaflet({ listings }: { listings: Listing[] }) {
  const center: [number, number] = listings && listings.length > 0 && listings[0].lat && listings[0].lng ? [listings[0].lat!, listings[0].lng!] : [40.964, -5.6636]

  return (
    <div className="w-full h-96">
      <MapContainer center={center} zoom={13} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {listings.map((l) =>
          l.lat && l.lng ? (
            <Marker key={l.id} position={[l.lat, l.lng]}>
              <Popup>
                <strong>{l.titulo || `Piso ${l.id}`}</strong>
                <div>Precio: €{l.precio || "-"}</div>
                <div>
                  <a href={`/propiedad/${l.id}`}>Ver anuncio</a>
                </div>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  )
}
