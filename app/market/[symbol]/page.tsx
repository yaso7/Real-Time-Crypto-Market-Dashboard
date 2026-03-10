import { notFound } from 'next/navigation'
import { TRADING_PAIRS } from '@/lib/types'
import { MarketDetail } from '@/components/market-detail'
import type { Metadata } from 'next'
import { getSymbolName, getPairDisplay } from '@/lib/format'

interface MarketPageProps {
  params: Promise<{ symbol: string }>
}

export async function generateMetadata({ params }: MarketPageProps): Promise<Metadata> {
  const { symbol } = await params
  const symbolName = getSymbolName(symbol)
  const pairDisplay = getPairDisplay(symbol)

  return {
    title: `${symbolName} Price - ${pairDisplay} | CryptoWatch`,
    description: `Track ${symbolName} (${pairDisplay}) price in real-time with live WebSocket updates. View current price, 24h change, volume, and more.`,
  }
}

export async function generateStaticParams() {
  return TRADING_PAIRS.map((symbol) => ({
    symbol,
  }))
}

export default async function MarketPage({ params }: MarketPageProps) {
  const { symbol } = await params
  const upperSymbol = symbol.toUpperCase()

  // Validate symbol
  if (!TRADING_PAIRS.includes(upperSymbol as (typeof TRADING_PAIRS)[number])) {
    notFound()
  }

  return <MarketDetail symbol={upperSymbol} />
}
