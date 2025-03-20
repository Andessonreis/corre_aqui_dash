"use client"

import { useState } from "react"
import { OffersTable } from "@/components/offers-table"
import { OfferForm } from "@/components/offer-form"

export default function OffersPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState<any>(null)

  const handleCreateOffer = () => {
    setEditingOffer(null)
    setFormOpen(true)
  }

  const handleEditOffer = (offer: any) => {
    setEditingOffer(offer)
    setFormOpen(true)
  }

  const handleSubmitOffer = (data: any) => {
    // In a real app, this would save to the database
    console.log("Submitting offer:", data)

    // Close the form
    setFormOpen(false)
    setEditingOffer(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Offers</h1>
        <p className="text-muted-foreground">Manage your promotional offers and discounts</p>
      </div>

      <OffersTable onCreateOffer={handleCreateOffer} onEditOffer={handleEditOffer} />

      <OfferForm open={formOpen} onOpenChange={setFormOpen} initialData={editingOffer} onSubmit={handleSubmitOffer} />
    </div>
  )
}

