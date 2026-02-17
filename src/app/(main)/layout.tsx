import { Navbar } from '@/components/layout/navbar'
import { Header } from '@/components/layout/header'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-lg px-4 pt-16 pb-24">{children}</main>
      <Navbar />
    </div>
  )
}
