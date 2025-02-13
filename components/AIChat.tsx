"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import type React from "react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Document {
  id: string
  title: string
  content: string
  lastModified: number
}

interface AIChatProps {
  onClose: () => void
  onInsertText: (text: string) => void
  documents: Document[]
}

export function AIChat({ onClose, onInsertText, documents }: AIChatProps) {
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [suggestionQuery, setSuggestionQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setPrompt(newValue)
    
    // Check if we should show document suggestions
    const cursorPos = e.target.selectionStart || 0
    const textBeforeCursor = newValue.slice(0, cursorPos)
    const match = textBeforeCursor.match(/@([^@\s]*)$/)
    
    if (match) {
      setShowSuggestions(true)
      setCursorPosition(cursorPos)
      setSuggestionQuery(match[1].toLowerCase())
    } else {
      setShowSuggestions(false)
    }
  }

  const handleDocumentSelect = (doc: Document) => {
    const beforeAt = prompt.slice(0, cursorPosition).lastIndexOf('@')
    const newPrompt = prompt.slice(0, beforeAt) + 
                     `@${doc.title} ` + 
                     prompt.slice(cursorPosition)
    
    setPrompt(newPrompt)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Replace @document references with actual content
    let processedPrompt = prompt
    const docRefs = prompt.match(/@([^@\s]+)/g) || []
    
    for (const ref of docRefs) {
      const docTitle = ref.slice(1) // Remove @
      const doc = documents.find(d => d.title === docTitle)
      if (doc) {
        processedPrompt = processedPrompt.replace(ref, `Content of "${docTitle}":\n${doc.content}\n`)
      }
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: processedPrompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate text")
      }

      const data = await response.json()
      setResponse(data.text)
    } catch (error) {
      console.error("Error generating text:", error)
      setResponse("An error occurred while generating the response.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[400px] max-h-[80vh] flex flex-col fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          PersonioAI
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <form onSubmit={handleSubmit} className="relative h-full flex flex-col">
          <Input
            ref={inputRef}
            value={prompt}
            onChange={handleInputChange}
            placeholder="Enter your prompt... Use @ to reference documents"
            className="mb-2"
          />
          {showSuggestions && documents.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-popover border rounded-md shadow-md z-50 max-h-[200px] overflow-y-auto">
              <Command>
                <CommandList>
                  <CommandEmpty>No documents found</CommandEmpty>
                  <CommandGroup heading="Documents">
                    {documents
                      .filter(doc => 
                        doc.title.toLowerCase().includes(suggestionQuery.toLowerCase())
                      )
                      .map(doc => (
                        <button
                          key={doc.id}
                          onClick={(e) => {
                            e.preventDefault()
                            handleDocumentSelect(doc)
                          }}
                          className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                        >
                          {doc.title}
                        </button>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          )}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Generating..." : "Generate"}
          </Button>
          {response && (
            <div className="mt-4 flex-1 overflow-y-auto">
              <h3 className="font-semibold mb-2">Response:</h3>
              <p className="text-sm whitespace-pre-wrap">{response}</p>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={() => onInsertText(response)} disabled={!response}>
          Insert Text
        </Button>
      </CardFooter>
    </Card>
  )
}

