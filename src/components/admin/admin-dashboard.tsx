'use client'

import { useLanguage } from '@/lib/i18n'
import {
  Users,
  FileText,
  Heart,
  MessageCircle,
  Star,
  TrendingUp,
  Eye,
  BarChart3,
} from 'lucide-react'

interface DailyCount {
  date: string
  count: number
}

interface RecentUser {
  id: string
  full_name: string | null
  username: string | null
  created_at: string
}

interface TopPage {
  path: string
  count: number
}

interface AdminDashboardProps {
  totalUsers: number
  totalPosts: number
  openPosts: number
  closedPosts: number
  totalMatches: number
  activeMatches: number
  completedMatches: number
  totalMessages: number
  totalReviews: number
  avgRating: number
  signupsLast7Days: DailyCount[]
  postsLast7Days: DailyCount[]
  recentSignups: RecentUser[]
  totalPageViews: number
  viewsLast7Days: DailyCount[]
  topPages: TopPage[]
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Users
  label: string
  value: number | string
  sub?: string
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

function MiniBarChart({
  data,
  label,
}: {
  data: DailyCount[]
  label: string
}) {
  const max = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="mb-3 text-sm font-medium text-muted-foreground">
        {label}
      </h3>
      <div className="flex items-end gap-1.5" style={{ height: 80 }}>
        {data.map((d) => (
          <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-sm bg-indigo-500"
              style={{
                height: `${(d.count / max) * 100}%`,
                minHeight: d.count > 0 ? 4 : 0,
              }}
            />
            <span className="text-[10px] text-muted-foreground">
              {new Date(d.date).toLocaleDateString(undefined, {
                weekday: 'short',
              })}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-right text-xs text-muted-foreground">
        Total: {data.reduce((s, d) => s + d.count, 0)}
      </p>
    </div>
  )
}

export function AdminDashboard({
  totalUsers,
  totalPosts,
  openPosts,
  closedPosts,
  totalMatches,
  activeMatches,
  completedMatches,
  totalMessages,
  totalReviews,
  avgRating,
  signupsLast7Days,
  postsLast7Days,
  recentSignups,
  totalPageViews,
  viewsLast7Days,
  topPages,
}: AdminDashboardProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          icon={Users}
          label={t('admin.totalUsers')}
          value={totalUsers}
        />
        <StatCard
          icon={FileText}
          label={t('admin.totalPosts')}
          value={totalPosts}
          sub={`${openPosts} ${t('admin.openPosts').toLowerCase()} / ${closedPosts} ${t('admin.closedPosts').toLowerCase()}`}
        />
        <StatCard
          icon={Heart}
          label={t('admin.totalMatches')}
          value={totalMatches}
          sub={`${activeMatches} ${t('admin.activeMatches').toLowerCase()} / ${completedMatches} ${t('admin.completedMatches').toLowerCase()}`}
        />
        <StatCard
          icon={MessageCircle}
          label={t('admin.totalMessages')}
          value={totalMessages}
        />
        <StatCard
          icon={Star}
          label={t('admin.totalReviews')}
          value={totalReviews}
          sub={`${t('admin.avgRating')}: ${avgRating > 0 ? avgRating.toFixed(1) : '—'}`}
        />
        <StatCard
          icon={Eye}
          label={t('admin.totalPageViews')}
          value={totalPageViews}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-3 sm:grid-cols-2">
        <MiniBarChart
          data={viewsLast7Days}
          label={t('admin.viewsLast7Days')}
        />
        <MiniBarChart
          data={signupsLast7Days}
          label={t('admin.signupsLast7Days')}
        />
        <MiniBarChart
          data={postsLast7Days}
          label={t('admin.postsLast7Days')}
        />

        {/* Top pages */}
        <div className="rounded-xl border bg-card p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            {t('admin.topPages')}
          </h3>
          {topPages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet</p>
          ) : (
            <div className="space-y-1.5">
              {topPages.map((page) => (
                <div
                  key={page.path}
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-1.5"
                >
                  <span className="truncate text-sm">{page.path}</span>
                  <span className="ml-2 shrink-0 text-xs text-muted-foreground">
                    {page.count} {t('admin.views')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent signups */}
      <div className="rounded-xl border bg-card p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          {t('admin.recentSignups')}
        </h3>
        {recentSignups.length === 0 ? (
          <p className="text-sm text-muted-foreground">No signups yet</p>
        ) : (
          <div className="space-y-2">
            {recentSignups.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">
                    {user.full_name || 'Unnamed'}
                  </p>
                  {user.username && (
                    <p className="text-xs text-muted-foreground">
                      @{user.username}
                    </p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
