'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n'
import { FileText, Eye, Clock, AlertCircle, Plus } from 'lucide-react'
import type { ContractWithSubmissions, Profile } from '@/types/database'
import { ContractStatusBadge } from './contract-status-badge'

interface ChatContractBarProps {
  contract: ContractWithSubmissions | null
  currentUserId: string
  partner: Profile
  onOpenPanel: () => void
}

export function ChatContractBar({
  contract,
  currentUserId,
  partner,
  onOpenPanel,
}: ChatContractBarProps) {
  const { t } = useLanguage()

  // Calculate deadline info for accepted contracts
  const getDeadlineText = () => {
    if (!contract || contract.status !== 'accepted') return null
    const deadlineDate = new Date(contract.deadline)
    const now = new Date()
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const isPassed = diffDays < 0

    if (isPassed) {
      return {
        text: t('contract.deadlinePassed' as any),
        className: 'text-red-600',
      }
    }
    return {
      text: t('contract.daysRemaining' as any).replace('{n}', String(diffDays)),
      className: 'text-green-600',
    }
  }

  const isCreator = contract?.created_by === currentUserId

  // No contract
  if (!contract) {
    return (
      <div className="flex items-center justify-between border-b bg-muted/30 py-2 px-4">
        <div className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {t('contract.noContract' as any)}
          </span>
        </div>
        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onOpenPanel}>
          <Plus className="mr-1 h-3 w-3" />
          {t('contract.createContract' as any)}
        </Button>
      </div>
    )
  }

  // Pending - current user created it
  if (contract.status === 'pending' && isCreator) {
    return (
      <div className="flex items-center justify-between border-b bg-muted/30 py-2 px-4">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-yellow-600" />
          <span className="text-xs text-yellow-700">
            {t('contract.waitingResponse' as any)}
          </span>
        </div>
        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onOpenPanel}>
          <Eye className="mr-1 h-3 w-3" />
          {t('contract.viewContract' as any)}
        </Button>
      </div>
    )
  }

  // Pending - partner created it (highlighted)
  if (contract.status === 'pending' && !isCreator) {
    return (
      <div className="flex items-center justify-between border-b bg-indigo-50 py-2 px-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-3.5 w-3.5 text-indigo-600" />
          <span className="text-xs font-medium text-indigo-700">
            {t('contract.newProposal' as any)}
          </span>
        </div>
        <Button
          size="sm"
          className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700"
          onClick={onOpenPanel}
        >
          <Eye className="mr-1 h-3 w-3" />
          {t('contract.viewContract' as any)}
        </Button>
      </div>
    )
  }

  // Accepted
  if (contract.status === 'accepted') {
    const deadlineInfo = getDeadlineText()

    return (
      <div className="flex items-center justify-between border-b bg-muted/30 py-2 px-4">
        <div className="flex items-center gap-2">
          <ContractStatusBadge status="accepted" />
          <span className="text-xs text-muted-foreground">
            {t('contract.active' as any)}
          </span>
          {deadlineInfo && (
            <span className={cn('text-xs font-medium', deadlineInfo.className)}>
              {deadlineInfo.text}
            </span>
          )}
        </div>
        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onOpenPanel}>
          <Eye className="mr-1 h-3 w-3" />
          {t('contract.viewContract' as any)}
        </Button>
      </div>
    )
  }

  // Declined
  if (contract.status === 'declined') {
    return (
      <div className="flex items-center justify-between border-b bg-muted/30 py-2 px-4">
        <div className="flex items-center gap-2">
          <ContractStatusBadge status="declined" />
        </div>
        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onOpenPanel}>
          <Plus className="mr-1 h-3 w-3" />
          {t('contract.createContract' as any)}
        </Button>
      </div>
    )
  }

  // Cancelled or completed - fallback
  return (
    <div className="flex items-center justify-between border-b bg-muted/30 py-2 px-4">
      <div className="flex items-center gap-2">
        <ContractStatusBadge status={contract.status} />
      </div>
      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onOpenPanel}>
        <Eye className="mr-1 h-3 w-3" />
        {t('contract.viewContract' as any)}
      </Button>
    </div>
  )
}
