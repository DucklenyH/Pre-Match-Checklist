import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UiState = {
  isSignedIn: boolean
  displayName: string
  role: 'Student' | 'Subsystem Leader' | 'Mentor'
  activeTab: string
  isSidebarOpen: boolean
  selectedItemId: string | null
  mentorCanEditMatch: boolean
  signIn: (displayName: string, role: UiState['role']) => void
  signOut: () => void
  setActiveTab: (activeTab: string) => void
  setSidebarOpen: (isSidebarOpen: boolean) => void
  setSelectedItemId: (selectedItemId: string | null) => void
  setMentorCanEditMatch: (mentorCanEditMatch: boolean) => void
}

export const useUiStore = create<UiState>()(persist((set) => ({
  isSignedIn: false,
  displayName: '',
  role: 'Student',
  activeTab: 'overview',
  isSidebarOpen: false,
  selectedItemId: null,
  mentorCanEditMatch: false,
  signIn: (displayName, role) => set({ displayName, role, isSignedIn: true }),
  signOut: () => set({ displayName: '', role: 'Student', isSignedIn: false }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  setSelectedItemId: (selectedItemId) => set({ selectedItemId }),
  setMentorCanEditMatch: (mentorCanEditMatch) => set({ mentorCanEditMatch }),
}), {
  name: 'pre-match-checklist-ui',
  partialize: (state) => ({
    isSignedIn: state.isSignedIn,
    displayName: state.displayName,
    role: state.role,
  }),
}))
