'use client'

import { cn } from '@/lib/utils'
import type { ConnectionStatus } from '@/lib/types'

interface ConnectionStatusBadgeProps {
  status: ConnectionStatus
  onReconnect?: () => void
}

const statusConfig: Record<ConnectionStatus, { label: string; className: string }> = {
  connecting: {
    label: 'Connecting...',
    className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  connected: {
    label: 'Live',
    className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  disconnected: {
    label: 'Disconnected',
    className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  },
  reconnecting: {
    label: 'Reconnecting...',
    className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
}

export function ConnectionStatusBadge({ status, onReconnect }: ConnectionStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
          config.className
        )}
      >
        <span
          className={cn('size-1.5 rounded-full', {
            'bg-emerald-500 animate-pulse': status === 'connected',
            'bg-amber-500 animate-pulse': status === 'connecting' || status === 'reconnecting',
            'bg-red-500': status === 'disconnected',
          })}
        />
        {config.label}
      </div>
      {status === 'disconnected' && onReconnect && (
        <button
          onClick={onReconnect}
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  )
}
