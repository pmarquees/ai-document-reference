import { useEffect } from 'react'

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title ? `${title} - AI Text Editor` : 'AI Text Editor'

    return () => {
      document.title = previousTitle
    }
  }, [title])
} 