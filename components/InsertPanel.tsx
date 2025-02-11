"use client"

import { useState } from "react"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { ElementType } from "../types/textEditor"
import { Image, Type, Heading2, FileText } from "lucide-react"

const elements: { type: ElementType; label: string; icon: React.ElementType }[] = [
  { type: "text", label: "Text", icon: Type },
  { type: "header", label: "Header", icon: Heading2 },
  { type: "subheader", label: "Subheader", icon: Heading2 },
  { type: "image", label: "Image", icon: Image },
  { type: "file", label: "File", icon: FileText },
]

function DraggableElement({ 
  type, 
  label, 
  icon: Icon, 
  onInsert 
}: { 
  type: ElementType; 
  label: string; 
  icon: React.ElementType;
  onInsert: (type: ElementType) => void;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${type}`,
    data: { type },
  })

  const style = transform
    ? {
        transform: CSS.Transform.toString(transform),
      }
    : undefined

  return (
    <Button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      variant="ghost"
      className="w-full mb-2 justify-start gap-2 cursor-move"
      style={style}
      onClick={() => onInsert(type)}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  )
}

interface InsertPanelProps {
  onInsert: (type: ElementType) => void
}

export function InsertPanel({ onInsert }: InsertPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredElements = elements.filter((element) => 
    element.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-64 border-l p-4 flex flex-col h-full">
      <Input
        type="text"
        placeholder="Search elements..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="flex-1 overflow-y-auto">
        {filteredElements.map((element) => (
          <DraggableElement 
            key={element.type} 
            {...element}
            onInsert={onInsert}
          />
        ))}
      </div>
    </div>
  )
}

