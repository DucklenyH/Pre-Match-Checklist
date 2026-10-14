import { create } from 'zustand'

type UiState = {
  isSignedIn: boolean
  displayName: string
  role: 'Student' | 'Subsystem Leader' | 'Mentor'
  activeTab: string
  isSidebarOpen: boolean
  selectedItemId: string | null
  signIn: (displayName: string, role: UiState['role']) => void
  signOut: () => void
  setActiveTab: (activeTab: string) => void
  setSidebarOpen: (isSidebarOpen: boolean) => void
  setSelectedItemId: (selectedItemId: string | null) => void
}

export const useUiStore = create<UiState>((set) => ({
  isSignedIn: false,
  displayName: '',
  role: 'Student',
  activeTab: 'overview',
  isSidebarOpen: false,
  selectedItemId: null,
  signIn: (displayName, role) => set({ displayName, role, isSignedIn: true }),
  signOut: () => set({ displayName: '', role: 'Student', isSignedIn: false }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  setSelectedItemId: (selectedItemId) => set({ selectedItemId }),
}))
