'use client'

import { User } from 'lucide-react'
import { useFileInput } from './Root'
import { useMemo } from 'react'

interface ImagePreviewProps {
  onClick?: () => void; // Adicione a propriedade onClick
  className?: string
}

export function ImagePreview({ onClick }: ImagePreviewProps) {
  const { multiple, files } = useFileInput()

  if (multiple) {
    throw new Error(
      'Cannot use <ImagePreview /> component alongside multiple file upload input.',
    )
  }

  const previewURL = useMemo(() => {
    if (files.length === 0) {
      return null
    }

    return URL.createObjectURL(files[0])
  }, [files])

  if (previewURL === null) {
    return (
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 dark:bg-zinc-800 cursor-pointer"
        onClick={onClick} // Repasse o onClick para o div
      >
        <User className="h-8 w-8 text-violet-500 dark:text-violet-300" />
      </div>
    )
  } else {
    return (
      <img
        className="h-16 w-16 rounded-full bg-violet-50 object-cover dark:bg-zinc-800 cursor-pointer"
        src={previewURL}
        alt=""
        onClick={onClick} // Repasse o onClick para o img
      />
    )
  }
}