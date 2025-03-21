"use client"

import { useState, useEffect } from "react"
import { Search, XCircle } from "lucide-react"
import { Input } from "@/components/ui/Input"
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
    <div className="w-full bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-md">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar ofertas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-10 h-11 text-gray-900 dark:text-white bg-gray-100 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 rounded-lg w-full"
          />
          {search && (
            <XCircle
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 cursor-pointer hover:text-red-500 transition-all"
              onClick={handleResetSearch}
            />
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
            className="w-full bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 rounded-lg h-11 focus:ring-2 focus:ring-blue-500"
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
            className="w-full bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 rounded-lg h-11 focus:ring-2 focus:ring-blue-500"
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
            className="w-full bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 rounded-lg h-11 w-10 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}
