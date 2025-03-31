"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Edit2, Plus, Loader2 } from "lucide-react"
import type { Offer } from "@/types/offer"

interface OffersTableProps {
  userId: string
  offers: Offer[]
  loading: boolean
  error: string | null
  filters: {
    search: string
    status: string
    category: string
    sortBy: string
  }
  onCreateOffer: () => void
  onEditOffer: (offer: Offer) => void
}

export function OffersTable({
  userId,
  offers,
  loading,
  error,
  filters,
  onCreateOffer,
  onEditOffer
}: OffersTableProps) {
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>(offers || [])

  useEffect(() => {
    let filtered = offers.filter(o =>
      (!filters.search || o.name.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.status === "all" || o.status === filters.status) &&
      (filters.category === "all" || o.category_name === filters.category)
    )

    if (filters.sortBy.includes("name")) {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
      if (filters.sortBy === "name-desc") filtered.reverse()
    } else if (filters.sortBy.includes("price")) {
      filtered = filtered.sort((a, b) => a.offer_price - b.offer_price)
      if (filters.sortBy === "price-desc") filtered.reverse()
    }

    setFilteredOffers(filtered)
  }, [offers, filters])

  return (
    <Card className="w-full bg-white dark:bg-zinc-900 shadow-lg rounded-lg">
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Ofertas Disponíveis</h2>
          <Button onClick={onCreateOffer} variant="primary" className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nova Oferta
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Carregando ofertas...</span>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredOffers.length === 0 ? (
          <p className="text-gray-500">Nenhuma oferta encontrada.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOffers.map(offer => (
              <div
                key={offer.id}
                className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{offer.name}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    offer.status === "active" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-900"
                  }`}>
                    {offer.status}
                  </span>
                </div>
                <Button onClick={() => onEditOffer(offer)} variant="ghost" className="flex items-center gap-1">
                  <Edit2 className="h-4 w-4" />
                  Editar
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
