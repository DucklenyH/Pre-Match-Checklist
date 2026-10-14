import { useConvexAuth } from '@convex-dev/auth/react'
import { Check, Database, Layers3, LockKeyhole, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useUiStore } from '@/lib/ui-store'

const foundations = [
  { label: 'React Router 7 + Vite SPA', icon: Layers3 },
  { label: 'Tailwind CSS v4 + shadcn/Base UI', icon: Sparkles },
  { label: 'Convex data + live auth', icon: Database },
  { label: 'Strict TypeScript + ephemeral Zustand', icon: LockKeyhole },
]

export function HomePage() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const selectedItemId = useUiStore((state) => state.selectedItemId)
  const setSelectedItemId = useUiStore((state) => state.setSelectedItemId)

  function verifyBaseline() {
    setSelectedItemId('baseline-verified')
    toast.success('Framework baseline is wired.', {
      description: 'Sonner is ready for product-level notifications.',
    })
  }

  const authStatus = isLoading
    ? 'Checking Convex Auth…'
    : isAuthenticated
      ? 'Authenticated with Convex'
      : 'Convex Auth is ready'

  return (
    <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-muted-foreground">
          <span className="size-2 rounded-full bg-emerald-500" />
          {authStatus}
        </div>
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Ready for product work
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">
            A clean starting point for your next idea.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            The app shell is intentionally product-neutral. Routing, theming, UI primitives,
            Convex persistence, Convex Auth, and client-only UI state are ready for the next brief.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={verifyBaseline}>
            <Check />
            Verify baseline
          </Button>
          {selectedItemId && (
            <span className="text-sm text-muted-foreground">Local UI state updated.</span>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="mb-5 text-sm font-medium text-muted-foreground">Included foundations</p>
        <div className="space-y-4">
          {foundations.map(({ label, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3 rounded-xl border border-border/70 p-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-4" />
              </span>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
