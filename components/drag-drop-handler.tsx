"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"

interface DragDropHandlerProps {
  children: React.ReactNode
  onDrop: (itemId: string) => void
  className?: string
}

interface DraggableItemProps {
  children: React.ReactNode
  itemId: string
  onDragStart: (itemId: string) => void
  onDragEnd: () => void
  disabled?: boolean
  className?: string
  isHinted?: boolean
}

// Enhanced drag and drop with touch support and accessibility
export function DraggableItem({
  children,
  itemId,
  onDragStart,
  onDragEnd,
  disabled = false,
  className = "",
  isHinted = false,
}: DraggableItemProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const dragRef = useRef<HTMLDivElement>(null)

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      if (disabled) {
        e.preventDefault()
        return
      }
      setIsDragging(true)
      onDragStart(itemId)
      e.dataTransfer.effectAllowed = "move"
      e.dataTransfer.setData("text/plain", itemId)
    },
    [disabled, itemId, onDragStart],
  )

  const handleDragEnd = useCallback(
    (e: React.DragEvent) => {
      setIsDragging(false)
      onDragEnd()
    },
    [onDragEnd],
  )

  // Touch support for mobile devices
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return
      const touch = e.touches[0]
      setTouchStart({ x: touch.clientX, y: touch.clientY })
      setIsDragging(true)
      onDragStart(itemId)
    },
    [disabled, itemId, onDragStart],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart || disabled) return
      e.preventDefault() // Prevent scrolling while dragging
    },
    [touchStart, disabled],
  )

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart || disabled) return

      const touch = e.changedTouches[0]
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
      const dropZone = elementBelow?.closest('[data-drop-zone="true"]')

      if (dropZone) {
        // Trigger drop event
        const dropEvent = new CustomEvent("touchdrop", {
          detail: { itemId, dropZone },
        })
        dropZone.dispatchEvent(dropEvent)
      }

      setTouchStart(null)
      setIsDragging(false)
      onDragEnd()
    },
    [touchStart, disabled, itemId, onDragEnd],
  )

  // Keyboard support for accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        // Find the drop zone and simulate drop
        const dropZone = document.querySelector('[data-drop-zone="true"]')
        if (dropZone) {
          const dropEvent = new CustomEvent("keyboarddrop", {
            detail: { itemId },
          })
          dropZone.dispatchEvent(dropEvent)
        }
      }
    },
    [disabled, itemId],
  )

  return (
    <div
      ref={dragRef}
      draggable={!disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={`Draggable item ${itemId}. Press Enter or Space to add to emergency kit.`}
      className={`
        ${className}
        ${isDragging ? "opacity-50 scale-95" : ""}
        ${isHinted ? "ring-2 ring-primary animate-pulse" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-grab active:cursor-grabbing"}
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
      `}
    >
      {children}
    </div>
  )
}

export function DropZone({ children, onDrop, className = "" }: DragDropHandlerProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (dropRef.current && !dropRef.current.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const itemId = e.dataTransfer.getData("text/plain")
      if (itemId) {
        onDrop(itemId)
      }
    },
    [onDrop],
  )

  // Handle touch and keyboard drops
  const handleCustomDrop = useCallback(
    (e: CustomEvent) => {
      const { itemId } = e.detail
      if (itemId) {
        onDrop(itemId)
      }
    },
    [onDrop],
  )

  // Add event listeners for custom drop events
  const dropZoneRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (dropRef.current) {
        dropRef.current.removeEventListener("touchdrop", handleCustomDrop as EventListener)
        dropRef.current.removeEventListener("keyboarddrop", handleCustomDrop as EventListener)
      }

      dropRef.current = node

      if (node) {
        node.addEventListener("touchdrop", handleCustomDrop as EventListener)
        node.addEventListener("keyboarddrop", handleCustomDrop as EventListener)
      }
    },
    [handleCustomDrop],
  )

  return (
    <div
      ref={dropZoneRef}
      data-drop-zone="true"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="region"
      aria-label="Emergency kit drop zone. Drag items here or use keyboard navigation."
      className={`
        ${className}
        ${isDragOver ? "scale-105 bg-primary/20" : ""}
        transition-all duration-200
      `}
    >
      {children}
    </div>
  )
}
