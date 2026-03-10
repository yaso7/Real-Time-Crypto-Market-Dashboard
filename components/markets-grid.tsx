'use client'

import { useMemo, useState } from 'react'
import { useBinanceWebSocket } from '@/hooks/use-binance-websocket'
import { useFavorites, useRecentlyViewed } from '@/hooks/use-local-storage'
import { TRADING_PAIRS } from '@/lib/types'
import type { MarketData, SortOption } from '@/lib/types'
import { MarketCard, MarketCardSkeleton } from '@/components/market-card'
import { ConnectionStatusBadge } from '@/components/connection-status'
import { SearchInput } from '@/components/search-input'
import { SortSelect } from '@/components/sort-select'
import { RecentlyViewed } from '@/components/recently-viewed'
import { SearchX } from 'lucide-react'

function sortMarkets(
  symbols: string[],
  marketData: Map<string, MarketData>,
  favorites: string[],
  sortOption: SortOption
): string[] {
  const sorted = [...symbols]

  switch (sortOption) {
    case 'alphabetical':
      return sorted.sort((a, b) => a.localeCompare(b))
    case 'favorites':
      return sorted.sort((a, b) => {
        const aFav = favorites.includes(a) ? 0 : 1
        const bFav = favorites.includes(b) ? 0 : 1
        return aFav - bFav
      })
    case 'price-high':
      return sorted.sort((a, b) => {
        const aPrice = marketData.get(a)?.price ?? 0
        const bPrice = marketData.get(b)?.price ?? 0
        return bPrice - aPrice
      })
    case 'price-low':
      return sorted.sort((a, b) => {
        const aPrice = marketData.get(a)?.price ?? 0
        const bPrice = marketData.get(b)?.price ?? 0
        return aPrice - bPrice
      })
    case 'change-high':
      return sorted.sort((a, b) => {
        const aChange = marketData.get(a)?.priceChangePercent ?? 0
        const bChange = marketData.get(b)?.priceChangePercent ?? 0
        return bChange - aChange
      })
    case 'change-low':
      return sorted.sort((a, b) => {
        const aChange = marketData.get(a)?.priceChangePercent ?? 0
        const bChange = marketData.get(b)?.priceChangePercent ?? 0
        return aChange - bChange
      })
    default:
      return sorted
  }
}

export function MarketsGrid() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('default')

  const { marketData, status, reconnect } = useBinanceWebSocket({
    symbols: [...TRADING_PAIRS],
  })

  const { favorites, toggleFavorite, isFavorite, isLoaded: favoritesLoaded } = useFavorites()
  const { recentlyViewed, isLoaded: recentLoaded } = useRecentlyViewed()

  const filteredAndSortedSymbols = useMemo(() => {
    let symbols = [...TRADING_PAIRS]

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      symbols = symbols.filter((s) => s.toLowerCase().includes(query))
    }

    // Sort - use stable references to prevent unnecessary re-renders
    return sortMarkets(symbols, marketData, favorites, sortOption)
  }, [searchQuery, sortOption, favorites, marketData.size]) // Use marketData.size instead of marketData reference

  const isLoading = !favoritesLoaded || !recentLoaded

  return (
    <div className="space-y-6">
      {/* Recently Viewed */}
      {recentLoaded && recentlyViewed.length > 0 && (
        <RecentlyViewed symbols={recentlyViewed} marketData={marketData} />
      )}

      {/* Header with search and filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Markets</h2>
          <ConnectionStatusBadge status={status} onReconnect={reconnect} />
        </div>
        <div className="flex gap-3">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search symbols..."
          />
          <SortSelect value={sortOption} onChange={setSortOption} />
        </div>
      </div>

      {/* Markets Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <MarketCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredAndSortedSymbols.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex items-center justify-center size-12 rounded-full bg-muted mb-4">
            <SearchX className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No markets found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search query
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedSymbols.map((symbol) => (
            <MarketCard
              key={symbol}
              symbol={symbol}
              data={marketData.get(symbol)}
              isFavorite={isFavorite(symbol)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  )
}
