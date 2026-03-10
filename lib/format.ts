// Format price with appropriate decimal places
export function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
  if (price >= 1) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    })
  }
  if (price >= 0.0001) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    })
  }
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 6,
    maximumFractionDigits: 8,
  })
}

// Format price with abbreviation (e.g., $71k, $1.2M)
export function formatPriceShort(price: number): string {
  if (price >= 1_000_000) {
    return `$${(price / 1_000_000).toFixed(1)}M`
  }
  if (price >= 1_000) {
    return `$${(price / 1_000).toFixed(0)}k`
  }
  return `$${price.toFixed(price < 1 ? 4 : 2)}`
}

// Format percentage change
export function formatPercent(percent: number): string {
  const sign = percent >= 0 ? '+' : ''
  return `${sign}${percent.toFixed(2)}%`
}

// Format volume with abbreviation
export function formatVolume(volume: number): string {
  if (volume >= 1_000_000_000) {
    return `${(volume / 1_000_000_000).toFixed(2)}B`
  }
  if (volume >= 1_000_000) {
    return `${(volume / 1_000_000).toFixed(2)}M`
  }
  if (volume >= 1_000) {
    return `${(volume / 1_000).toFixed(2)}K`
  }
  return volume.toFixed(2)
}

// Format timestamp to readable time
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

// Format timestamp to relative time
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 1000) {
    return 'just now'
  }
  if (diff < 60_000) {
    const seconds = Math.floor(diff / 1000)
    return `${seconds}s ago`
  }
  if (diff < 3_600_000) {
    const minutes = Math.floor(diff / 60_000)
    return `${minutes}m ago`
  }
  return formatTimestamp(timestamp)
}

// Get symbol display name (remove USDT suffix)
export function getSymbolName(symbol: string): string {
  return symbol.replace(/USDT$/, '')
}

// Get full pair display (e.g., "BTC/USDT")
export function getPairDisplay(symbol: string): string {
  const base = symbol.replace(/USDT$/, '')
  return `${base}/USDT`
}

// Get crypto icon URL from CoinGecko CDN
const COIN_ID_MAP: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BNB: 'binancecoin',
  XRP: 'ripple',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  SOL: 'solana',
  DOT: 'polkadot',
  MATIC: 'matic-network',
  LTC: 'litecoin',
  SHIB: 'shiba-inu',
  AVAX: 'avalanche-2',
  LINK: 'chainlink',
  ATOM: 'cosmos',
  UNI: 'uniswap',
}

export function getCryptoIconUrl(symbol: string): string {
  const base = getSymbolName(symbol)
  const coinId = COIN_ID_MAP[base]
  if (coinId) {
    return `https://assets.coingecko.com/coins/images/${getCoinGeckoId(coinId)}/small/${coinId}.png`
  }
  // Fallback to CryptoCompare
  return `https://www.cryptocompare.com/media/37746251/${base.toLowerCase()}.png`
}

// CoinGecko image IDs
function getCoinGeckoId(coinId: string): number {
  const ids: Record<string, number> = {
    bitcoin: 1,
    ethereum: 279,
    binancecoin: 825,
    ripple: 44,
    cardano: 975,
    dogecoin: 5,
    solana: 4128,
    polkadot: 12171,
    'matic-network': 4713,
    litecoin: 2,
    'shiba-inu': 11939,
    'avalanche-2': 12559,
    chainlink: 877,
    cosmos: 1481,
    uniswap: 12504,
  }
  return ids[coinId] || 1
}
