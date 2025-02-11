"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, FileText } from "lucide-react"

interface Document {
  id: string
  title: string
  content: string
}

interface DocumentsPanelProps {
  currentContent: string
  onNewDocument: () => void
  onLoadDocument: (content: string) => void
}

const STORAGE_KEY = 'ai-text-editor-documents'

export function DocumentsPanel({ currentContent, onNewDocument, onLoadDocument }: DocumentsPanelProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [documentTitle, setDocumentTitle] = useState("")
  const [activeDocId, setActiveDocId] = useState<string | null>(null)

  // Load documents from localStorage on mount
  useEffect(() => {
    const savedDocs = localStorage.getItem(STORAGE_KEY)
    if (savedDocs) {
      setDocuments(JSON.parse(savedDocs))
    }
  }, [])

  // Save documents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents))
  }, [documents])

  const saveDocument = (title?: string) => {
    const finalTitle = title?.trim() || `Document ${documents.length + 1}`

    const newDocument: Document = {
      id: Date.now().toString(),
      title: finalTitle,
      content: currentContent
    }

    setDocuments([...documents, newDocument])
    setDocumentTitle("")
    setActiveDocId(newDocument.id)
    return newDocument
  }

  const handleNewDocument = () => {
    if (currentContent.trim()) {
      saveDocument()
    }
    setActiveDocId(null)
    onNewDocument()
  }

  const handleLoadDocument = (doc: Document) => {
    setActiveDocId(doc.id)
    onLoadDocument(doc.content)
  }

  const handleSaveCurrentDocument = () => {
    if (activeDocId) {
      // Update existing document
      setDocuments(documents.map(doc => 
        doc.id === activeDocId 
          ? { ...doc, content: currentContent }
          : doc
      ))
    } else {
      // Save as new document
      saveDocument(documentTitle)
    }
  }

  return (
    <div className="w-64 border-l p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">DOCUMENTS</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleNewDocument}
          >
            NEW
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSaveCurrentDocument}
          >
            SAVE
          </Button>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Document title..."
          value={documentTitle}
          onChange={(e) => setDocumentTitle(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {documents.map((doc) => (
          <Button
            key={doc.id}
            variant="ghost"
            className={`w-full justify-start mb-2 text-left gap-2 ${
              activeDocId === doc.id ? 'bg-secondary' : ''
            }`}
            onClick={() => handleLoadDocument(doc)}
          >
            <FileText className="h-4 w-4" />
            {doc.title}
          </Button>
        ))}
      </div>
    </div>
  )
} 