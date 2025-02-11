import { Input } from "@/components/ui/input"

interface DocumentTitleProps {
  title: string
  onTitleChange: (title: string) => void
}

export function DocumentTitle({ title, onTitleChange }: DocumentTitleProps) {
  return (
    <div className="p-4 border-b">
      <Input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="text-2xl font-bold"
        placeholder="Enter document title"
      />
    </div>
  )
}

