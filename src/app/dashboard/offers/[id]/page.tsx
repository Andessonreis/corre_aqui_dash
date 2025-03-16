'use client'

import { useParams } from 'next/navigation'

export default function OfferPage() {
  const params = useParams<{ id: string }>()

  return (
    <div>
      <h1>Oferta: {params.id}</h1>
    </div>
  )
}
