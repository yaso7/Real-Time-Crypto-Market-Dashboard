// Binance WebSocket ticker data
export interface TickerData {
  e: string // Event type
  E: number // Event time
  s: string // Symbol
  p: string // Price change
  P: string // Price change percent
  w: string // Weighted average price
  x: string // First trade(F)-1 price
  c: string // Last price
  Q: string // Last quantity
  b: string // Best bid price
  B: string // Best bid quantity
  a: string // Best ask price
  A: string // Best ask quantity
  o: string // Open price
  h: string // High price
  l: string // Low price
  v: string // Total traded base asset volume
  q: string // Total traded quote asset volume
  O: number // Statistics open time
  C: number // Statistics close time
  F: number // First trade ID
  L: number // Last trade Id
  n: number // Total number of trades
}

// Processed market data for UI
export interface MarketData {
  symbol: string
  price: number
  priceChange: number
  priceChangePercent: number
  high24h: number
  low24h: number
  volume24h: number
  lastUpdate: number
}

// WebSocket connection status
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting'

// Sort options
export type SortOption = 'default' | 'alphabetical' | 'price-high' | 'price-low' | 'change-high' | 'change-low' | 'favorites'

// Trading pairs to track
export const TRADING_PAIRS = [
  'BTCUSDT',
  'ETHUSDT',
  'BNBUSDT',
  'XRPUSDT',
  'ADAUSDT',
  'DOGEUSDT',
  'SOLUSDT',
  'DOTUSDT',
  'MATICUSDT',
  'LTCUSDT',
  'SHIBUSDT',
  'AVAXUSDT',
  'LINKUSDT',
  'ATOMUSDT',
  'UNIUSDT',
] as const

export type TradingPair = (typeof TRADING_PAIRS)[number]
