"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface Particle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

interface ParticleEffectsProps {
  trigger: boolean
  type: "success" | "error"
  position: { x: number; y: number }
  onComplete?: () => void
}

export function ParticleEffects({ trigger, type, position, onComplete }: ParticleEffectsProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!trigger) return

    // Create particles
    const newParticles: Particle[] = []
    const particleCount = type === "success" ? 12 : 8
    const colors = type === "success" ? ["#f25045", "#ffffff", "#2ecc71"] : ["#ff6b6b", "#ffffff"]

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: `${Date.now()}-${i}`,
        x: position.x,
        y: position.y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        life: 60,
        maxLife: 60,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
      })
    }

    setParticles(newParticles)

    // Animate particles
    const animateParticles = () => {
      setParticles((prev) => {
        const updated = prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.2, // gravity
            life: particle.life - 1,
          }))
          .filter((particle) => particle.life > 0)

        if (updated.length === 0 && onComplete) {
          onComplete()
        }

        return updated
      })
    }

    const interval = setInterval(animateParticles, 16) // ~60fps

    return () => clearInterval(interval)
  }, [trigger, type, position, onComplete])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.life / particle.maxLife,
            transform: `scale(${particle.life / particle.maxLife})`,
          }}
        />
      ))}
    </div>
  )
}

interface ShakeAnimationProps {
  trigger: boolean
  children: React.ReactNode
  onComplete?: () => void
}

export function ShakeAnimation({ trigger, children, onComplete }: ShakeAnimationProps) {
  const [isShaking, setIsShaking] = useState(false)

  useEffect(() => {
    if (trigger) {
      setIsShaking(true)
      const timer = setTimeout(() => {
        setIsShaking(false)
        if (onComplete) onComplete()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [trigger, onComplete])

  return <div className={`${isShaking ? "animate-shake" : ""} transition-transform duration-500`}>{children}</div>
}

interface BagOpenAnimationProps {
  isOpen: boolean
  children: React.ReactNode
}

export function BagOpenAnimation({ isOpen, children }: BagOpenAnimationProps) {
  return (
    <div className={`transition-all duration-300 ease-out ${isOpen ? "scale-105 rotate-1" : "scale-100 rotate-0"}`}>
      {children}
    </div>
  )
}

interface FloatingScoreProps {
  score: number
  position: { x: number; y: number }
  onComplete?: () => void
}

export function FloatingScore({ score, position, onComplete }: FloatingScoreProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete()
    }, 1000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className="fixed pointer-events-none z-50 animate-bounce"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className={`text-4xl font-bold ${score > 0 ? "text-primary" : "text-destructive"} animate-pulse`}>
        {score > 0 ? "+" : ""}
        {score}
      </div>
    </div>
  )
}
