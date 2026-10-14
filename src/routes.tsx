import { createBrowserRouter, Navigate } from 'react-router'

import { AppLayout } from '@/layouts/app-layout'
import { Checklist } from '@/pages/checklist'
import { EditChecklist } from '@/pages/edit-checklist'
import { MentorDashboard } from '@/pages/mentor-dashboard'
import { SignIn } from '@/pages/sign-in'
import { SubsystemChecklist } from '@/pages/subsystem-checklist'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: SignIn,
  },
  {
    Component: AppLayout,
    children: [
      { path: '/checklist', Component: Checklist },
      { path: '/checklist/:subsystemId', Component: SubsystemChecklist },
      { path: '/edit', Component: EditChecklist },
      { path: '/mentor-dashboard', Component: MentorDashboard },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
