"use client"

import { Command } from "cmdk"
import { type ElementType } from "../types/textEditor"
import { Bot } from "lucide-react"

interface CommandMenuProps {
  open: boolean
  onClose: () => void
  onSelect: (type: ElementType) => void
  onPersonioAI: () => void
  position: { x: number; y: number }
}

export function CommandMenu({ open, onClose, onSelect, onPersonioAI, position }: CommandMenuProps) {
  if (!open) return null

  return (
    <div
      className="fixed z-50 bg-background border rounded-lg shadow-lg overflow-hidden w-64"
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      <Command className="border-none [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
        <Command.Input
          autoFocus
          placeholder="Type a command..."
          className="w-full border-none focus:outline-none px-3 py-2"
        />
        <Command.List>
          <Command.Group heading="Insert">
            <Command.Item
              onSelect={() => onSelect("heading")}
              className="px-2 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              Add Heading
            </Command.Item>
            <Command.Item
              onSelect={() => onSelect("paragraph")}
              className="px-2 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              Add Paragraph
            </Command.Item>
            <Command.Item
              onSelect={() => onSelect("list")}
              className="px-2 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              Add List
            </Command.Item>
          </Command.Group>
          <Command.Group heading="AI">
            <Command.Item
              onSelect={onPersonioAI}
              className="px-2 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              PersonioAI
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  )
}

