"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/Select"

interface OffersFiltersProps {
  onFilterChange: (filters: {
    search: string
    status: string
    category: string
    sortBy: string
  }) => void
  categories: string[]
  statuses: string[]
}

export function OffersFilters({
  onFilterChange,
  categories,
  statuses
}: OffersFiltersProps) {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name-asc")

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFilterChange()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const handleFilterChange = () => {
    onFilterChange({ search, status, category, sortBy })
  }

  const handleResetSearch = () => {
    setSearch("")
    handleFilterChange()
  }

  return (
    <div className="w-full mb-6 text-gray-500">
      {/* Desktop & Mobile Layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search with icon */}
        <div className="relative flex-1 w-full">
          <Search className="absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar ofertas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-13 h-10 pr-4 w-250"
          />
          {search && (
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
              onClick={handleResetSearch}
            >
              ×
            </div>
          )}
        </div>
        {/* Filters Group */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              handleFilterChange()
            }}
            options={[
              { value: "all", label: "Todos os Status" },
              ...statuses.map(s => ({ value: s, label: s }))
            ]}
            className="md:w-30 lg:w-46"
          />
          <Select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              handleFilterChange()
            }}
            options={[
              { value: "all", label: "Todas as Categorias" },
              ...categories.map(c => ({ value: c, label: c }))
            ]}
            className="md:w-44 lg:w-56"
          />
          <Select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value)
              handleFilterChange()
            }}
            options={[
              { value: "name-asc", label: "Nome (A-Z)" },
              { value: "name-desc", label: "Nome (Z-A)" },
              { value: "price-asc", label: "Preço (menor)" },
              { value: "price-desc", label: "Preço (maior)" }
            ]}
            className="w-full sm:w-33"
          />
        </div>
      </div>
    </div>
  )
}