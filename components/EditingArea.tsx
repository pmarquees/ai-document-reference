"use client"

import type React from "react"
import { useRef, useCallback, useEffect } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { TextEditorElement } from "../types/textEditor"
import { ElementRenderer } from "./ElementRenderer"
import { DocumentsPanel } from "./DocumentsPanel"

interface EditingAreaProps {
  elements: TextEditorElement[]
  updateElement: (id: string, content: string) => void
  deleteElement: (id: string) => void
  onShowCommandMenu: (x: number, y: number) => void
  editableContent: string
  onEditableContentChange: (content: string) => void
}

export function EditingArea({
  elements,
  updateElement,
  deleteElement,
  onShowCommandMenu,
  editableContent,
  onEditableContentChange,
}: EditingAreaProps) {
  const editableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.textContent = editableContent
    }
  }, [editableContent])

  const handleInput = useCallback(() => {
    if (editableRef.current) {
      onEditableContentChange(editableRef.current.textContent || '')
    }
  }, [onEditableContentChange])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault()
        const selection = window.getSelection()
        const range = selection?.getRangeAt(0)
        if (range) {
          const rect = range.getBoundingClientRect()
          onShowCommandMenu(rect.left, rect.bottom)
        }
      }
    },
    [onShowCommandMenu],
  )

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      editableRef.current?.focus()
    }
  }

  const handleNewDocument = useCallback(() => {
    onEditableContentChange("")  // Clear the content
  }, [onEditableContentChange])

  const handleLoadDocument = useCallback((content: string) => {
    onEditableContentChange(content)
  }, [onEditableContentChange])

  return (
    <div className="flex flex-1">
      <div 
        className="flex-1 overflow-y-auto p-4" 
        onClick={handleContainerClick}
      >
        {elements.map((element) => (
          <SortableElement
            key={element.id}
            element={element}
            updateElement={updateElement}
            deleteElement={deleteElement}
          />
        ))}
        <div
          ref={editableRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className="min-h-[1em] focus:outline-none cursor-text whitespace-pre-wrap"
        />
      </div>
      <DocumentsPanel 
        currentContent={editableContent} 
        onNewDocument={handleNewDocument}
        onLoadDocument={handleLoadDocument}
      />
    </div>
  )
}

interface SortableElementProps {
  element: TextEditorElement
  updateElement: (id: string, content: string) => void
  deleteElement: (id: string) => void
}

function SortableElement({ element, updateElement, deleteElement }: SortableElementProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: element.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ElementRenderer element={element} updateElement={updateElement} deleteElement={deleteElement} />
    </div>
  )
}

