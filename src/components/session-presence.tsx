import { useEffect } from 'react'
import { toast } from 'sonner'

import { api } from '../../convex/_generated/api'
import { convex } from '@/lib/convex'
import { getSessionId } from '@/lib/session'
import { useUiStore } from '@/lib/ui-store'

export function SessionPresence({ enabled }: { enabled: boolean }) {
  const isSignedIn = useUiStore((state) => state.isSignedIn)
  const displayName = useUiStore((state) => state.displayName)
  const signOut = useUiStore((state) => state.signOut)

  useEffect(() => {
    if (!enabled || !convex || !isSignedIn || !displayName) return
    const client = convex
    const sessionId = getSessionId()
    const heartbeat = async () => {
      const result = await client.mutation(api.app.heartbeatSession, { name: displayName, sessionId })
      if (!result.ok) {
        signOut()
        toast.error('This name was signed in on another device.')
      }
    }
    const interval = window.setInterval(() => void heartbeat(), 30_000)
    void heartbeat()
    return () => window.clearInterval(interval)
  }, [displayName, enabled, isSignedIn, signOut])

  return null
}
