"use client"

import { useEffect, useRef } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import type { ElementType } from "../types/textEditor"
import { Type, Heading2, FileText, Sparkles } from "lucide-react"

interface CommandMenuProps {
  open: boolean
  onClose: () => void
  onStyleSelect: (style: 'text' | 'header' | 'subheader') => void
  onPersonioAI: () => void
  position: { x: number; y: number }
}

const styles = [
  {
    heading: "Styles",
    items: [
      { type: 'text' as const, label: "Normal Text", icon: Type },
      { type: 'header' as const, label: "Header", icon: Heading2 },
      { type: 'subheader' as const, label: "Subheader", icon: Heading2 },
    ],
  }
]

export function CommandMenu({ open, onClose, onStyleSelect, onPersonioAI, position }: CommandMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  if (!open) return null

  return (
    <div
      ref={ref}
      className="fixed z-50"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      <Command className="rounded-lg border shadow-md w-[280px] bg-white">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem className="flex items-center gap-2 cursor-pointer" onSelect={onPersonioAI}>
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">PersonioAI</span>
            </CommandItem>
          </CommandGroup>
          {styles.map((group) => (
            <CommandGroup key={group.heading} heading={group.heading}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.type}
                  onSelect={() => {
                    onStyleSelect(item.type)
                    onClose()
                  }}
                  className="flex items-center gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </div>
  )
}

