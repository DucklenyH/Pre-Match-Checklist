import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

const snapshotKey = 'team-341'

export const getSnapshot = query({
  args: {},
  handler: async (ctx) => {
    const state = await ctx.db.query('appState').withIndex('by_key', (q) => q.eq('key', snapshotKey)).unique()
    const users = await ctx.db.query('teamUsers').take(1000)
    return { snapshot: state?.snapshot ?? null, users: users.map(({ _id, _creationTime, ...user }) => user) }
  },
})

export const saveSnapshot = mutation({
  args: {
    snapshot: v.any(),
    users: v.array(v.object({ name: v.string(), role: v.string(), lastSeenAt: v.number() })),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query('appState').withIndex('by_key', (q) => q.eq('key', snapshotKey)).unique()
    if (existing) await ctx.db.patch(existing._id, { snapshot: args.snapshot, updatedAt: Date.now() })
    else await ctx.db.insert('appState', { key: snapshotKey, snapshot: args.snapshot, updatedAt: Date.now() })

    for (const user of args.users) {
      const existingUser = await ctx.db.query('teamUsers').withIndex('by_name', (q) => q.eq('name', user.name)).unique()
      if (existingUser) await ctx.db.patch(existingUser._id, user)
      else await ctx.db.insert('teamUsers', user)
    }
    return null
  },
})

export const recordCheckIn = mutation({
  args: { name: v.string(), role: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.query('teamUsers').withIndex('by_name', (q) => q.eq('name', args.name)).unique()
    const record = { name: args.name, role: args.role, lastSeenAt: Date.now() }
    if (user) await ctx.db.patch(user._id, record)
    else await ctx.db.insert('teamUsers', record)
    return record
  },
})

const sessionTimeoutMs = 2 * 60 * 1000

export const claimSession = mutation({
  args: { name: v.string(), role: v.string(), sessionId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.query('teamUsers').withIndex('by_name', (q) => q.eq('name', args.name)).unique()
    const now = Date.now()
    const isActiveElsewhere = user?.activeSessionId && user.activeSessionId !== args.sessionId && now - user.lastSeenAt < sessionTimeoutMs
    if (isActiveElsewhere) return { ok: false as const }

    const record = { name: args.name, role: args.role, lastSeenAt: now, activeSessionId: args.sessionId }
    if (user) await ctx.db.patch(user._id, record)
    else await ctx.db.insert('teamUsers', record)
    return { ok: true as const }
  },
})

export const heartbeatSession = mutation({
  args: { name: v.string(), sessionId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.query('teamUsers').withIndex('by_name', (q) => q.eq('name', args.name)).unique()
    if (!user || user.activeSessionId !== args.sessionId) return { ok: false as const }
    await ctx.db.patch(user._id, { lastSeenAt: Date.now() })
    return { ok: true as const }
  },
})

export const releaseSession = mutation({
  args: { name: v.string(), sessionId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.query('teamUsers').withIndex('by_name', (q) => q.eq('name', args.name)).unique()
    if (user?.activeSessionId === args.sessionId) await ctx.db.patch(user._id, { lastSeenAt: 0, activeSessionId: '' })
    return null
  },
})
