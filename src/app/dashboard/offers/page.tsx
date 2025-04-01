"use client";

import { useState, useEffect, useCallback } from "react";
import { OffersTable } from "@/components/offers/OffersTable";
import { OfferForm } from "@/components/offers/OfferForm";
import { OffersFilters } from "@/components/offers/OffersFilters";
import { useOfferForm } from "@/hooks/useOfferForm";
import { useOffers } from "@/hooks/useOffers";
import type { Offer } from "@/types/offer";
import { supabase } from "@/lib/client";

interface OffersPageClientProps {
  userId?: string;
  submitOffer?: (data: Partial<Offer>) => Promise<void>;
  stores: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
}

const defaultSubmitOffer = async (data: Partial<Offer>): Promise<void> => {
  const formattedData = {
    ...data,
    store_id: data.store_id ? Number(data.store_id) : null,
    zone_id: data.zone_id ? Number(data.zone_id) : null,
  };

  const { error } = await supabase.from("offers").insert(formattedData);
  if (error) throw error;
};

export default function OffersPageClient({
  userId,
  submitOffer = defaultSubmitOffer,
  stores = [],
  categories = [],
}: OffersPageClientProps) {
  const { isFormOpen, editingOffer, openCreateForm, openEditForm, closeForm } = useOfferForm();
  
  const [storeId, setStoreId] = useState<string>("");
  const [zoneId, setZoneId] = useState<string>("");
  const [allCategories, setAllCategories] = useState(categories);


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
        if (userError) throw userError;
        if (!userData?.user) throw new Error("Usuário não autenticado.");

        const authenticatedUserId = userData.user.id;

        const { data: ownerData, error: ownerError } = await supabase
          .from("owners")
          .select("id")
          .eq("user_id", authenticatedUserId)
          .single();

        if (ownerError) throw ownerError;
        if (!ownerData) throw new Error("Usuário não é um proprietário.");

        const { data: storeData, error: storeError } = await supabase
          .from("stores")
          .select("id, zone_id")
          .eq("owner_id", ownerData.id)
          .single();

        if (storeError) throw storeError;

        setStoreId(storeData.id.toString());
        setZoneId(storeData.zone_id?.toString() || "");

        if (!categories.length) {
          const { data: categoryData, error: categoryError } = await supabase
            .from("categories")
            .select("id, name");

          if (categoryError) throw categoryError;
          setAllCategories(categoryData || []);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, [categories]);

  const handleFilterChange = (newFilters: typeof filters) => setFilters(newFilters);

  const handleSubmitOffer = useCallback(
    async (data: Partial<Offer>) => {
      if (!storeId) {
        console.error("Erro: storeId não definido.");
        return;
      }

      try {
        await submitOffer({ ...data, store_id: storeId, zone_id: zoneId });
        await refetch();
        closeForm();
      } catch (error) {
        console.error("Erro ao cadastrar oferta:", error);
      }
    },
    [submitOffer, refetch, closeForm, storeId, zoneId]
  );

  return (
    <div className="max-w-8xl mx-auto p-6 space-y-6">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">Ofertas</h1>
        <p className="text-gray-500">Gerencie suas ofertas promocionais e descontos</p>
      </header>

      <OffersFilters
        onFilterChange={handleFilterChange}
        categories={allCategories.map((c) => c.name)}
        statuses={["Ativa", "Inativa"]}
      />

      <OffersTable
        offers={offers} 
        loading={loading}
        error={error}
        filters={filters}
        onCreateOffer={openCreateForm}
        onEditOffer={openEditForm}
      />

      {allCategories.length === 0 && (
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
        categories={allCategories}
      />
    </div>
  );
}
