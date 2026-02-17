'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { BadgeCheck, Copy, Check, Loader2 } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { toast } from 'sonner'

interface SocialVerifyDialogProps {
  platform: string
  platformLabel: string
  isVerified: boolean
  hasUrl: boolean
}

export function SocialVerifyDialog({
  platform,
  platformLabel,
  isVerified,
  hasUrl,
}: SocialVerifyDialogProps) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [checking, setChecking] = useState(false)
  const [generating, setGenerating] = useState(false)

  if (isVerified) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-600">
        <BadgeCheck className="h-3.5 w-3.5" />
        {t('verify.verified')}
      </span>
    )
  }

  if (!hasUrl) return null

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/verify-social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, action: 'generate' }),
      })
      const data = await res.json()
      if (data.code) {
        setCode(data.code)
      }
    } catch {
      toast.error(t('toast.verificationFailed'))
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!code) return
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCheck = async () => {
    setChecking(true)
    try {
      const res = await fetch('/api/verify-social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, action: 'check' }),
      })
      const data = await res.json()

      if (data.success) {
        toast.success(t('verify.success'))
        setOpen(false)
        window.location.reload()
      } else if (data.error === 'expired') {
        toast.error(t('verify.expired'))
        setCode(null)
      } else {
        toast.error(t('verify.failed'))
      }
    } catch {
      toast.error(t('toast.verificationFailed'))
    } finally {
      setChecking(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setCode(null); setCopied(false) } }}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-indigo-600"
          onClick={(e) => { e.preventDefault(); setOpen(true) }}
        >
          {t('verify.verify')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('verify.verifyTitle').replace('{platform}', platformLabel)}</DialogTitle>
          <DialogDescription className="space-y-2 pt-2">
            {!code ? (
              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {generating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {t('verify.generateCode')}
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{t('verify.step1')}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono font-semibold text-foreground">
                      {code}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-foreground">
                  {t('verify.step2').replace('{platform}', platformLabel)}
                </p>
                <p className="text-sm text-foreground">{t('verify.step3')}</p>
                <Button
                  onClick={handleCheck}
                  disabled={checking}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {checking ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {checking ? t('verify.checking') : t('verify.check')}
                </Button>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
