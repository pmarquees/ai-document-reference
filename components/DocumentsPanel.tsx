"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter, usePathname } from "next/navigation"
import { useDocumentTitle } from "@/hooks/useDocumentTitle"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Document {
  id: string
  title: string
  content: string
  lastModified: number
}

interface DocumentsPanelProps {
  currentContent: string
  onNewDocument: () => void
  onLoadDocument: (content: string) => void
  onTitleChange?: (title: string) => void
}

const STORAGE_KEY = 'ai-text-editor-documents'

export function DocumentsPanel({ 
  currentContent, 
  onNewDocument, 
  onLoadDocument,
  onTitleChange 
}: DocumentsPanelProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [documents, setDocuments] = useState<Document[]>([])
  const [activeDocId, setActiveDocId] = useState<string | null>(null)
  const [activeTitle, setActiveTitle] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null)

  // Set document title
  useDocumentTitle(activeTitle)

  // Load documents and set active document from URL
  useEffect(() => {
    const savedDocs = localStorage.getItem(STORAGE_KEY)
    if (savedDocs) {
      const docs = JSON.parse(savedDocs)
      setDocuments(docs)
      
      // Check URL for document ID
      const docId = pathname.split('/').pop()
      if (docId && docId !== 'docs') {
        const doc = docs.find((d: Document) => d.id === docId)
        if (doc) {
          setActiveDocId(doc.id)
          setActiveTitle(doc.title)
          onLoadDocument(doc.content)
          onTitleChange?.(doc.title)
        }
      }
    }
  }, [pathname, onLoadDocument, onTitleChange])

  // Save active document when content changes
  useEffect(() => {
    if (activeDocId && currentContent !== undefined) {
      setDocuments(prev => {
        const updated = prev.map(doc => 
          doc.id === activeDocId 
            ? { ...doc, content: currentContent, lastModified: Date.now() }
            : doc
        )
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        return updated
      })
    }
  }, [currentContent, activeDocId])

  const createNewDocument = () => {
    // Save current document first
    if (activeDocId && currentContent) {
      const updatedDocs = documents.map(doc => 
        doc.id === activeDocId 
          ? { ...doc, content: currentContent, lastModified: Date.now() }
          : doc
      )
      setDocuments(updatedDocs)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDocs))
    }

    // Create and save new document
    const newTitle = `Untitled ${documents.length + 1}`
    const newDoc: Document = {
      id: Date.now().toString(),
      title: newTitle,
      content: '',
      lastModified: Date.now()
    }

    const newDocs = [...documents, newDoc]
    setDocuments(newDocs)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newDocs))
    
    // Update state and navigate
    setActiveDocId(newDoc.id)
    setActiveTitle(newTitle)
    onLoadDocument('')
    onTitleChange?.(newTitle)
    router.push(`/docs/${newDoc.id}`)
  }

  const handleLoadDocument = (doc: Document) => {
    // Save current document before switching
    if (activeDocId && currentContent) {
      const updatedDocs = documents.map(d => 
        d.id === activeDocId 
          ? { ...d, content: currentContent, lastModified: Date.now() }
          : d
      )
      setDocuments(updatedDocs)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDocs))
    }

    // Load selected document
    setActiveDocId(doc.id)
    setActiveTitle(doc.title)
    onLoadDocument(doc.content)
    onTitleChange?.(doc.title)
    router.push(`/docs/${doc.id}`)
  }

  const updateDocumentTitle = (id: string, newTitle: string) => {
    const updatedDocs = documents.map(doc => 
      doc.id === id 
        ? { ...doc, title: newTitle, lastModified: Date.now() }
        : doc
    )
    setDocuments(updatedDocs)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDocs))
    
    // Update document title in header and browser tab if this is the active document
    if (id === activeDocId) {
      setActiveTitle(newTitle)
      onTitleChange?.(newTitle)
    }
  }

  const handleDeleteDocument = (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent document selection when clicking delete
    setDocumentToDelete(doc)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!documentToDelete) return

    const newDocs = documents.filter(doc => doc.id !== documentToDelete.id)
    setDocuments(newDocs)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newDocs))

    // If we're deleting the active document, load another one or create new
    if (documentToDelete.id === activeDocId) {
      const nextDoc = newDocs[0]
      if (nextDoc) {
        handleLoadDocument(nextDoc)
      } else {
        createNewDocument()
      }
    }

    setDeleteDialogOpen(false)
    setDocumentToDelete(null)
  }

  return (
    <div className="w-64 border-l p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">DOCUMENTS</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={createNewDocument}
        >
          NEW
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {documents
          .sort((a, b) => b.lastModified - a.lastModified)
          .map((doc) => (
            <div 
              key={doc.id} 
              className="mb-2 group relative"
            >
              <Input
                value={doc.title}
                onChange={(e) => updateDocumentTitle(doc.id, e.target.value)}
                onBlur={(e) => {
                  const newTitle = e.target.value.trim() || `Untitled ${documents.length}`
                  updateDocumentTitle(doc.id, newTitle)
                }}
                className={`w-full text-left pr-8 ${
                  activeDocId === doc.id ? 'bg-secondary' : ''
                }`}
                onClick={() => handleLoadDocument(doc)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity h-full aspect-square p-1 hover:bg-destructive hover:text-destructive-foreground"
                onClick={(e) => handleDeleteDocument(doc, e)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{documentToDelete?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 