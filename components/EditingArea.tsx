"use client"

import { useCallback, useEffect } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import { DocumentsPanel } from "./DocumentsPanel"
import { EditorToolbar } from "./EditorToolbar"

interface EditingAreaProps {
  editableContent: string
  onEditableContentChange: (content: string) => void
  onShowCommandMenu: (x: number, y: number) => void
}

export function EditingArea({
  editableContent,
  onEditableContentChange,
  onShowCommandMenu,
}: EditingAreaProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      FontFamily,
      TextStyle,
      Color,
      Highlight,
      Underline,
    ],
    content: editableContent,
    onUpdate: ({ editor }) => {
      onEditableContentChange(editor.getHTML())
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === "/") {
          event.preventDefault()
          const { from } = view.state.selection
          const coords = view.coordsAtPos(from)
          onShowCommandMenu(coords.left, coords.bottom)
          return true
        }
        return false
      },
    },
  })

  useEffect(() => {
    if (editor && editor.getHTML() !== editableContent) {
      editor.commands.setContent(editableContent)
    }
  }, [editor, editableContent])

  const handleNewDocument = useCallback(() => {
    onEditableContentChange("")
  }, [onEditableContentChange])

  const handleLoadDocument = useCallback((content: string) => {
    onEditableContentChange(content)
  }, [onEditableContentChange])

  return (
    <div className="flex flex-1">
      <div className="flex-1 flex flex-col max-h-[calc(100vh-4rem)]">
        <EditorToolbar editor={editor} />
        <div className="flex-1 overflow-y-auto p-4">
          <EditorContent 
            editor={editor} 
            className="min-h-[1em] focus:outline-none prose max-w-none"
          />
        </div>
      </div>
      <DocumentsPanel 
        currentContent={editableContent} 
        onNewDocument={handleNewDocument}
        onLoadDocument={handleLoadDocument}
      />
    </div>
  )
}

