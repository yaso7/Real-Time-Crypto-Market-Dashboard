'use client'

import { ArrowDownAZ, ArrowUpDown, Star, TrendingDown, TrendingUp } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SortOption } from '@/lib/types'

interface SortSelectProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: 'default', label: 'Default', icon: <ArrowUpDown className="size-4" /> },
  { value: 'favorites', label: 'Favorites first', icon: <Star className="size-4" /> },
  { value: 'alphabetical', label: 'A-Z', icon: <ArrowDownAZ className="size-4" /> },
  { value: 'price-high', label: 'Highest price', icon: <TrendingUp className="size-4" /> },
  { value: 'price-low', label: 'Lowest price', icon: <TrendingDown className="size-4" /> },
  { value: 'change-high', label: 'Top gainers', icon: <TrendingUp className="size-4" /> },
  { value: 'change-low', label: 'Top losers', icon: <TrendingDown className="size-4" /> },
]

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <span className="flex items-center gap-2">
              {option.icon}
              {option.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
