"use client";

import { useState, useEffect, useCallback } from "react";
import { OffersTable } from "@/components/offers/OffersTable";
import { OfferForm } from "@/components/offers/OfferForm";
import { OffersFilters } from "@/components/offers/OffersFilters";
import { useOfferForm } from "@/hooks/useOfferForm";
import { useOffers } from "@/hooks/useOffers";
import type { Offer } from "@/types/offer";
import { supabase } from "@/lib/client";

export default function OffersPageClient() {
  const { isFormOpen, editingOffer, openCreateForm, openEditForm, closeForm } = useOfferForm();

  const [storeId, setStoreId] = useState<string>("");
  const [zoneId, setZoneId] = useState<string>("");
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  const { offers, loading, error, refetch } = useOffers(storeId);

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    category: "all",
    sortBy: "name-asc",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) throw new Error("Usuário não autenticado.");

        const { data: ownerData, error: ownerError } = await supabase
          .from("owners")
          .select("id")
          .eq("user_id", userData.user.id)
          .single();

        if (ownerError || !ownerData) throw new Error("Usuário não é um proprietário.");

        const { data: storeData, error: storeError } = await supabase
          .from("stores")
          .select("id, zone_id")
          .eq("owner_id", ownerData.id)
          .single();

        if (storeError || !storeData) throw new Error("Loja não encontrada.");

        setStoreId(storeData.id.toString());
        setZoneId(storeData.zone_id?.toString() || "");

        const { data: categoryData, error: categoryError } = await supabase
          .from("categories")
          .select("id, name");

        if (categoryError) throw categoryError;
        setCategories(categoryData || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleSubmitOffer = useCallback(
    async (data: Partial<Offer>) => {
      if (!storeId) {
        console.error("Erro: storeId não definido.");
        return;
      }

      try {
        const formattedData = {
          ...data,
          store_id: storeId,
          zone_id: zoneId,
        };

        const { error } = await supabase.from("offers").insert(formattedData);
        if (error) throw error;

        await refetch();
        closeForm();
      } catch (error) {
        console.error("Erro ao cadastrar oferta:", error);
      }
    },
    [storeId, zoneId, closeForm, refetch]
  );

  return (
    <div className="max-w-8xl mx-auto p-6 space-y-6">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">Ofertas</h1>
        <p className="text-gray-500">Gerencie suas ofertas promocionais e descontos</p>
      </header>

      <OffersFilters
        onFilterChange={handleFilterChange}
        categories={categories.map((c) => c.name)}
        statuses={["Ativa", "Inativa"]}
      />

      <OffersTable
        offers={offers}
        loading={loading}
        error={error}
        filters={filters}
        onCreateOffer={openCreateForm}
        onEditOffer={openEditForm}
        onUpdateFilters={handleFilterChange}
      />

      {categories.length === 0 && (
        <div className="bg-yellow-100 p-4 rounded-md">
          <p className="text-yellow-800">
            Nenhuma categoria disponível. As ofertas precisam de categorias para serem criadas.
          </p>
        </div>
      )}

      <OfferForm
        isOpen={isFormOpen}
        onClose={closeForm}
        initialData={editingOffer || undefined}
        onSubmit={handleSubmitOffer}
        storeId={storeId}
        zoneId={zoneId}
        categories={categories}
      />
    </div>
  );
}
