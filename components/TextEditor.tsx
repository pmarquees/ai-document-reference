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
import { CommandMenu } from "./CommandMenu"
import { AIChat } from "./AIChat"
import type { ElementType, TextEditorElement } from "../types/textEditor"
import { HelpCircle } from "lucide-react"
import { HelpModal } from "./HelpModal"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { OnboardingModal } from "./OnboardingModal"

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
  const [helpModalOpen, setHelpModalOpen] = useState(false)
  const [onboardingOpen, setOnboardingOpen] = useState(false)

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

  // Add this useEffect for the keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setAiChatOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
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
      <div className="flex h-screen relative bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
        <div className="flex-1 flex flex-col overflow-hidden">
          <motion.h1 
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 p-6 cursor-pointer hover:opacity-80 transition-opacity"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setOnboardingOpen(true)}
          >
            P&D Docs
          </motion.h1>
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

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-white/50 backdrop-blur-sm dark:bg-zinc-800/50"
            onClick={() => setHelpModalOpen(true)}
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </motion.div>

        <HelpModal 
          open={helpModalOpen} 
          onClose={() => setHelpModalOpen(false)} 
        />

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

        <OnboardingModal 
          open={onboardingOpen}
          onClose={() => setOnboardingOpen(false)}
        />
      </div>
    </DndContext>
  )
}

