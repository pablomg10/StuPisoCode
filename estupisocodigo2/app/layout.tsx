import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "EsTuPiso - Encuentra tu compañero de piso ideal",
  description: "Conecta con personas compatibles y encuentra el piso perfecto en España",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Use the symbol-only image (log.png) for all favicon targets so only the icon appears (no text). */}
        <link rel="icon" type="image/png" sizes="16x16" href="/log.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/log.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/log.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/log.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/log.png" />
        <link rel="shortcut icon" href="/log.png" />
        {/* Fallback to full logo for older UAs that ignore sizes; still prefer symbol-only */}
        <link rel="mask-icon" href="/log.png" color="#ff7a18" />
        <meta name="theme-color" content="#f8f1e1" />
      </head>
      <body className={`${inter.className} overflow-x-hidden antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
