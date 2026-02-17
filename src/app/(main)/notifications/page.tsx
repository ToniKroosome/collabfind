import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NotificationList } from '@/components/notifications/notification-list'
import { SHOW_MOCK_DATA, MOCK_NOTIFICATIONS } from '@/lib/mock-data'
import type { Notification } from '@/types/database'

export default async function NotificationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: dbNotifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  let allNotifications = (dbNotifications as Notification[]) || []
  if (SHOW_MOCK_DATA) {
    allNotifications = [
      ...allNotifications,
      ...(MOCK_NOTIFICATIONS as unknown as Notification[]),
    ].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }

  return (
    <div className="space-y-4 py-4">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <NotificationList notifications={allNotifications} />
    </div>
  )
}
