'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ConnectionStatus, MarketData } from '@/lib/types'
import { validateTickerData, parseTickerData, getReconnectDelay } from '@/lib/binance-utils'

interface UseBinanceWebSocketOptions {
  symbols: string[]
  onMessage?: (data: MarketData) => void
}

interface UseBinanceWebSocketReturn {
  marketData: Map<string, MarketData>
  status: ConnectionStatus
  reconnect: () => void
  error: string | null
}

const MAX_RECONNECT_ATTEMPTS = 5

export function useBinanceWebSocket({
  symbols,
  onMessage,
}: UseBinanceWebSocketOptions): UseBinanceWebSocketReturn {
  const [marketData, setMarketData] = useState<Map<string, MarketData>>(new Map())
  const [status, setStatus] = useState<ConnectionStatus>('disconnected')
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttempts = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const symbolsRef = useRef(symbols)
  const onMessageRef = useRef(onMessage)
  const connectionIdRef = useRef<number>(0)
  
  // Update refs when dependencies change
  useEffect(() => {
    symbolsRef.current = symbols
  }, [symbols])
  
  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  const connect = useCallback(() => {
    const currentConnectionId = ++connectionIdRef.current
    
    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    // Clear any pending reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    const currentSymbols = symbolsRef.current
    if (currentSymbols.length === 0) {
      setStatus('disconnected')
      setError(null)
      return
    }

    setStatus('connecting')
    setError(null)

    // Build stream URL for multiple symbols
    const streams = currentSymbols.map((s) => `${s.toLowerCase()}@ticker`).join('/')
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`

    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      // Check if this is still the current connection
      if (currentConnectionId !== connectionIdRef.current) {
        ws.close()
        return
      }
      
      setStatus('connected')
      setError(null)
      reconnectAttempts.current = 0
    }

    ws.onmessage = (event) => {
      // Check if this is still the current connection
      if (currentConnectionId !== connectionIdRef.current) {
        return
      }
      
      try {
        const message = JSON.parse(event.data)
        
        // Validate message structure
        if (!message || typeof message !== 'object' || !message.data) {
          throw new Error('Invalid message structure received')
        }
        
        const tickerData = message.data
        
        if (!validateTickerData(tickerData)) {
          throw new Error('Invalid ticker data structure received')
        }
        
        const parsed = parseTickerData(tickerData)

        setMarketData((prev) => {
          const next = new Map(prev)
          next.set(parsed.symbol, parsed)
          return next
        })

        setError(null)
        onMessageRef.current?.(parsed)
      } catch (error) {
        const errorMsg = `Failed to parse WebSocket data: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error('[v0] Error parsing WebSocket message:', error)
        setError(errorMsg)
      }
    }

    ws.onerror = (error) => {
      // Check if this is still the current connection
      if (currentConnectionId !== connectionIdRef.current) {
        return
      }
      
      console.error('[v0] WebSocket error:', error)
      setError('WebSocket connection error')
    }

    ws.onclose = (event) => {
      // Check if this is still the current connection
      if (currentConnectionId !== connectionIdRef.current) {
        return
      }
      
      wsRef.current = null
      setStatus('disconnected')

      // Don't reconnect if it was a normal closure or no more attempts left
      if (event.wasClean || reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
        if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
          setError('Maximum reconnection attempts reached')
        }
        return
      }

      // Attempt to reconnect with exponential backoff
      reconnectAttempts.current += 1
      setStatus('reconnecting')
      
      const delay = getReconnectDelay(reconnectAttempts.current)
      reconnectTimeoutRef.current = setTimeout(() => {
        connect()
      }, delay)
    }
  }, [])

  const reconnect = useCallback(() => {
    reconnectAttempts.current = 0
    setError(null)
    connect()
  }, [connect])

  useEffect(() => {
    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [connect])

  return { marketData, status, reconnect, error }
}
