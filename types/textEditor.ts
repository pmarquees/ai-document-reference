export type ElementType = "text" | "header" | "subheader" | "image" | "file" | "report" | "workflow" | "card" | "list"

export interface TextEditorElement {
  id: string
  type: ElementType
  content: string
}

