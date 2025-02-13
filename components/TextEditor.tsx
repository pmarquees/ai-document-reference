"use client"

import { useState, useEffect } from "react"
import {
  DndContext,
  type DragEndEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { DocumentTitle } from "./DocumentTitle"
import { EditingArea } from "./EditingArea"
import { InsertPanel } from "./InsertPanel"
import { CommandMenu } from "./CommandMenu"
import { AIChat } from "./AIChat"
import type { ElementType, TextEditorElement } from "../types/textEditor"

const STORAGE_KEY = 'ai-text-editor-documents'

interface Document {
  id: string
  title: string
  content: string
  lastModified: number
}

export function TextEditor() {
  const [elements, setElements] = useState<TextEditorElement[]>([])  // Initialize as empty array
  const [documentTitle, setDocumentTitle] = useState("Untitled Document")
  const [commandMenuOpen, setCommandMenuOpen] = useState(false)
  const [commandMenuPosition, setCommandMenuPosition] = useState({ x: 0, y: 0 })
  const [aiChatOpen, setAiChatOpen] = useState(false)
  const [editableContent, setEditableContent] = useState("")
  const [documents, setDocuments] = useState<Document[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Load documents on mount
  useEffect(() => {
    const savedDocs = localStorage.getItem(STORAGE_KEY)
    if (savedDocs) {
      setDocuments(JSON.parse(savedDocs))
    }
  }, [])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    if (active.id.toString().startsWith("draggable-")) {
      // Handle dropping from sidebar
      const type = active.data.current?.type as ElementType
      if (type) {
        addElement(type)
      }
    } else if (active.id !== over.id) {
      // Handle reordering existing elements
      setElements((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const addElement = (type: ElementType) => {
    const newElement: TextEditorElement = {
      id: `element-${Date.now()}`,
      type,
      content: "",
    }
    setElements([...elements, newElement])
  }

  const updateElement = (id: string, content: string) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, content } : el)))
  }

  const deleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id))
  }

  const handleShowCommandMenu = (x: number, y: number) => {
    setCommandMenuPosition({ x, y })
    setCommandMenuOpen(true)
  }

  const handlePersonioAI = () => {
    setCommandMenuOpen(false)
    setAiChatOpen(true)
  }

  const handleInsertAIText = (text: string) => {
    setEditableContent((prevContent) => prevContent + text)
    setAiChatOpen(false)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col overflow-hidden">
          <DocumentTitle title={documentTitle} onTitleChange={setDocumentTitle} />
          <SortableContext items={elements} strategy={verticalListSortingStrategy}>
            <EditingArea
              elements={elements}
              updateElement={updateElement}
              deleteElement={deleteElement}
              onShowCommandMenu={handleShowCommandMenu}
              editableContent={editableContent}
              onEditableContentChange={setEditableContent}
            />
          </SortableContext>
        </div>
        <InsertPanel onInsert={addElement} />
      </div>

      {commandMenuOpen && (
        <CommandMenu
          open={commandMenuOpen}
          onClose={() => setCommandMenuOpen(false)}
          onSelect={(type) => {
            addElement(type)
            setCommandMenuOpen(false)
          }}
          onPersonioAI={handlePersonioAI}
          position={commandMenuPosition}
        />
      )}

      {aiChatOpen && (
        <AIChat 
          onClose={() => setAiChatOpen(false)} 
          onInsertText={handleInsertAIText} 
          documents={documents}
        />
      )}
    </DndContext>
  )
}

