export interface Offer {
  id: string
  name: string
  code?: string
  description: string | null
  original_price: number
  offer_price: number
  discount?: string
  status: "active" | "expired" | "scheduled"
  is_active: boolean
  start_date: string,
  end_date: string
  image_url: string
  store_name: string
  store_id: string 
  zone_id: string
  category_id: string,
  category_name: string
}