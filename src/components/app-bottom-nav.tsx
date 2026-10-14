import { ClipboardCheck, PencilRuler, ShieldCheck } from 'lucide-react'
import { NavLink } from 'react-router'

import { useUiStore } from '@/lib/ui-store'

const links = [
  { to: '/checklist', label: 'Pre Match Checklist', icon: ClipboardCheck, roles: ['Student', 'Subsystem Leader', 'Mentor'] },
  { to: '/edit', label: 'Edit Subsystem Checklist', icon: PencilRuler, roles: ['Subsystem Leader', 'Mentor'] },
  { to: '/mentor-dashboard', label: 'Mentor Dashboard', icon: ShieldCheck, roles: ['Mentor'] },
] as const

export function AppBottomNav() {
  const role = useUiStore((state) => state.role)
  const visibleLinks = links.filter((link) => link.roles.some((allowedRole) => allowedRole === role))

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#b6d8ed] bg-[#eaf4fb]/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-6px_22px_rgb(0_55_92/0.08)] backdrop-blur dark:border-[#1c5375] dark:bg-[#071827]/95 dark:shadow-[0_-6px_22px_rgb(0_0_0/0.28)]">
      <div className={`mx-auto grid max-w-xl gap-2 ${visibleLinks.length === 1 ? 'grid-cols-1' : visibleLinks.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {visibleLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold transition-colors ${isActive ? 'bg-[#00517e] text-white shadow-sm' : 'text-[#315979] hover:bg-[#d8ecf8] dark:text-[#a9c9df] dark:hover:bg-[#10253a]'}`}
          >
            <Icon className="size-5" aria-hidden />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
