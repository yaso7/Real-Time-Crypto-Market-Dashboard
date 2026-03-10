'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getSymbolName } from '@/lib/format'

// CoinGecko asset IDs for reliable icon URLs
const COIN_ICON_MAP: Record<string, { id: number; name: string }> = {
  BTC: { id: 1, name: 'bitcoin' },
  ETH: { id: 279, name: 'ethereum' },
  BNB: { id: 825, name: 'binancecoin' },
  XRP: { id: 44, name: 'ripple' },
  ADA: { id: 975, name: 'cardano' },
  DOGE: { id: 5, name: 'dogecoin' },
  SOL: { id: 4128, name: 'solana' },
  DOT: { id: 12171, name: 'polkadot' },
  MATIC: { id: 4713, name: 'matic-network' },
  LTC: { id: 2, name: 'litecoin' },
  SHIB: { id: 11939, name: 'shiba-inu' },
  AVAX: { id: 12559, name: 'avalanche-2' },
  LINK: { id: 877, name: 'chainlink' },
  ATOM: { id: 1481, name: 'cosmos' },
  UNI: { id: 12504, name: 'uniswap' },
}

function getCryptoIconUrl(symbol: string): string | null {
  const base = getSymbolName(symbol)
  const coin = COIN_ICON_MAP[base]
  if (coin) {
    return `https://assets.coingecko.com/coins/images/${coin.id}/small/${coin.name}.png`
  }
  return null
}

interface CryptoIconProps {
  symbol: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-14',
}

const fontSizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-xl',
}

const imageSizeMap = {
  sm: 32,
  md: 40,
  lg: 56,
}

export function CryptoIcon({ symbol, size = 'md', className }: CryptoIconProps) {
  const [hasError, setHasError] = useState(false)
  const symbolName = getSymbolName(symbol)
  const iconUrl = getCryptoIconUrl(symbol)

  // Fallback to text initials
  if (!iconUrl || hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold',
          sizeMap[size],
          fontSizeMap[size],
          className
        )}
      >
        {symbolName.slice(0, 2)}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full overflow-hidden bg-muted',
        sizeMap[size],
        className
      )}
    >
      <Image
        src={iconUrl}
        alt={`${symbolName} icon`}
        width={imageSizeMap[size]}
        height={imageSizeMap[size]}
        className="object-contain"
        onError={() => setHasError(true)}
        unoptimized
      />
    </div>
  )
}
