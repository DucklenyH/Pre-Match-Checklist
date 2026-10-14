import { RouterProvider } from 'react-router/dom'

import { ChecklistProvider } from '@/lib/checklist-context'
import { router } from '@/routes'

function App() {
  return (
    <ChecklistProvider>
      <RouterProvider router={router} />
    </ChecklistProvider>
  )
}

export default App
