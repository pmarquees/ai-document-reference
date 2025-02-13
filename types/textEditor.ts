export type ElementType = {
  type: 'heading' | 'paragraph' | 'list'
  // ... other properties
}

export interface TextEditorElement {
  id: string
  type: ElementType
  content: string
}

