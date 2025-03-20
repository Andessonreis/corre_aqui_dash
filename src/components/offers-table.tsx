"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Trash2, Eye, ArrowUpDown, Plus } from "lucide-react"
import Image from "next/image"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { formatCurrency } from "@/lib/utils"

// Sample data
const offers = [
  {
    id: "1",
    name: "Summer Sale",
    code: "SUMMER20",
    description: "Get 20% off on all summer products",
    originalPrice: 100,
    offerPrice: 80,
    discount: "20%",
    status: "active",
    isActive: true,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    usageCount: 245,
    imageUrl: "/placeholder.svg?height=80&width=80",
    storeId: "1",
    storeName: "Fashion Store",
    categoryId: "3",
    categoryName: "Clothing",
  },
  {
    id: "2",
    name: "New Customer",
    code: "WELCOME10",
    description: "10% discount for new customers",
    originalPrice: 200,
    offerPrice: 180,
    discount: "10%",
    status: "active",
    isActive: true,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    usageCount: 1023,
    imageUrl: "/placeholder.svg?height=80&width=80",
    storeId: "1",
    storeName: "Fashion Store",
    categoryId: "5",
    categoryName: "Accessories",
  },
  {
    id: "3",
    name: "Flash Sale",
    code: "FLASH25",
    description: "25% off for 48 hours only",
    originalPrice: 150,
    offerPrice: 112.5,
    discount: "25%",
    status: "scheduled",
    isActive: false,
    startDate: "2024-07-15",
    endDate: "2024-07-17",
    usageCount: 0,
    imageUrl: "/placeholder.svg?height=80&width=80",
    storeId: "2",
    storeName: "Electronics Hub",
    categoryId: "2",
    categoryName: "Electronics",
  },
  {
    id: "4",
    name: "Holiday Special",
    code: "HOLIDAY15",
    description: "15% off on holiday packages",
    originalPrice: 500,
    offerPrice: 425,
    discount: "15%",
    status: "expired",
    isActive: false,
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    usageCount: 876,
    imageUrl: "/placeholder.svg?height=80&width=80",
    storeId: "3",
    storeName: "Travel Agency",
    categoryId: "7",
    categoryName: "Travel",
  },
  {
    id: "5",
    name: "Loyalty Discount",
    code: "LOYAL30",
    description: "30% off for loyal customers",
    originalPrice: 300,
    offerPrice: 210,
    discount: "30%",
    status: "active",
    isActive: true,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    usageCount: 542,
    imageUrl: "/placeholder.svg?height=80&width=80",
    storeId: "4",
    storeName: "Beauty Shop",
    categoryId: "4",
    categoryName: "Beauty",
  },
]

// Sample categories
const categories = [
  { id: "1", name: "All Categories" },
  { id: "2", name: "Electronics" },
  { id: "3", name: "Clothing" },
  { id: "4", name: "Beauty" },
  { id: "5", name: "Accessories" },
  { id: "6", name: "Food" },
  { id: "7", name: "Travel" },
]

// Sample stores
const stores = [
  { id: "1", name: "Fashion Store" },
  { id: "2", name: "Electronics Hub" },
  { id: "3", name: "Travel Agency" },
  { id: "4", name: "Beauty Shop" },
]

export function OffersTable({
  onCreateOffer,
  onEditOffer,
}: {
  onCreateOffer?: () => void
  onEditOffer?: (offer: any) => void
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("1") // All categories
  const [storeFilter, setStoreFilter] = useState("all")

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || offer.status === statusFilter
    const matchesCategory = categoryFilter === "1" || offer.categoryId === categoryFilter
    const matchesStore = storeFilter === "all" || offer.storeId === storeFilter

    return matchesSearch && matchesStatus && matchesCategory && matchesStore
  })

  const handleToggleActive = (id: string, currentState: boolean) => {
    // In a real app, this would update the database
    console.log(`Toggling offer ${id} to ${!currentState}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
          <Input
            placeholder="Search offers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={storeFilter} onValueChange={setStoreFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={onCreateOffer} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          New Offer
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 h-8 font-medium">
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 h-8 font-medium">
                  Expiry
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOffers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No offers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOffers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 overflow-hidden rounded-md">
                      <Image
                        src={offer.imageUrl || "/placeholder.svg"}
                        alt={offer.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{offer.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{offer.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                      {offer.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm line-through text-muted-foreground">
                        {formatCurrency(offer.originalPrice)}
                      </span>
                      <span className="font-medium text-green-600">{formatCurrency(offer.offerPrice)}</span>
                      <span className="text-xs">({offer.discount} off)</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{offer.categoryName}</Badge>
                  </TableCell>
                  <TableCell>{offer.storeName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        offer.status === "active" ? "default" : offer.status === "scheduled" ? "outline" : "secondary"
                      }
                    >
                      {offer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={offer.isActive}
                      onCheckedChange={(checked) => handleToggleActive(offer.id, offer.isActive)}
                      aria-label={`Toggle ${offer.name} active state`}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="whitespace-nowrap text-sm">{new Date(offer.endDate).toLocaleDateString()}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditOffer?.(offer)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit offer</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete offer</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

