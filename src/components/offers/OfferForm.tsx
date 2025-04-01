import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "../ui/Input"
import { Modal } from "../ui/Modal"
import { supabase } from "@/lib/client"
import type { Offer } from "@/types/offer"

interface OfferFormProps {
  isOpen: boolean
  onClose: () => void
  initialData?: Partial<Offer> | null
  onSubmit: (data: Partial<Offer>) => void
  storeId: string
  categories: Array<{ id: string | number; name: string }>
  zoneId: string
}

export const OfferForm: React.FC<OfferFormProps> = ({ 
  isOpen, 
  onClose, 
  initialData, 
  onSubmit, 
  storeId,
  categories,
  zoneId
}) => {
  const [formData, setFormData] = useState<Partial<Offer>>({
    name: '',
    description: undefined,
    original_price: 0,
    offer_price: 0,
    end_date: '',
    image_url: '',
    is_active: true,
    store_id: storeId,
    zone_id: zoneId,
    category_id: undefined,
    ...initialData
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        ...(initialData || {}),
        name: initialData?.name || '',
        description: initialData?.description || undefined,
        original_price: initialData?.original_price || 0,
        offer_price: initialData?.offer_price || 0,
        end_date: initialData?.end_date || '',
        image_url: initialData?.image_url || '',
        is_active: initialData?.is_active ?? true,
        category_id: initialData?.category_id || undefined,
        zone_id: zoneId,
        store_id: storeId
      }))
      setImageFile(null)
      setError(null)
    }
  }, [isOpen, initialData, storeId, zoneId])

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('offers')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('offers')
        .getPublicUrl(filePath)

      return urlData.publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      setError('Falha ao fazer upload da imagem')
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
  
    if (!formData.name || !formData.category_id || !formData.end_date) {
      setError("Preencha todos os campos obrigatórios")
      return
    }

    if (!formData.image_url && !imageFile) {
      setError("Uma imagem é obrigatória")
      return
    }

    // Converter valores para números garantindo fallback
    const originalPrice = formData.original_price || 0
    const offerPrice = formData.offer_price || 0

    if (offerPrice >= originalPrice) {
      setError("O preço promocional deve ser menor que o original")
      return
    }
  

    try {
      let imageUrl = formData.image_url
      
      if (imageFile) {
        const newUrl = await handleImageUpload(imageFile)
        if (!newUrl) return
        imageUrl = newUrl
      }

      const submissionData: Partial<Offer> = {
        ...formData,
        image_url: imageUrl || '',
        store_id: storeId,
        zone_id: zoneId,
        category_id: formData.category_id,
        original_price: Number(formData.original_price),
        offer_price: Number(formData.offer_price),
        end_date: new Date(formData.end_date).toISOString()
      }

      onSubmit(submissionData)
      onClose()
    } catch (error) {
      console.error('Error submitting offer:', error)
      setError("Erro ao salvar a oferta")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let parsedValue: any = value

    if (name === 'category_id') {
      parsedValue = value ? Number(value) : undefined
    } else if (name.includes('_price')) {
      parsedValue = Number(value.replace(/[^0-9.]/g, ''))
    }

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setFormData(prev => ({ ...prev, image_url: URL.createObjectURL(file) }))
    }
  }

  const formatDateForInput = (isoString: string) => {
    const date = new Date(isoString)
    const tzOffset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nome da Oferta *
          </label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Ex: Smartphone Galaxy S23"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Descrição
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Imagem da Oferta *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {formData.image_url && (
            <img 
              src={formData.image_url} 
              alt="Preview" 
              className="mt-2 h-32 object-cover rounded"
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Preço Original *
            </label>
            <Input
              type="number"
              step="0.01"
              name="original_price"
              value={formData.original_price}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Preço Promocional *
            </label>
            <Input
              type="number"
              step="0.01"
              name="offer_price"
              value={formData.offer_price}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Categoria *
            </label>
            <select
              name="category_id"
              value={formData.category_id?.toString() || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecione...</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Data de Término *
            </label>
            <input
              type="datetime-local"
              name="end_date"
              value={formData.end_date ? formatDateForInput(formData.end_date) : ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex justify-end gap-2 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={uploading}
          >
            {uploading ? 'Salvando...' : 'Salvar Oferta'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}