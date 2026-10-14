import { RouterProvider } from 'react-router/dom'

import { ChecklistProvider } from '@/lib/checklist-context'
import { router } from '@/routes'
import { SessionPresence } from '@/components/session-presence'

function App({ cloudEnabled = false }: { cloudEnabled?: boolean }) {
  return (
    <ChecklistProvider cloudEnabled={cloudEnabled}>
      <SessionPresence enabled={cloudEnabled} />
      <RouterProvider router={router} />
    </ChecklistProvider>
  )
}

export default App
