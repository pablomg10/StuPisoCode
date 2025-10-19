"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Sparkles } from "lucide-react"
import Link from "next/link"

interface MatchModalProps {
  isOpen: boolean
  onClose: () => void
  matchName: string
  matchImage: string
}

export default function MatchModal({ isOpen, onClose, matchName, matchImage }: MatchModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0 border-0">
        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-50">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: "-10px",
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                <Heart
                  className="w-4 h-4"
                  style={{
                    color: ["#ef4444", "#ec4899", "#f59e0b", "#10b981"][Math.floor(Math.random() * 4)],
                    fill: ["#ef4444", "#ec4899", "#f59e0b", "#10b981"][Math.floor(Math.random() * 4)],
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <div className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-8 text-center">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-ping bg-white/30 rounded-full" />
                <Heart className="w-16 h-16 text-white fill-white relative z-10" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">¡Es un Match!</h2>
            <p className="text-white/90 text-lg">Tú y {matchName} os habéis gustado mutuamente</p>
          </div>
        </div>

        <div className="p-6 bg-card">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary shadow-lg">
                <img src={matchImage || "/placeholder.svg"} alt={matchName} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/chat" className="block">
              <Button className="w-full" size="lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                Enviar mensaje
              </Button>
            </Link>
            <Button variant="outline" className="w-full bg-transparent" size="lg" onClick={onClose}>
              Seguir descubriendo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
