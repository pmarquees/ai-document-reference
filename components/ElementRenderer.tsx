import type { TextEditorElement } from "../types/textEditor"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface ElementRendererProps {
  element: TextEditorElement
  updateElement: (id: string, content: string) => void
  deleteElement: (id: string) => void
}

export function ElementRenderer({ element, updateElement, deleteElement }: ElementRendererProps) {
  const renderElement = () => {
    switch (element.type) {
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
              <img src={element.content || "/placeholder.svg"} alt="Uploaded" className="mt-2 max-w-full h-auto" />
            )}
          </div>
        )
      // Implement other element types here
      default:
        return <div>Unsupported element type: {element.type}</div>
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

