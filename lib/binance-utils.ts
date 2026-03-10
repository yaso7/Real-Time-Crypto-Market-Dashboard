import type { TickerData, MarketData } from './types'

export function validateTickerData(data: any): data is TickerData {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.s === 'string' &&
    typeof data.c === 'string' &&
    typeof data.p === 'string' &&
    typeof data.P === 'string' &&
    typeof data.h === 'string' &&
    typeof data.l === 'string' &&
    typeof data.v === 'string' &&
    typeof data.E === 'number'
  )
}

export function parseTickerData(data: TickerData): MarketData {
  return {
    symbol: data.s,
    price: parseFloat(data.c),
    priceChange: parseFloat(data.p),
    priceChangePercent: parseFloat(data.P),
    high24h: parseFloat(data.h),
    low24h: parseFloat(data.l),
    volume24h: parseFloat(data.v),
    lastUpdate: data.E,
  }
}

export function getReconnectDelay(attempt: number): number {
  const BASE_RECONNECT_DELAY = 1000
  const MAX_RECONNECT_DELAY = 30000
  return Math.min(BASE_RECONNECT_DELAY * Math.pow(2, attempt), MAX_RECONNECT_DELAY)
}
