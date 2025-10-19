"use client"

import LeafletMap from "./leaflet-map"

export default function MapaPageClient({ listings }: { listings: Array<any> }) {
  const markers = (listings || [])
    .filter((l) => l.lat != null && l.lng != null)
    .map((l) => ({ id: l.id, lat: Number(l.lat), lng: Number(l.lng), price: l.precio || l.price || l.price_monthly || null, title: l.titulo || l.title }))

  return <div className="h-full"><LeafletMap markers={markers} zoom={13} height="100%" /></div>
}
