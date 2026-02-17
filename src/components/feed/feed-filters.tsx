'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { NICHES, COLLAB_TYPES } from '@/lib/constants'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export function FeedFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeNiche = searchParams.get('niche') || ''
  const activeType = searchParams.get('type') || ''

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/feed?${params.toString()}`)
  }

  return (
    <div className="space-y-3">
      {/* Niche chips - horizontal scroll */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          <Badge
            variant={!activeNiche ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer shrink-0',
              !activeNiche && 'bg-indigo-600 hover:bg-indigo-700'
            )}
            onClick={() => updateFilter('niche', '')}
          >
            All
          </Badge>
          {NICHES.map((niche) => (
            <Badge
              key={niche}
              variant={activeNiche === niche ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer capitalize shrink-0',
                activeNiche === niche && 'bg-indigo-600 hover:bg-indigo-700'
              )}
              onClick={() =>
                updateFilter('niche', activeNiche === niche ? '' : niche)
              }
            >
              {niche}
            </Badge>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Collab type dropdown */}
      <Select
        value={activeType}
        onValueChange={(val) => updateFilter('type', val === 'all' ? '' : val)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All collab types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All collab types</SelectItem>
          {COLLAB_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
