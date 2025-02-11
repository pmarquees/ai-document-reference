"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import type React from "react"

interface AIChatProps {
  onClose: () => void
  onInsertText: (text: string) => void
}

export function AIChat({ onClose, onInsertText }: AIChatProps) {
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
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
    <Card className="w-[400px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          PersonioAI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt..."
            className="mb-2"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </form>
        {response && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Response:</h3>
            <p className="text-sm">{response}</p>
          </div>
        )}
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

