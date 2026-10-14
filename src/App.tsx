import { RouterProvider } from 'react-router/dom'

import { ChecklistProvider } from '@/lib/checklist-context'
import { router } from '@/routes'

function App({ cloudEnabled = false }: { cloudEnabled?: boolean }) {
  return (
    <ChecklistProvider cloudEnabled={cloudEnabled}>
      <RouterProvider router={router} />
    </ChecklistProvider>
  )
}

export default App
