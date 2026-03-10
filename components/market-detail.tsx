'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star, TrendingDown, TrendingUp } from 'lucide-react'
import { useSingleTicker } from '@/hooks/use-single-ticker'
import { useFavorites, useRecentlyViewed } from '@/hooks/use-local-storage'
import { useHistoricalData } from '@/hooks/use-historical-data'
import { cn } from '@/lib/utils'
import {
  formatPercent,
  formatPrice,
  formatRelativeTime,
  formatTimestamp,
  formatVolume,
  getPairDisplay,
  getSymbolName,
} from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ConnectionStatusBadge } from '@/components/connection-status'
import { CryptoIcon } from '@/components/crypto-icon'
import PriceChart from '@/components/price-chart'

interface MarketDetailProps {
  symbol: string
}

export function MarketDetail({ symbol }: MarketDetailProps) {
  const { data, status, reconnect } = useSingleTicker({ symbol })
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addRecentlyViewed } = useRecentlyViewed()
  const historicalData = useHistoricalData(data)

  const isPositive = data ? data.priceChangePercent >= 0 : true
  const symbolName = getSymbolName(symbol)
  const pairDisplay = getPairDisplay(symbol)
  const favorite = isFavorite(symbol)

  // Add to recently viewed on mount
  useEffect(() => {
    addRecentlyViewed(symbol)
  }, [symbol, addRecentlyViewed])

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/">
            <ArrowLeft className="size-4 mr-1" />
            Back to Markets
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <CryptoIcon symbol={symbol} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{symbolName}</h1>
              <button
                onClick={() => toggleFavorite(symbol)}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  favorite
                    ? 'text-amber-500 hover:text-amber-600'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star className={cn('size-5', favorite && 'fill-current')} />
              </button>
            </div>
            <p className="text-muted-foreground">{pairDisplay}</p>
          </div>
        </div>
        <ConnectionStatusBadge status={status} onReconnect={reconnect} />
      </div>

      {/* Price Display */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            {data ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                  <p className="text-4xl font-bold tabular-nums">${formatPrice(data.price)}</p>
                </div>
                <div
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-lg font-semibold',
                    isPositive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400'
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="size-5" />
                  ) : (
                    <TrendingDown className="size-5" />
                  )}
                  <span className="tabular-nums">{formatPercent(data.priceChangePercent)}</span>
                  <span className="text-sm opacity-80 tabular-nums">
                    ({isPositive ? '+' : ''}${formatPrice(Math.abs(data.priceChange))})
                  </span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-40" />
                </div>
                <Skeleton className="h-10 w-32" />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">24h High</CardTitle>
          </CardHeader>
          <CardContent>
            {data ? (
              <p className="text-xl font-semibold tabular-nums">${formatPrice(data.high24h)}</p>
            ) : (
              <Skeleton className="h-7 w-24" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">24h Low</CardTitle>
          </CardHeader>
          <CardContent>
            {data ? (
              <p className="text-xl font-semibold tabular-nums">${formatPrice(data.low24h)}</p>
            ) : (
              <Skeleton className="h-7 w-24" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">24h Volume</CardTitle>
          </CardHeader>
          <CardContent>
            {data ? (
              <p className="text-xl font-semibold tabular-nums">
                {formatVolume(data.volume24h)} {symbolName}
              </p>
            ) : (
              <Skeleton className="h-7 w-24" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Update</CardTitle>
          </CardHeader>
          <CardContent>
            {data ? (
              <div>
                <p className="text-xl font-semibold tabular-nums">
                  {formatTimestamp(data.lastUpdate)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatRelativeTime(data.lastUpdate)}
                </p>
              </div>
            ) : (
              <Skeleton className="h-7 w-24" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Price Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            24h Price Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data ? (
            <PriceChart data={historicalData} />
          ) : (
            <div className="w-full h-[300px] flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
