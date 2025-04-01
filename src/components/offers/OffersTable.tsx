"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Filter, ArrowUpDown, Calendar, Tag } from "lucide-react"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper } from "@mui/material";
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Skeleton } from "@/components/ui/Skeleton"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

import type { Offer } from "@/types/offer"

interface OffersTableProps {
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
  onUpdateFilters: (newFilters: Partial<OffersTableProps['filters']>) => void
}

export function OffersTable({
  offers,
  loading,
  error,
  filters,
  onCreateOffer,
  onEditOffer,
  onUpdateFilters
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
    } else if (filters.sortBy.includes("date")) {
      filtered = filtered.sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime())
      if (filters.sortBy === "date-desc") filtered.reverse()
    }

    setFilteredOffers(filtered)
  }, [offers, filters])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const calculateDiscount = (original: number, offer: number) => {
    return Math.round(((original - offer) / original) * 100)
  }

  return (

    <Card className="w-full bg-white dark:bg-zinc-900 border-0 shadow-sm rounded-lg">
      <CardContent className="p-6 space-y-6">
      <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ofertas Disponíveis</h2>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <Button onClick={onCreateOffer} variant="primary" className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nova Oferta
          </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md">
            {error}
          </div>
        ) : (
          <TableContainer component={Paper} className="overflow-x-auto shadow-none">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="w-[300px]">
                    <div className="flex items-center space-x-1">
                      <span>Nome</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6">
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => onUpdateFilters({ sortBy: 'name-asc' })}>
                            A-Z
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateFilters({ sortBy: 'name-desc' })}>
                            Z-A
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span>Preço</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6">
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => onUpdateFilters({ sortBy: 'price-asc' })}>
                            Menor preço
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateFilters({ sortBy: 'price-desc' })}>
                            Maior preço
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span>Validade</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6">
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => onUpdateFilters({ sortBy: 'date-asc' })}>
                            Mais próximas
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateFilters({ sortBy: 'date-desc' })}>
                            Mais distantes
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOffers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" className="py-6 text-gray-500">
                      Nenhuma oferta encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOffers.map((offer) => {
                    const discount = calculateDiscount(offer.original_price, offer.offer_price)
                    return (
                      <TableRow key={offer.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            {offer.image_url && (
                              <img
                                src={offer.image_url}
                                alt={offer.name}
                                className="h-10 w-10 rounded object-cover"
                              />
                            )}
                            <span className="truncate max-w-[250px]">{offer.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            <Tag className="h-3 w-3 mr-1" />
                            {offer.category_name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900 dark:text-white">{formatCurrency(offer.offer_price)}</div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500 line-through">{formatCurrency(offer.original_price)}</span>
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                -{discount}%
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                                  <span>
                                    {format(new Date(offer.end_date), "dd/MM/yyyy", { locale: ptBR })}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Válido até {format(new Date(offer.end_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${offer.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            }`}>
                            {offer.status === "active" ? "Ativa" : "Inativa"}
                          </Badge>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            onClick={() => onEditOffer(offer)}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  )
}