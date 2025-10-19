import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import SiteLogo from "@/components/site-logo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, Filter } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import MapaPageClient from "@/components/mapa-page-client"

export default async function Page() {
  const supabase = await createClient()
  const { data: rows } = await supabase.from("properties").select("id, title, price_monthly, latitude, longitude, images")

  const listings = (rows || []).map((r: any) => ({ id: r.id, titulo: r.title, precio: r.price_monthly, lat: r.latitude, lng: r.longitude, imagen: (r.images && r.images[0]) || '/placeholder.jpg' }))

  const zonas = ["Todas las zonas", "Centro Histórico", "Van Dyck", "Garrido Norte", "Universidad", "Capuchinos", "Buenos Aires", "Pizarrales"]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <SiteLogo />
              </Link>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/perfil" className="text-gray-600 hover:text-gray-900">Mi Perfil</Link>
              <Link href="/matches" className="text-gray-600 hover:text-gray-900">Matches</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mapa de Pisos</h1>
          <p className="text-gray-600">Encuentra pisos por zona y visualízalos en el mapa clásico</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2"><Filter className="w-5 h-5" /><span>Filtros</span></CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Buscar por zona o dirección" className="pl-10" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Zona</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {zonas.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Precio máximo:</label>
                  <Slider value={[800]} min={200} max={1000} step={25} className="w-full" />
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">{(listings || []).length} pisos encontrados</p>
                </div>

                <div>
                  <Button variant="default" size="sm" className="w-full">Reset filtros</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="h-[700px]">
              <CardContent className="p-0 h-full">
                {/* Mapa en diseño antiguo */}
                <div className="h-full">
                  {/* MapaPageClient es un Client Component que carga Leaflet desde CDN */}
                  <MapaPageClient listings={listings as any} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
