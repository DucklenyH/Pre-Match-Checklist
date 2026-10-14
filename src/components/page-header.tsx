import { LogOut, Menu, Moon, Sun, X } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from 'next-themes'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { useUiStore } from '@/lib/ui-store'

export function PageHeader() {
  const { resolvedTheme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const displayName = useUiStore((state) => state.displayName)
  const signOut = useUiStore((state) => state.signOut)

  function handleSignOut() {
    signOut()
    setMenuOpen(false)
    void navigate('/')
  }

  return (
    <header className="relative flex items-center justify-between gap-3 border-b-2 border-[#b6d8ed] pb-4 text-[#002a44] dark:border-[#00517e] dark:text-[#f7fbfd]">
      <div className="flex items-center gap-2">
        <img src="/team-341-mascot.png" alt="Team 341 mascot" className="size-10 rounded-lg bg-[#fbdc0a] object-cover" />
        <div>
          <p className="font-black tracking-tight">PRE MATCH CHECKLIST</p>
          {displayName ? <p className="text-xs font-semibold text-[#315979] dark:text-[#b8d2df]">{displayName}</p> : null}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-[#00517e] dark:text-[#f7fbfd]"
          aria-label="Toggle theme"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        >
          {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-[#00517e] dark:text-[#f7fbfd]"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </Button>
        {menuOpen && (
          <div className="absolute right-0 top-12 z-50 w-44 rounded-xl border border-[#b6d8ed] bg-white p-1 shadow-xl dark:border-[#1c5375] dark:bg-[#102f47]">
            <Button variant="ghost" className="h-11 w-full justify-start gap-2 text-[#002a44] dark:text-white" onClick={handleSignOut}>
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
