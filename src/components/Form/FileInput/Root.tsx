'use client'

import {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useId,
  useState,
} from 'react'

export type RootProps = ComponentProps<'div'> & {
  multiple?: boolean
  onValueChange?: (files: File[]) => void
  value?: File[]
}

type FileInputContextType = {
  id: string
  files: File[]
  onFilesSelected: (files: File[]) => void
  handleDeleteFile: (index: number) => void
  multiple: boolean
}

const FileInputContext = createContext({} as FileInputContextType)

export function Root({
  multiple = false,
  value = [],
  onValueChange,
  ...props
}: RootProps) {
  const id = useId()
  const [files, setFiles] = useState<File[]>(value)

  useEffect(() => {
    onValueChange?.(files)
  }, [files, onValueChange])

  function onFilesSelected(files: File[]) {
    setFiles((prevState) => {
      if (multiple) {
        return [...prevState, ...files]
      } else {
        return files
      }
    })
  }

  function handleDeleteFile(index: number) {
    setFiles((state) => {
      const newState = [...state]
      newState.splice(index, 1)
      return newState
    })
  }

  return (
    <FileInputContext.Provider
      value={{
        id,
        files,
        onFilesSelected,
        handleDeleteFile,
        multiple,
      }}
    >
      <div {...props} />
    </FileInputContext.Provider>
  )
}

export const useFileInput = () => useContext(FileInputContext)
