const sessionStorageKey = 'pre-match-checklist-session'

export function getSessionId() {
  const existing = sessionStorage.getItem(sessionStorageKey)
  if (existing) return existing
  const sessionId = crypto.randomUUID()
  sessionStorage.setItem(sessionStorageKey, sessionId)
  return sessionId
}
