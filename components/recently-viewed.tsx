'use client'

import Link from 'next/link'
import { Clock, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPercent, formatPrice, getSymbolName } from '@/lib/format'
import type { MarketData } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'
import { CryptoIcon } from '@/components/crypto-icon'

interface RecentlyViewedProps {
  symbols: string[]
  marketData: Map<string, MarketData>
}

export function RecentlyViewed({ symbols, marketData }: RecentlyViewedProps) {
  if (symbols.length === 0) {
    return null
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-medium text-muted-foreground">Recently Viewed</h2>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {symbols.map((symbol) => {
          const data = marketData.get(symbol)
          const isPositive = data ? data.priceChangePercent >= 0 : true

          return (
            <Link
              key={symbol}
              href={`/market/${symbol}`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors shrink-0"
            >
              <CryptoIcon symbol={symbol} size="sm" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{getSymbolName(symbol)}</span>
                {data ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground tabular-nums">
                      ${formatPrice(data.price)}
                    </span>
                    <span
                      className={cn(
                        'flex items-center text-xs font-medium tabular-nums',
                        isPositive
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-red-600 dark:text-red-400'
                      )}
                    >
                      {isPositive ? (
                        <TrendingUp className="size-3 mr-0.5" />
                      ) : (
                        <TrendingDown className="size-3 mr-0.5" />
                      )}
                      {formatPercent(data.priceChangePercent)}
                    </span>
                  </div>
                ) : (
                  <Skeleton className="h-3 w-20 mt-1" />
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
