'use client'

import { useMemo, useRef } from 'react'
import type { MarketData } from '@/lib/types'

interface ChartData {
  time: string
  price: number
}

export function useHistoricalData(currentData: MarketData | null, points: number = 24): ChartData[] {
  const historicalDataRef = useRef<ChartData[]>([])
  const lastSymbolRef = useRef<string>('')

  return useMemo(() => {
    if (!currentData) return []

    // Only regenerate data when symbol changes (not on every price update)
    const currentSymbol = currentData.symbol
    if (currentSymbol !== lastSymbolRef.current) {
      lastSymbolRef.current = currentSymbol
      
      const data: ChartData[] = []
      const now = Date.now()
      const oneHour = 60 * 60 * 1000
      const start = now - (points * oneHour)

      // Generate realistic historical data based on current price and 24h range
      const { price, high24h, low24h, priceChangePercent } = currentData
      const volatility = Math.abs(priceChangePercent) / 100
      const trend = priceChangePercent >= 0 ? 1 : -1

      for (let i = 0; i < points; i++) {
        const timestamp = start + (i * oneHour)
        const progress = i / points
        
        // Create a realistic price movement
        const basePrice = low24h + (high24h - low24h) * progress
        const randomVariation = (Math.random() - 0.5) * (high24h - low24h) * 0.1
        const trendAdjustment = trend * volatility * (high24h - low24h) * progress * 0.5
        
        const finalPrice = Math.max(
          low24h,
          Math.min(high24h, basePrice + randomVariation + trendAdjustment)
        )

        data.push({
          time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          price: finalPrice
        })
      }

      historicalDataRef.current = data
    }

    // Always update the last point to match current price
    const updatedData = [...historicalDataRef.current]
    if (updatedData.length > 0) {
      updatedData[updatedData.length - 1].price = currentData.price
    }

    return updatedData
  }, [currentData?.symbol, currentData?.price, points])
}
