'use client'

import {
  ComponentProps,
  createContext,
  useContext,
  useId,
  useMemo,
  useState,
  ChangeEvent,
  forwardRef,
  useEffect,
} from 'react'

import { Trash2 } from 'lucide-react'

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

  function onFilesSelected(files: File[]) {
    setFiles((prevState) => {
      if (multiple) {
        return [...prevState, ...files]
      } else {
        return files
      }
    })
  }

  useEffect(() => {
    onValueChange?.(files)
  }, [files, onValueChange])

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

export function Trigger() {
  const { id } = useFileInput()

  return (
    <label
      htmlFor={id}
      className="flex w-full flex-1 cursor-pointer flex-col items-center gap-3 rounded-lg border border-zinc-200 px-6 py-4 text-center text-zinc-500 "
    >
      Selecionar arquivos
    </label>
  )
}

export type ControlProps = Omit<ComponentProps<'input'>, 'multiple'> & {
  // onChange: (files: File[]) => void
}

export const Control = forwardRef<HTMLInputElement, ControlProps>(
  ({ onChange, ...props }, ref) => {
    const { id, onFilesSelected, multiple } = useFileInput()

    function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
      if (!event.target.files?.length) {
        return
      }

      const newFiles = Array.from(event.target.files)
      if (onChange) onChange(event)
      onFilesSelected(newFiles)
    }

    return (
      <input
        ref={ref}
        type="file"
        className="sr-only"
        id={id}
        onChange={handleFilesSelected}
        multiple={multiple}
        {...props}
      />
    )
  },
)

Control.displayName = 'Control'

export interface FileItemProps {
  name: string
  size: number
  type: string
  handleDeleteFile: () => void
}

export function FileItem({
  name,
  size,
  type,
  handleDeleteFile,
}: FileItemProps) {
  const fileSize = useMemo(() => {
    const fileSizeInKB = size / 1024

    if (fileSizeInKB > 1024) {
      const fileSizeInMB = fileSizeInKB / 1024

      return fileSizeInMB.toFixed(1).concat(' MB')
    }

    return fileSizeInKB.toFixed(1).concat(' KB')
  }, [size])

  return (
    <div className="flex gap-3 rounded-lg border p-2">
      <div className="flex flex-1 flex-col items-start gap-1">
        <div className="flex flex-col leading-relaxed">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-100">
            {name}
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {fileSize}
          </span>
        </div>
      </div>

      <button type="button" onClick={handleDeleteFile}>
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  )
}

export function FileList() {
  const { files, handleDeleteFile } = useFileInput()

  if (files.length === 0) {
    return null
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {files.map((file, index) => {
        return (
          <FileItem
            key={file.name}
            name={file.name}
            size={file.size}
            type={file.type}
            handleDeleteFile={() => handleDeleteFile(index)}
          />
        )
      })}
    </div>
  )
}
