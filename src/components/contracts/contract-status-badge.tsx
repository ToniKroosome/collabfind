'use client'

import { Badge } from '@/components/ui/badge'
import { CONTRACT_STATUS_COLORS } from '@/lib/constants'
import { useLanguage } from '@/lib/i18n'

const STATUS_TRANSLATION_MAP: Record<string, string> = {
  pending: 'contract.pending',
  accepted: 'contract.accepted',
  declined: 'contract.declined',
  completed: 'contract.completed',
  cancelled: 'contract.cancelled',
}

interface ContractStatusBadgeProps {
  status: string
}

export function ContractStatusBadge({ status }: ContractStatusBadgeProps) {
  const { t } = useLanguage()

  const colorClass = CONTRACT_STATUS_COLORS[status] || 'bg-gray-100 text-gray-700'
  const translationKey = STATUS_TRANSLATION_MAP[status]
  const label = translationKey ? t(translationKey as any) : status

  return (
    <Badge variant="secondary" className={colorClass}>
      {label}
    </Badge>
  )
}
