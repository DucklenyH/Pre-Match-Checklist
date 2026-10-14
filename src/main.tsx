import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import { ThemeProvider } from 'next-themes'

import App from '@/App'
import { convex } from '@/lib/convex'
import '@/index.css'

const content = (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <App />
  </ThemeProvider>
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {convex ? <ConvexAuthProvider client={convex}>{content}</ConvexAuthProvider> : content}
  </StrictMode>,
)
