export interface Offer {
  id: string
  name: string
  code: string
  description: string
  originalPrice: number
  offerPrice: number
  discount: string
  status: "active" | "expired" | "scheduled"
  isActive: boolean
  startDate: string,
  endDate: string
  imageUrl: string
  storeName: string
  categoryId: string,
  categoryName: string
}