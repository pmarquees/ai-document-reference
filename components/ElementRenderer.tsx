import type { TextEditorElement } from "../types/textEditor"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Image from 'next/image'

interface ElementRendererProps {
  element: TextEditorElement
  updateElement: (id: string, content: string) => void
  deleteElement: (id: string) => void
}

export function ElementRenderer({ element, updateElement, deleteElement }: ElementRendererProps) {
  const renderElement = () => {
    switch (element.type.type) {
      case 'heading':
        return (
          <h2 className="text-2xl font-bold">
            {element.content}
          </h2>
        )
      case 'paragraph':
        return (
          <p className="text-base">
            {element.content}
          </p>
        )
      case 'list':
        return (
          <ul className="list-disc list-inside">
            {element.content.split('\n').map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )
      case "text":
        return (
          <Textarea
            value={element.content}
            onChange={(e) => updateElement(element.id, e.target.value)}
            placeholder="Enter text"
            className="w-full"
          />
        )
      case "header":
        return (
          <Input
            type="text"
            value={element.content}
            onChange={(e) => updateElement(element.id, e.target.value)}
            placeholder="Enter header"
            className="text-2xl font-bold w-full"
          />
        )
      case "subheader":
        return (
          <Input
            type="text"
            value={element.content}
            onChange={(e) => updateElement(element.id, e.target.value)}
            placeholder="Enter subheader"
            className="text-xl font-semibold w-full"
          />
        )
      case "image":
        return (
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    updateElement(element.id, e.target?.result as string)
                  }
                  reader.readAsDataURL(file)
                }
              }}
            />
            {element.content && (
              <Image 
                src={element.content} 
                alt="Uploaded content"
                width={500}
                height={300}
                className="max-w-full h-auto"
              />
            )}
          </div>
        )
      // Implement other element types here
      default:
        return <div>Unsupported element type: {element.type.type}</div>
    }
  }

  return (
    <div className="mb-4 p-2 border rounded">
      {renderElement()}
      <Button onClick={() => deleteElement(element.id)} variant="destructive" size="sm" className="mt-2">
        Delete
      </Button>
    </div>
  )
}

