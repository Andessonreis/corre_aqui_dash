import { useState, useCallback } from "react";
import type { Offer } from "@/types/offer";

export function useOfferForm() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const openCreateForm = useCallback(() => {
    setEditingOffer(null);
    setIsFormOpen(true);
  }, []);

  const openEditForm = useCallback((offer: Offer) => {
    setEditingOffer(offer);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingOffer(null);
  }, []);

  return {
    isFormOpen,
    editingOffer,
    openCreateForm,
    openEditForm,
    closeForm,
  };
}
