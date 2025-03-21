import React, { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "../ui/Input"
import { Modal } from "../ui/Modal"

interface OfferFormProps {
  isOpen: boolean
  onClose: () => void
  initialData?: any
  onSubmit: (data: any) => void
}

export const OfferForm: React.FC<OfferFormProps> = ({ isOpen, onClose, initialData, onSubmit }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formData.entries())
    onSubmit(data)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        {initialData ? "Editar Oferta" : "Criar Oferta"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Imagem da Oferta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Imagem da Oferta
          </label>
          <div className="mt-2 flex items-center gap-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Prévia da Oferta"
                className="h-16 w-16 rounded-lg object-cover border border-gray-300 dark:border-gray-600"
              />
            ) : (
              <div className="h-16 w-16 flex items-center justify-center bg-gray-100 dark:bg-zinc-700 text-gray-400 rounded-lg">
                ?
              </div>
            )}
            <label className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium shadow hover:scale-105 transition">
              Escolher Imagem
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Nome e Código da Oferta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome da Oferta
            </label>
            <Input
              type="text"
              name="name"
              defaultValue={initialData?.name || ""}
              placeholder="Ex: Promoção de Verão"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Código da Oferta
            </label>
            <Input
              type="text"
              name="code"
              defaultValue={initialData?.code || ""}
              placeholder="Ex: SUMMER20"
              required
            />
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="secondary" onClick={onClose} className="hover:scale-105 transition">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" className="hover:scale-105 transition">
            {initialData ? "Salvar Alterações" : "Criar Oferta"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
