"use client"

import { useEffect, useRef } from "react"

interface SoundEffectsProps {
  enabled?: boolean
}

export function useSoundEffects(enabled = true) {
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (enabled && typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }, [enabled])

  const playSound = (frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.1) => {
    if (!enabled || !audioContextRef.current) return

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
    oscillator.type = type

    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration)

    oscillator.start(audioContextRef.current.currentTime)
    oscillator.stop(audioContextRef.current.currentTime + duration)
  }

  const playSuccessSound = () => {
    // Pleasant chime sound
    playSound(523.25, 0.2, "sine", 0.1) // C5
    setTimeout(() => playSound(659.25, 0.2, "sine", 0.08), 100) // E5
    setTimeout(() => playSound(783.99, 0.3, "sine", 0.06), 200) // G5
  }

  const playErrorSound = () => {
    // Gentle buzz sound
    playSound(200, 0.3, "sawtooth", 0.05)
  }

  const playHintSound = () => {
    // Soft notification sound
    playSound(800, 0.1, "sine", 0.04)
    setTimeout(() => playSound(1000, 0.1, "sine", 0.03), 150)
  }

  const playLevelCompleteSound = () => {
    // Victory fanfare
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    notes.forEach((note, index) => {
      setTimeout(() => playSound(note, 0.4, "sine", 0.08), index * 150)
    })
  }

  return {
    playSuccessSound,
    playErrorSound,
    playHintSound,
    playLevelCompleteSound,
  }
}
