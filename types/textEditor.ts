export type ElementType = {
  type: 'heading' | 'paragraph' | 'list' | 'text' | 'header' | 'subheader' | 'image'
  // ... other properties
}

export interface TextEditorElement {
  id: string
  type: ElementType
  content: string
}

