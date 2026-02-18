'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n'
import { Calendar, Clock, FileText, Hourglass } from 'lucide-react'
import type { ContractWithSubmissions, Profile } from '@/types/database'
import { ContractStatusBadge } from './contract-status-badge'
import { CreateContractDialog } from './create-contract-dialog'
import { ContractResponseDialog } from './contract-response-dialog'
import { SubmitWorkDialog } from './submit-work-dialog'
import { SubmissionList } from './submission-list'

interface ContractPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  matchId: string
  currentUserId: string
  partner: Profile
  userAId: string
  userBId: string
  contract: ContractWithSubmissions | null
  onContractChange: () => void
}

export function ContractPanel({
  open,
  onOpenChange,
  matchId,
  currentUserId,
  partner,
  userAId,
  userBId,
  contract,
  onContractChange,
}: ContractPanelProps) {
  const { t } = useLanguage()
  const partnerName = partner.full_name || partner.username || '?'

  // Calculate deadline info
  const getDeadlineInfo = () => {
    if (!contract) return null
    const deadlineDate = new Date(contract.deadline)
    const now = new Date()
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const isPassed = diffDays < 0

    return { deadlineDate, diffDays, isPassed }
  }

  const deadlineInfo = getDeadlineInfo()

  // Determine label names
  const isCurrentUserA = currentUserId === userAId
  const nameA = isCurrentUserA ? 'You' : partnerName
  const nameB = isCurrentUserA ? partnerName : 'You'

  // Determine which state we're in
  const isCreator = contract?.created_by === currentUserId
  const isPending = contract?.status === 'pending'
  const isAccepted = contract?.status === 'accepted'
  const isDeclined = contract?.status === 'declined'
  const isCancelled = contract?.status === 'cancelled'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t('contract.contractDetails' as any)}</SheetTitle>
          <SheetDescription>
            {contract
              ? contract.title
              : t('contract.noContractHint' as any)}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-4 space-y-6">
          {/* State: No contract */}
          {!contract && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                {t('contract.noContract' as any)}
              </p>
              <CreateContractDialog
                matchId={matchId}
                currentUserId={currentUserId}
                partnerName={partnerName}
                userAId={userAId}
                userBId={userBId}
                onCreated={onContractChange}
              />
            </div>
          )}

          {/* Contract exists - show details */}
          {contract && (
            <>
              {/* Status + Title */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <ContractStatusBadge status={contract.status} />
                  {deadlineInfo && (
                    <div
                      className={cn(
                        'flex items-center gap-1 text-xs font-medium',
                        deadlineInfo.isPassed
                          ? 'text-red-600'
                          : 'text-green-600'
                      )}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      {deadlineInfo.isPassed
                        ? t('contract.deadlinePassed' as any)
                        : t('contract.daysRemaining' as any).replace(
                            '{n}',
                            String(deadlineInfo.diffDays)
                          )}
                    </div>
                  )}
                </div>

                <h3 className="text-base font-semibold">{contract.title}</h3>

                {/* Deadline */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {t('contract.deadline' as any)}:{' '}
                    {new Date(contract.deadline).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Requirements */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {t('contract.requirementsFor' as any).replace('{name}', nameA)}
                  </p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap rounded-md bg-muted/50 p-3">
                    {contract.requirements_a}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {t('contract.requirementsFor' as any).replace('{name}', nameB)}
                  </p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap rounded-md bg-muted/50 p-3">
                    {contract.requirements_b}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {contract.notes && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {t('contract.notes' as any)}
                    </p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {contract.notes}
                    </p>
                  </div>
                </>
              )}

              <Separator />

              {/* Actions based on state */}
              {/* Pending + creator is current user: waiting for response */}
              {isPending && isCreator && (
                <div className="flex items-center gap-2 rounded-md bg-yellow-50 p-3">
                  <Hourglass className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-700">
                    {t('contract.waitingResponse' as any)}
                  </p>
                </div>
              )}

              {/* Pending + creator is partner: show accept/decline */}
              {isPending && !isCreator && (
                <ContractResponseDialog
                  contract={contract}
                  onResponded={onContractChange}
                />
              )}

              {/* Accepted: show submit work + submissions */}
              {isAccepted && (
                <div className="space-y-4">
                  <SubmitWorkDialog
                    contractId={contract.id}
                    currentUserId={currentUserId}
                    onSubmitted={onContractChange}
                  />

                  <SubmissionList
                    submissions={contract.contract_submissions || []}
                    currentUserId={currentUserId}
                    partnerName={partnerName}
                    onReviewed={onContractChange}
                  />
                </div>
              )}

              {/* Declined or cancelled: allow creating a new contract */}
              {(isDeclined || isCancelled) && (
                <div className="flex flex-col items-center gap-3 py-4">
                  <p className="text-sm text-muted-foreground">
                    {t('contract.noContractHint' as any)}
                  </p>
                  <CreateContractDialog
                    matchId={matchId}
                    currentUserId={currentUserId}
                    partnerName={partnerName}
                    userAId={userAId}
                    userBId={userBId}
                    onCreated={onContractChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
