import { Navigate, Outlet, useLocation } from 'react-router'

import { AppBottomNav } from '@/components/app-bottom-nav'
import { PageHeader } from '@/components/page-header'
import { useUiStore } from '@/lib/ui-store'

export function AppLayout() {
  const isSignedIn = useUiStore((state) => state.isSignedIn)
  const role = useUiStore((state) => state.role)
  const { pathname } = useLocation()

  if (!isSignedIn) return <Navigate to="/" replace />
  if (pathname === '/edit' && role === 'Student') return <Navigate to="/checklist" replace />
  if (pathname === '/mentor-dashboard' && role !== 'Mentor') return <Navigate to="/checklist" replace />

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-3 pb-28 pt-4 sm:px-8 sm:pt-5">
        <PageHeader />
        <Outlet />
      </div>
      <AppBottomNav />
    </div>
  )
}
