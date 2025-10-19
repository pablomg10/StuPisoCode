"use client"

import Image from "next/image"
import React from "react"

type Props = {
  className?: string
}

export default function SiteLogo({ className = "" }: Props) {
  return (
    <div className={`w-28 md:w-40 lg:w-52 h-12 md:h-14 lg:h-16 relative overflow-visible ${className}`}>
      <Image src="/logo.png" alt="EsTuPiso" width={520} height={160} className="absolute left-0 top-1/2 -translate-y-1/2 h-28 md:h-40 lg:h-52 w-auto" priority />
    </div>
  )
}
