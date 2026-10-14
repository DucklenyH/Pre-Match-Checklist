import { Link, Outlet } from 'react-router'
import { Boxes, GitBranch } from 'lucide-react'

import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

export function RootLayout() {
  return (
    <TooltipProvider>
      <div className="min-h-svh bg-background text-foreground">
        <header className="border-b border-border/70">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Boxes className="size-4" />
              </span>
              Framework baseline
            </Link>
            <nav className="flex items-center gap-1">
              <Button variant="ghost" size="sm" render={<Link to="/" />}>
                Home
              </Button>
              <Button
                variant="ghost"
                size="icon"
                render={
                  <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="Open GitHub" />
                }
              >
                <GitBranch />
              </Button>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-6 py-12">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </TooltipProvider>
  )
}
