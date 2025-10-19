"use client"

import React from "react"

type Props = {
  label?: string
  size?: "sm" | "md" | "lg"
  variant?: "white" | "filled"
  onClick?: () => void
  disabled?: boolean
  iconPosition?: "left" | "right"
}

export default function VerifiedPill({ label = "Propietario verificado", size = "md", variant = "white", onClick, disabled = false, iconPosition = "right" }: Props) {
  const sizeMap: Record<string, { px: string; py: string; text: string; minW: string }> = {
    sm: { px: "px-3", py: "py-1", text: "text-xs", minW: "min-w-[120px]" },
    md: { px: "px-4", py: "py-2", text: "text-sm", minW: "min-w-[160px]" },
    lg: { px: "px-8", py: "py-3", text: "text-base", minW: "min-w-[240px]" },
  }

  const s = sizeMap[size]

  const base = `relative rounded-full font-semibold ${s.px} ${s.py} ${s.minW}`

  if (variant === "filled") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-disabled={disabled}
        className={`${base} text-white border-transparent flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed`}
        style={{ border: "1px solid rgba(0,0,0,0.04)", backgroundColor: `var(--verify-blue, #0A74FF)` }}
      >
        {iconPosition === "left" && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 7v5l3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        )}

        <span className={`${s.text} pointer-events-none`}>{label}</span>

        {iconPosition === "right" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        )}
      </button>
    )
  }

  // white variant (white background, subtle border)
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={`${base} flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed bg-white`}
      style={{ border: "2px solid rgba(10,116,255,0.12)", background: "white" }}
    >
      <span className={`${s.text} text-[var(--verify-blue)] whitespace-nowrap`}>{label}</span>
    </button>
  )
}
