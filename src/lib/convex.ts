import { ConvexReactClient } from 'convex/react'

const convexUrl = (import.meta.env.VITE_CONVEX_URL as string | undefined) || (
  import.meta.env.PROD ? 'https://focused-elephant-14.convex.cloud' : undefined
)

export const convex = convexUrl ? new ConvexReactClient(convexUrl) : null
