"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface HelpModalProps {
  open: boolean
  onClose: () => void
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>AI Text Editor Features</DialogTitle>
          <DialogDescription>
            A comprehensive guide to all features
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="font-semibold mb-2">Document Management</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create new documents with the NEW button</li>
                <li>Auto-saving of all documents</li>
                <li>Edit document titles by clicking on them</li>
                <li>Delete documents using the trash icon (appears on hover)</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">Editor Features</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Rich text formatting toolbar</li>
                <li>Text alignment options</li>
                <li>Font styles and colors</li>
                <li>Lists and bullet points</li>
                <li>Undo/Redo functionality</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">AI Integration</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access AI features with CMD + / or the command menu</li>
                <li>Reference existing documents using @ in AI prompts</li>
                <li>Generate text based on your prompts</li>
                <li>Insert AI-generated content directly into your document</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">Keyboard Shortcuts</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><kbd>CMD</kbd> + <kbd>/</kbd> - Open command menu</li>
                <li><kbd>CMD</kbd> + <kbd>B</kbd> - Bold text</li>
                <li><kbd>CMD</kbd> + <kbd>I</kbd> - Italic text</li>
                <li><kbd>CMD</kbd> + <kbd>U</kbd> - Underline text</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">Command Menu</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Quick access to common actions</li>
                <li>Add new elements (headings, paragraphs, lists)</li>
                <li>Access PersonioAI features</li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 