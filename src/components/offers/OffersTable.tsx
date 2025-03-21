"use client"

import { useState } from "react"
import { useOffers } from "@/hooks/useOffers"
import { OffersFilters } from "./OffersFilters"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Edit2 } from "lucide-react"
import type { Offer } from "@/types/offer"

interface OffersTableProps {
  userId: string
  offers: Offer[] 
  loading: boolean
  error: string | null
  onCreateOffer: () => void
  onEditOffer: (offer: Offer) => void
}
export function OffersTable({ userId, onCreateOffer, onEditOffer }: OffersTableProps) {
  const { offers, loading, error } = useOffers(userId)
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([])

  const handleFilterChange = ({ search, status, category, sortBy }: any) => {
    let filtered = offers.filter(o =>
      (search ? o.name.toLowerCase().includes(search.toLowerCase()) : true) &&
      (status !== "all" ? o.status === status : true) &&
      (category !== "all" ? o.categoryName === category : true)
    )

    if (sortBy.includes("name")) {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
      if (sortBy === "name-desc") filtered.reverse()
    } else if (sortBy.includes("price")) {
      filtered = filtered.sort((a, b) => a.offerPrice - b.offerPrice)
      if (sortBy === "price-desc") filtered.reverse()
    }

    setFilteredOffers(filtered)
  }

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Ofertas Disponíveis</h2>
          <Button onClick={onCreateOffer} variant="primary">
            Nova Oferta
          </Button>
        </div>

        <OffersFilters
          onFilterChange={handleFilterChange}
          categories={[...new Set(offers.map(o => o.categoryName))]}
          statuses={[...new Set(offers.map(o => o.status))]}
        />

        {loading ? (
          <p>Carregando ofertas...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredOffers.length === 0 ? (
          <p className="text-gray-500">Nenhuma oferta encontrada.</p>
        ) : (
          <ul className="space-y-4">
            {filteredOffers.map(offer => (
              <li key={offer.id} className="flex justify-between border-b pb-4">
                <span>{offer.name}</span>
                <Button onClick={() => onEditOffer(offer)} variant="ghost">
                  <Edit2 className="h-4 w-4" /> Editar
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
