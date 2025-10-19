"use client"

import React, { useEffect, useRef } from "react"

export type Listing = {
  id: string | number
  titulo?: string
  lat?: number
  lng?: number
  precio?: number
  imagen?: string
}

function ensureLeafletAssets(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("No window"))

    // CSS
    const cssHref = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    if (!document.querySelector(`link[href='${cssHref}']`)) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = cssHref
      document.head.appendChild(link)
    }

    // JS
    const jsSrc = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    if ((window as any).L) return resolve()
    const existing = document.querySelector(`script[src='${jsSrc}']`)
    if (existing) {
      existing.addEventListener("load", () => resolve())
      existing.addEventListener("error", () => reject(new Error("Failed to load leaflet script")))
      return
    }

    const script = document.createElement("script")
    script.src = jsSrc
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load leaflet script"))
    document.body.appendChild(script)
  })
}

export default function MapaCDN({ listings }: { listings?: Listing[] }) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let map: any = null
    let markers: any[] = []
    let mounted = true

    ensureLeafletAssets()
      .then(() => {
        if (!mounted) return
        const L = (window as any).L

        // default center
        const center = listings && listings.length > 0 && listings[0].lat && listings[0].lng ? [listings[0].lat, listings[0].lng] : [40.964, -5.6636]

        map = L.map(ref.current).setView(center, 13)

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        }).addTo(map)

        // marker icon that shows the price as a badge
        const makeIconWithPrice = (price: string) => {
          const html = `<div style="display:flex;align-items:center;justify-content:center;width:56px;height:28px;background:#111827;color:#fff;border-radius:14px;font-weight:700;font-size:14px;border:3px solid #ffedd5">€${price}</div>`
          return L.divIcon({ className: "custom-price-icon", html, iconSize: [56, 28], iconAnchor: [28, 28], popupAnchor: [0, -30] })
        }

        if (listings && listings.length > 0) {
          listings.forEach((l) => {
            if (l.lat && l.lng) {
              const id = l.id
              const price = l.precio || "-"
              const title = l.titulo || `Piso ${id}`
              const initialHtml = `
                <div class="popup-root">
                  <div style="font-weight:600;margin-bottom:6px">${title}</div>
                  <div style="margin-bottom:6px"><button class="price-btn" data-id="${id}" style="background:#ff7a00;color:#fff;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;font-weight:700">€${price}</button></div>
                  <div><a href='/propiedad/${id}' style="color:#1f2937;text-decoration:underline">Ver anuncio</a></div>
                </div>
              `

                const imgSrc = (l as any).imagen || '/placeholder.jpg'
                const previewHtml = `
                <div class="popup-preview">
                  <div style="display:flex;gap:8px;align-items:center">
                    <img src="${imgSrc}" alt="imagen" style="width:80px;height:60px;object-fit:cover;border-radius:6px;border:1px solid #e5e7eb" />
                    <div>
                      <div style="font-weight:700">${title}</div>
                      <div style="color:#6b7280">Precio: €${price}</div>
                      <div style="margin-top:6px"><a href='/propiedad/${id}' style="color:#ff7a00;font-weight:700;text-decoration:none">Ver detalles →</a></div>
                    </div>
                  </div>
                  <div style="margin-top:8px"><button class="popup-back" style="background:#f3f4f6;border:none;padding:6px 8px;border-radius:6px;cursor:pointer">Volver</button></div>
                </div>
              `

              const priceStr = String(l.precio || '-')
              const iconWithPrice = makeIconWithPrice(priceStr)
              const m = L.marker([l.lat, l.lng], { icon: iconWithPrice }).addTo(map)
              m.bindPopup(initialHtml)

              // open preview when the marker is clicked (not just the popup price button)
              m.on('click', function () {
                m.setPopupContent(previewHtml)
                m.openPopup()
              })

              markers.push(m)
            }
          })
        }
      })
      .catch((err) => {
        console.error("Error cargando Leaflet desde CDN:", err)
      })

    return () => {
      mounted = false
      try {
        if (map) map.remove()
      } catch (e) {
        /* ignore */
      }
    }
  }, [listings])

  return <div ref={ref} className="w-full h-96 bg-gray-100" />
}
