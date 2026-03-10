import { MarketsGrid } from '@/components/markets-grid'

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-balance">Crypto Market Dashboard</h1>
        <p className="text-muted-foreground text-balance">
          Real-time cryptocurrency prices powered by Binance WebSocket streams.
        </p>
      </div>
      <MarketsGrid />
    </div>
  )
}
