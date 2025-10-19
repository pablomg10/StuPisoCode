// Minimal ambient declarations for leaflet and react-leaflet used via CDN at runtime.
// Purpose: avoid TS2307 editor errors when the project intentionally loads Leaflet from CDN
// and doesn't install the packages as dev dependencies.

declare module "leaflet" {
  import type * as React from "react"
  export type IconOptions = any
  export function icon(opts: IconOptions): any
  export const Icon: any
  export const Marker: any
  export const map: any
  export const tileLayer: any
  export default any
}

declare module "react-leaflet" {
  import * as React from "react"

  export const MapContainer: React.FC<any>
  export const TileLayer: React.FC<any>
  export const Marker: React.FC<any>
  export const Popup: React.FC<any>
  export default {} as any
}

// Also allow importing CSS from the CDN-free dev flow (some editors try to resolve)
declare module "*.css"
