import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/client"
import type { Offer } from "@/types/offer"

export function useOffers(storeId: string) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOffers = useCallback(async () => {
    if (!storeId) {
      console.warn("Nenhum Store ID fornecido. Abortando busca de ofertas.");
      return;
    }
  
    console.log("Buscando ofertas para Store ID:", storeId);
    const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("store_id", storeId);
  
  
    if (error) {
      console.error("Erro ao carregar ofertas:", error);
    } else {
      console.log("Ofertas encontradas:", data);
      setOffers(data as Offer[]);
    }
  
    setLoading(false);
  }, [storeId]);
  

  useEffect(() => {
    fetchOffers()
  }, [storeId, fetchOffers])

  return { offers, loading, error, refetch: fetchOffers }
}
