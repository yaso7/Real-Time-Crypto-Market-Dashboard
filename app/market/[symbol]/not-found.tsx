import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MarketNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex items-center justify-center size-16 rounded-full bg-muted mb-6">
        <AlertCircle className="size-8 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Market Not Found</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        The trading pair you&apos;re looking for doesn&apos;t exist or isn&apos;t currently supported.
      </p>
      <Button asChild>
        <Link href="/">View All Markets</Link>
      </Button>
    </div>
  )
}
