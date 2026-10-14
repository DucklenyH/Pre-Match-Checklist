import { authTables } from '@convex-dev/auth/server'
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  ...authTables,
  appState: defineTable({
    key: v.string(),
    snapshot: v.any(),
    updatedAt: v.number(),
  }).index('by_key', ['key']),
  teamUsers: defineTable({
    name: v.string(),
    role: v.string(),
    lastSeenAt: v.number(),
  }).index('by_name', ['name']),
})
