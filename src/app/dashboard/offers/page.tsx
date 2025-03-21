"use client"

import { useCallback } from "react"
import { OffersTable } from "@/components/offers/OffersTable"
import { OfferForm } from "@/components/offers/OfferForm"
import { useOfferForm } from "@/hooks/useOfferForm"
import { useOffers } from "@/hooks/useOffers"
import type { Offer } from "@/types/offer"

interface OffersPageClientProps {
  userId: string;
  submitOffer: (data: Offer) => Promise<void>;
}

export default function OffersPageClient({ userId, submitOffer }: OffersPageClientProps) {
  const { isFormOpen, editingOffer, openCreateForm, openEditForm, closeForm } = useOfferForm()
  const { offers, loading, error, refetch } = useOffers(userId)

  const handleSubmitOffer = useCallback(async (data: Offer) => {
    await submitOffer(data)
    await refetch()
    closeForm()
  }, [submitOffer, refetch, closeForm])

  return (
    <div className="max-w-8xl mx-auto p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
          Ofertas
        </h1>
        <p className="text-gray-500">
          Gerencie suas ofertas promocionais e descontos
        </p>
      </header>

      <OffersTable
        userId={userId}
        offers={offers}
        loading={loading}
        error={error}
        onCreateOffer={openCreateForm}
        onEditOffer={openEditForm}
      />

      <OfferForm
        isOpen={isFormOpen}
        onClose={closeForm}
        initialData={editingOffer}
        onSubmit={handleSubmitOffer}
      />
    </div>
  )
}
