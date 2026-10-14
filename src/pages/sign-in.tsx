import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useChecklist } from '@/lib/checklist-context'
import { useUiStore } from '@/lib/ui-store'

export function SignIn() {
  const navigate = useNavigate()
  const { members, registerMember } = useChecklist()
  const isSignedIn = useUiStore((state) => state.isSignedIn)
  const signIn = useUiStore((state) => state.signIn)
  const [firstName, setFirstName] = useState('')
  const [lastInitial, setLastInitial] = useState('')

  if (isSignedIn) return <Navigate to="/checklist" replace />

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedName = `${firstName.trim()} ${lastInitial.trim().toUpperCase()}`.trim()
    if (!firstName.trim() || !lastInitial.trim()) return
    const member = members.find((item) => item.name.toLowerCase() === normalizedName.toLowerCase())
    registerMember(normalizedName, member?.role ?? 'Student')
    signIn(normalizedName, member?.role ?? 'Student')
    void navigate('/checklist')
  }

  return (
    <main className="grid min-h-svh place-items-center bg-[#eaf4fb] px-6 py-10 text-[#002a44] dark:bg-[#071827] dark:text-[#eef8ff]">
      <Card className="w-full max-w-sm border-2 border-[#b6d8ed] bg-white shadow-[0_18px_50px_rgb(0_55_92/0.12)] dark:border-[#1c5375] dark:bg-[#0d2a40] dark:shadow-[0_18px_50px_rgb(0_0_0/0.24)]">
        <CardHeader className="items-center gap-4 text-center">
            <img
              src="/team-341-logo.png"
              alt="Team 341"
              className="size-20 rounded-2xl bg-[#fbdc0a] object-contain"
            />
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black tracking-tight">PRE MATCH CHECKLIST</CardTitle>
            <p className="text-sm text-[#315979] dark:text-[#b8d2df]">Please enter your first and last initial </p>
          </div>
        </CardHeader>
        <CardContent>
          <form className="grid gap-5" onSubmit={submit}>
            <div className="grid grid-cols-[minmax(0,1fr)_5rem] gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" autoFocus className="h-12 border-[#0086cb] bg-white text-base dark:bg-[#102f47] dark:text-white" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-initial">Last initial</Label>
                <Input id="last-initial" value={lastInitial} onChange={(event) => setLastInitial(event.target.value.slice(0, 1))} maxLength={1} autoCapitalize="characters" className="h-12 border-[#0086cb] bg-white text-base uppercase dark:bg-[#102f47] dark:text-white" />
              </div>
            </div>
            <Button type="submit" size="lg" className="mt-2 h-12 bg-[#00517e] text-white hover:bg-[#003f61]">
              Enter checklist
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
