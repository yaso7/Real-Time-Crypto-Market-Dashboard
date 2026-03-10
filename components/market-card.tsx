'use client'

import Link from 'next/link'
import { Star, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPercent, formatPrice, getSymbolName, getPairDisplay } from '@/lib/format'
import type { MarketData } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'
import { CryptoIcon } from '@/components/crypto-icon'

interface MarketCardProps {
  data: MarketData | undefined
  symbol: string
  isFavorite: boolean
  onToggleFavorite: (symbol: string) => void
}

export function MarketCard({ data, symbol, isFavorite, onToggleFavorite }: MarketCardProps) {
  const isPositive = data ? data.priceChangePercent >= 0 : true
  const symbolName = getSymbolName(symbol)
  const pairDisplay = getPairDisplay(symbol)

  return (
    <div className="group relative flex flex-col gap-3 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
      <button
        onClick={(e) => {
          e.preventDefault()
          onToggleFavorite(symbol)
        }}
        className={cn(
          'absolute top-3 right-3 p-1.5 rounded-md transition-colors',
          isFavorite
            ? 'text-amber-500 hover:text-amber-600'
            : 'text-muted-foreground/40 hover:text-muted-foreground'
        )}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star className={cn('size-4', isFavorite && 'fill-current')} />
      </button>

      <Link href={`/market/${symbol}`} className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <CryptoIcon symbol={symbol} size="md" />
          <div>
            <h3 className="font-semibold text-foreground">{symbolName}</h3>
            <p className="text-xs text-muted-foreground">{pairDisplay}</p>
          </div>
        </div>

        {data ? (
          <div className="flex items-end justify-between">
            <div>
              <p className="text-lg font-bold tabular-nums">${formatPrice(data.price)}</p>
            </div>
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium',
                isPositive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400'
              )}
            >
              {isPositive ? (
                <TrendingUp className="size-3.5" />
              ) : (
                <TrendingDown className="size-3.5" />
              )}
              <span className="tabular-nums">{formatPercent(data.priceChangePercent)}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-end justify-between">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-7 w-16" />
          </div>
        )}
      </Link>
    </div>
  )
}

export function MarketCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border bg-card">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-7 w-16" />
      </div>
    </div>
  )
}
