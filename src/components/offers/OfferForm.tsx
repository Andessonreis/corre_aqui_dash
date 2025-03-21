import React, { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "../ui/input"
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
      <h2 className="text-xl font-bold text-gray-900">
        {initialData ? "Edit Offer" : "Create Offer"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Offer Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Offer Image</label>
          <div className="mt-1 flex items-center gap-4">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Offer Preview"
                className="h-16 w-16 rounded-md object-cover"
              />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Offer Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Offer Name</label>
          <Input
            type="text"
            name="name"
            defaultValue={initialData?.name || ""}
            placeholder="Summer Sale"
            required
          />
        </div>

        {/* Offer Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Offer Code</label>
          <Input
            type="text"
            name="code"
            defaultValue={initialData?.code || ""}
            placeholder="SUMMER20"
            required
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? "Save Changes" : "Create Offer"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}