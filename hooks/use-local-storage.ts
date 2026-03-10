'use client'

import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(`[v0] Error reading localStorage key "${key}":`, error)
    }
    setIsLoaded(true)
  }, [key])

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setStoredValue(prev => {
        const valueToStore = value instanceof Function ? value(prev) : value
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        } catch (error) {
          console.error(`[v0] Error setting localStorage key "${key}":`, error)
        }
        return valueToStore
      })
    },
    [key]
  )

  return [storedValue, setValue, isLoaded] as const
}

// Hook specifically for favorites
export function useFavorites() {
  const [favorites, setFavorites, isLoaded] = useLocalStorage<string[]>('crypto-favorites', [])

  const toggleFavorite = useCallback(
    (symbol: string) => {
      setFavorites((prev) =>
        prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
      )
    },
    [setFavorites]
  )

  const isFavorite = useCallback((symbol: string) => favorites.includes(symbol), [favorites])

  return { favorites, toggleFavorite, isFavorite, isLoaded }
}

// Hook for recently viewed
export function useRecentlyViewed(maxItems = 5) {
  const [recentlyViewed, setRecentlyViewed, isLoaded] = useLocalStorage<string[]>(
    'crypto-recently-viewed',
    []
  )

  const addRecentlyViewed = useCallback(
    (symbol: string) => {
      setRecentlyViewed((prev) => {
        const filtered = prev.filter((s) => s !== symbol)
        return [symbol, ...filtered].slice(0, maxItems)
      })
    },
    [setRecentlyViewed, maxItems]
  )

  return { recentlyViewed, addRecentlyViewed, isLoaded }
}
