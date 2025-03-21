import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/client"
import type { Offer } from "@/types/offer"

export function useOffers(userId: string) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOffers = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .eq("userId", userId)

    if (error) {
      setError("Erro ao carregar ofertas")
    } else {
      setOffers(data as Offer[])
    }

    setLoading(false)
  }, [userId])

  useEffect(() => {
    if (userId) fetchOffers()
  }, [userId, fetchOffers])

  return { offers, loading, error, refetch: fetchOffers }
}
