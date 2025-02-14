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
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { motion, AnimatePresence } from "framer-motion"

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

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="w-full max-w-xl mx-4"
        >
          <Card className="h-[500px] flex flex-col shadow-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-700">
            <CardHeader className="border-b border-zinc-200 dark:border-zinc-700 shrink-0">
              <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Personio AI
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4">
              <form onSubmit={handleSubmit} className="h-full flex flex-col gap-4">
                <div className="shrink-0">
                  <Input
                    ref={inputRef}
                    value={prompt}
                    onChange={handleInputChange}
                    placeholder="Enter your prompt... Use @ to reference documents"
                    className="bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-purple-500"
                  />
                  {showSuggestions && documents.length > 0 && (
                    <div className="absolute mt-1 w-full bg-popover border rounded-md shadow-md z-50 max-h-[200px] overflow-y-auto">
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
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="shrink-0"
                >
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    {isLoading ? "Generating..." : "Generate"}
                  </Button>
                </motion.div>
                {response && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 overflow-y-auto"
                  >
                    <h3 className="font-semibold mb-2">Response:</h3>
                    <p className="text-sm whitespace-pre-wrap">{response}</p>
                  </motion.div>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-zinc-200 dark:border-zinc-700 p-4 shrink-0">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Close
              </Button>
              <Button
                onClick={() => onInsertText(response)}
                disabled={!response}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Insert Text
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

