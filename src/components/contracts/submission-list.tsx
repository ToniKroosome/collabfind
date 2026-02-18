'use client'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { SUBMISSION_STATUS_COLORS } from '@/lib/constants'
import { useLanguage } from '@/lib/i18n'
import { ExternalLink, FileText, AlertCircle } from 'lucide-react'
import type { ContractSubmission } from '@/types/database'
import { SubmissionReviewDialog } from './submission-review-dialog'

const SUBMISSION_STATUS_MAP: Record<string, string> = {
  pending: 'submission.pending',
  approved: 'submission.approved',
  revision_requested: 'submission.revisionRequested',
}

interface SubmissionListProps {
  submissions: ContractSubmission[]
  currentUserId: string
  partnerName: string
  onReviewed?: () => void
}

export function SubmissionList({
  submissions,
  currentUserId,
  partnerName,
  onReviewed,
}: SubmissionListProps) {
  const { t } = useLanguage()

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <FileText className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          {t('submission.noSubmissions' as any)}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold">{t('submission.submissions' as any)}</h4>
      {submissions.map((submission, index) => {
        const statusKey = SUBMISSION_STATUS_MAP[submission.status]
        const statusLabel = statusKey ? t(statusKey as any) : submission.status
        const colorClass =
          SUBMISSION_STATUS_COLORS[submission.status] || 'bg-gray-100 text-gray-700'
        const isFromPartner = submission.submitted_by !== currentUserId
        const canReview = submission.status === 'pending' && isFromPartner

        return (
          <div key={submission.id}>
            {index > 0 && <Separator className="mb-4" />}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={colorClass}>
                    {statusLabel}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {isFromPartner ? partnerName : 'You'}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(submission.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <p className="text-sm whitespace-pre-wrap">{submission.description}</p>

              {submission.proof_url && (
                <a
                  href={submission.proof_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {t('submission.proofUrl' as any)}
                </a>
              )}

              {submission.revision_note && (
                <div className="flex items-start gap-2 rounded-md bg-orange-50 p-2.5">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-600" />
                  <p className="text-xs text-orange-700">{submission.revision_note}</p>
                </div>
              )}

              {canReview && (
                <SubmissionReviewDialog
                  submission={submission}
                  currentUserId={currentUserId}
                  onReviewed={onReviewed}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
