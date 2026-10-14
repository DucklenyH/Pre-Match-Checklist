import { ChevronDown, Plus, Search, ShieldCheck, Trash2, Trophy, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { progressFor, progressForSubsystem, useChecklist, type MatchHistory, type MemberRole } from '@/lib/checklist-context'

export function MentorDashboard() {
  const { competitions, members, history, addCompetition, removeCompetition, updateMemberRole, removeMember, removeHistory } = useChecklist()
  const [rosterOpen, setRosterOpen] = useState(false)
  const [competitionsOpen, setCompetitionsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [newCompetition, setNewCompetition] = useState('')
  const visibleMembers = useMemo(() => members.filter((member) => member.name.toLowerCase().includes(search.toLowerCase())), [members, search])

  function createCompetition() {
    const name = newCompetition.trim()
    if (!name) return
    addCompetition(name)
    setNewCompetition('')
  }

  return (
    <main className="mx-auto max-w-4xl space-y-7 py-8">
      <div className="space-y-2"><h1 className="text-3xl font-black tracking-tight text-[#002a44] dark:text-[#eef8ff] sm:text-4xl">Mentor Dashboard</h1><p className="text-[#315979] dark:text-[#a9c9df]">Manage the roster and review completed match checklists.</p></div>
      <DashboardSection icon={UsersRound} title="Team Roster" description="Assign roles and remove people from the mock roster." open={rosterOpen} onToggle={() => setRosterOpen((value) => !value)}><div className="grid gap-4"><div className="relative"><Search className="pointer-events-none absolute left-3 top-3 size-4 text-[#315979]" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search team members" className="h-11 border-[#0086cb] bg-white pl-9 dark:bg-[#102f47] dark:text-white" /></div><div className="grid gap-3">{visibleMembers.map((member) => <Card key={member.id} className="border-[#b6d8ed] bg-white dark:border-[#29415f] dark:bg-[#102f47]"><CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-[#002a44] dark:text-white">{member.name}</p><p className="text-sm text-[#315979] dark:text-[#a9c9df]">{member.role}</p></div><div className="flex items-center gap-2"><Select value={member.role} onValueChange={(value) => value && updateMemberRole(member.id, value as MemberRole)}><SelectTrigger className="h-10 w-44 border-[#9ecde7] bg-white dark:bg-[#0d2a40]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Student">Student</SelectItem><SelectItem value="Subsystem Leader">Subsystem Leader</SelectItem><SelectItem value="Mentor">Mentor</SelectItem></SelectContent></Select><Button variant="ghost" size="icon" aria-label={`Remove ${member.name}`} className="text-[#c73d3d]" onClick={() => removeMember(member.id)}><Trash2 className="size-4" /></Button></div></CardContent></Card>)}</div></div></DashboardSection>
      <DashboardSection icon={Trophy} title="Competitions" description="Manage the competitions available in the pre-match checklist." open={competitionsOpen} onToggle={() => setCompetitionsOpen((value) => !value)}><div className="grid gap-4"><div className="flex flex-col gap-2 sm:flex-row"><Input value={newCompetition} onChange={(event) => setNewCompetition(event.target.value)} placeholder="e.g. Buckeye Regional" className="h-11 border-[#0086cb] bg-white dark:bg-[#102f47] dark:text-white" /><Button className="h-11 bg-[#00517e] text-white hover:bg-[#003f61]" onClick={createCompetition}><Plus className="size-4" />Add competition</Button></div><div className="grid gap-2">{competitions.map((entry) => <div key={entry} className="flex items-center justify-between rounded-xl border border-[#b6d8ed] bg-[#eaf4fb] px-4 py-3 dark:border-[#29415f] dark:bg-[#102f47]"><span className="font-bold text-[#002a44] dark:text-white">{entry}</span><Button variant="ghost" size="icon" aria-label={`Remove ${entry}`} className="text-[#c73d3d]" disabled={competitions.length <= 1} onClick={() => removeCompetition(entry)}><Trash2 className="size-4" /></Button></div>)}</div></div></DashboardSection>
      <DashboardSection icon={ShieldCheck} title="Match History" description="Review saved mock checklist records by competition and qualification." open={historyOpen} onToggle={() => setHistoryOpen((value) => !value)}><div className="space-y-3">{history.length === 0 ? <div className="rounded-xl bg-[#eaf4fb] px-4 py-8 text-center text-sm text-[#315979] dark:bg-[#102f47] dark:text-[#b8d2df]">Changing the competition or qualification number starts a new mock match-history record.</div> : history.map((match) => <MatchHistoryRow key={match.id} match={match} onDelete={() => removeHistory(match.id)} />)}</div></DashboardSection>
    </main>
  )
}

function DashboardSection({ icon: Icon, title, description, open, onToggle, children }: { icon: typeof UsersRound; title: string; description: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return <section className="overflow-hidden rounded-2xl border border-[#b6d8ed] bg-white/50 dark:border-[#12648b] dark:bg-[#062b43]/40"><Button variant="ghost" className="flex h-auto w-full items-center justify-between rounded-none p-4 text-left hover:bg-[#dff0fa] dark:hover:bg-[#0b4564] sm:p-5" onClick={onToggle} aria-expanded={open}><span className="flex min-w-0 items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#dff0fa] text-[#00517e] dark:bg-[#0b4564] dark:text-[#65c6f7]"><Icon className="size-5" /></span><span className="min-w-0"><span className="flex items-center gap-2"><span className="truncate text-xl font-black text-[#002a44] dark:text-[#eef8ff]">{title}</span><ChevronDown className={`size-5 text-[#315979] transition-transform dark:text-[#a9c9df] ${open ? 'rotate-180' : ''}`} /></span><span className="block text-sm text-[#315979] dark:text-[#a9c9df]">{description}</span></span></span></Button>{open && <div className="border-t border-[#b6d8ed] p-4 dark:border-[#12648b] sm:p-5">{children}</div>}</section>
}

function MatchHistoryRow({ match, onDelete }: { match: MatchHistory; onDelete: () => void }) {
  const [open, setOpen] = useState(false)
  const overall = progressFor(match.subsystems)
  return <Card className="border-[#b6d8ed] bg-white dark:border-[#29415f] dark:bg-[#102f47]"><CardContent className="p-4"><div className="flex items-start justify-between gap-3"><Button variant="ghost" className="h-auto min-w-0 flex-1 justify-start p-0 text-left hover:bg-transparent" onClick={() => setOpen((value) => !value)}><div><p className="font-bold text-[#002a44] dark:text-white">{match.competition} · Qualification {match.qualificationNumber}</p><p className="mt-1 text-xs text-[#315979] dark:text-[#b8d2df]">Completed by {match.completedBy}</p></div><ChevronDown className={`ml-auto size-5 text-[#315979] transition-transform dark:text-[#a9c9df] ${open ? 'rotate-180' : ''}`} /></Button><Button variant="ghost" size="icon" aria-label="Delete match history" className="text-[#c73d3d]" onClick={onDelete}><Trash2 className="size-4" /></Button></div><div className="mt-3 flex items-center gap-3"><Progress value={overall} className="gap-0 flex-1 [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:bg-[#d8ecf8] [&_[data-slot=progress-indicator]]:bg-[#3a9525]" /><span className="text-xs font-black text-[#3a9525]">{overall}%</span></div>{open && <div className="mt-4 space-y-2 border-t border-[#b6d8ed] pt-4 dark:border-[#29415f]">{match.subsystems.map((subsystem) => <details key={subsystem.id} className="rounded-lg bg-[#eaf4fb] p-3 dark:bg-[#0d2a40]"><summary className="cursor-pointer list-none text-sm font-bold text-[#002a44] dark:text-white">{subsystem.name} · {progressForSubsystem(subsystem)}%</summary><div className="mt-3 space-y-2">{subsystem.items.map((item) => <div key={item.id} className="flex justify-between gap-3 border-t border-[#b6d8ed] pt-2 text-xs dark:border-[#29415f]"><span className="text-[#315979] dark:text-[#b8d2df]">{item.name}</span><span className="font-bold text-[#002a44] dark:text-white">{item.status ?? 'Not answered'}</span></div>)}</div></details>)}</div>}</CardContent></Card>
}
