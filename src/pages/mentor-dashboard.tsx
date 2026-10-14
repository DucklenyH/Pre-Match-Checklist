import { ChevronDown, ImageIcon, Plus, Search, ShieldCheck, Trash2, Trophy, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ImagePicker } from '@/components/image-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { progressForSubsystem, useChecklist, type MatchHistory, type MemberRole } from '@/lib/checklist-context'

export function MentorDashboard() {
  const { competition, matchType, qualificationNumber, competitions, members, history, subsystems, robotImageUrl, setRobotImage, addCompetition, removeCompetition, updateMemberRole, removeMember, removeHistory } = useChecklist()
  const [rosterOpen, setRosterOpen] = useState(false)
  const [competitionsOpen, setCompetitionsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [robotOpen, setRobotOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [newCompetition, setNewCompetition] = useState('')
  const [robotImageDraft, setRobotImageDraft] = useState(robotImageUrl)
  const [historyEvent, setHistoryEvent] = useState('all')
  const [historyMatch, setHistoryMatch] = useState('all')
  const [historyYear, setHistoryYear] = useState('all')
  const visibleMembers = useMemo(() => members.filter((member) => member.name.toLowerCase().includes(search.toLowerCase())), [members, search])
  const historyEvents = useMemo(() => [...new Set(history.map((match) => match.competition))].sort(), [history])
  const historyMatches = useMemo(() => [...new Set(history.map((match) => match.qualificationNumber))].sort((a, b) => a - b), [history])
  const historyYears = useMemo(() => [...new Set(history.map((match) => new Date(match.recordedAt).getFullYear()))].sort((a, b) => b - a), [history])
  const visibleHistory = useMemo(() => history.filter((match) => (historyEvent === 'all' || match.competition === historyEvent) && (historyMatch === 'all' || String(match.qualificationNumber) === historyMatch) && (historyYear === 'all' || String(new Date(match.recordedAt).getFullYear()) === historyYear)), [history, historyEvent, historyMatch, historyYear])

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
      <DashboardSection icon={ImageIcon} title="Main Robot Picture" description="Choose the image shown on the pre-match checklist." open={robotOpen} onToggle={() => setRobotOpen((value) => !value)}><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><ImagePicker id="mentor-robot-image" label="Robot picture" value={robotImageDraft} onChange={setRobotImageDraft} /><Button className="h-11 bg-[#00517e] text-white hover:bg-[#003f61]" onClick={() => setRobotImage(robotImageDraft.trim())}>Save picture</Button></div></DashboardSection>
      <DashboardSection icon={ShieldCheck} title="Match History" description="Review the active checklist and saved match records." open={historyOpen} onToggle={() => setHistoryOpen((value) => !value)}><div className="space-y-3">{history.length > 0 ? <MatchHistoryFilters event={historyEvent} match={historyMatch} year={historyYear} events={historyEvents} matches={historyMatches} years={historyYears} onEventChange={setHistoryEvent} onMatchChange={setHistoryMatch} onYearChange={setHistoryYear} /> : null}<CurrentMatchRow competition={competition} matchType={matchType} qualificationNumber={qualificationNumber} subsystems={subsystems} />{history.length === 0 ? <div className="rounded-xl bg-[#eaf4fb] px-4 py-8 text-center text-sm text-[#315979] dark:bg-[#102f47] dark:text-[#b8d2df]">The active checklist will move into saved history when the next match starts.</div> : visibleHistory.length === 0 ? <div className="rounded-xl bg-[#eaf4fb] px-4 py-8 text-center text-sm text-[#315979] dark:bg-[#b8d2df]">No matches match those filters.</div> : visibleHistory.map((match) => <MatchHistoryRow key={match.id} match={match} onDelete={() => removeHistory(match.id)} />)}</div></DashboardSection>
    </main>
  )
}

function DashboardSection({ icon: Icon, title, description, open, onToggle, children }: { icon: typeof UsersRound; title: string; description: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return <section className="overflow-hidden rounded-2xl border border-[#b6d8ed] bg-white/50 dark:border-[#12648b] dark:bg-[#062b43]/40"><Button variant="ghost" className="flex h-auto w-full items-center justify-between rounded-none p-4 text-left hover:bg-[#dff0fa] dark:hover:bg-[#0b4564] sm:p-5" onClick={onToggle} aria-expanded={open}><span className="flex min-w-0 items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#dff0fa] text-[#00517e] dark:bg-[#0b4564] dark:text-[#65c6f7]"><Icon className="size-5" /></span><span className="min-w-0"><span className="flex items-center gap-2"><span className="truncate text-xl font-black text-[#002a44] dark:text-[#eef8ff]">{title}</span><ChevronDown className={`size-5 text-[#315979] transition-transform dark:text-[#a9c9df] ${open ? 'rotate-180' : ''}`} /></span><span className="block text-sm text-[#315979] dark:text-[#a9c9df]">{description}</span></span></span></Button>{open && <div className="border-t border-[#b6d8ed] p-4 dark:border-[#12648b] sm:p-5">{children}</div>}</section>
}

function CurrentMatchRow({ competition, matchType, qualificationNumber, subsystems }: { competition: string; matchType: string; qualificationNumber: number; subsystems: MatchHistory['subsystems'] }) {
  return <Card className="border-2 border-[#b6d8ed] bg-white dark:border-[#29415f] dark:bg-[#102f47]"><CardContent className="p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-bold text-[#002a44] dark:text-white">{competition} · {matchType} {qualificationNumber}</p><p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#0086cb]">In progress</p></div><span className="rounded-full bg-[#fff3c4] px-2 py-1 text-xs font-black text-[#765b00]">Current</span></div><StatusProgress subsystems={subsystems} /></CardContent></Card>
}

function MatchHistoryFilters({ event, match, year, events, matches, years, onEventChange, onMatchChange, onYearChange }: { event: string; match: string; year: string; events: string[]; matches: number[]; years: number[]; onEventChange: (value: string) => void; onMatchChange: (value: string) => void; onYearChange: (value: string) => void }) {
  return <div className="rounded-2xl border border-[#b6d8ed] bg-[#f7fbfe] p-4 dark:border-[#29415f] dark:bg-[#0d2a40]"><p className="mb-3 text-sm font-black uppercase tracking-wide text-[#315979] dark:text-[#b8d2df]">Filter matches</p><div className="grid gap-3 sm:grid-cols-3"><div className="grid gap-1.5"><Label className="text-xs font-bold text-[#315979] dark:text-[#b8d2df]">Event</Label><Select value={event} onValueChange={(value) => value && onEventChange(value)}><SelectTrigger className="h-10 w-full border-[#9ecde7] bg-white dark:bg-[#102f47]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All events</SelectItem>{events.map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}</SelectContent></Select></div><div className="grid gap-1.5"><Label className="text-xs font-bold text-[#315979] dark:text-[#b8d2df]">Match</Label><Select value={match} onValueChange={(value) => value && onMatchChange(value)}><SelectTrigger className="h-10 w-full border-[#9ecde7] bg-white dark:bg-[#102f47]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All matches</SelectItem>{matches.map((matchNumber) => <SelectItem key={matchNumber} value={String(matchNumber)}>Qualification / Playoff {matchNumber}</SelectItem>)}</SelectContent></Select></div><div className="grid gap-1.5"><Label className="text-xs font-bold text-[#315979] dark:text-[#b8d2df]">Year</Label><Select value={year} onValueChange={(value) => value && onYearChange(value)}><SelectTrigger className="h-10 w-full border-[#9ecde7] bg-white dark:bg-[#102f47]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All years</SelectItem>{years.map((entry) => <SelectItem key={entry} value={String(entry)}>{entry}</SelectItem>)}</SelectContent></Select></div></div></div>
}

function MatchHistoryRow({ match, onDelete }: { match: MatchHistory; onDelete: () => void }) {
  const [open, setOpen] = useState(false)
  return <Card className="border-[#b6d8ed] bg-white dark:border-[#29415f] dark:bg-[#102f47]"><CardContent className="p-4"><div className="flex items-start justify-between gap-3"><Button variant="ghost" className="h-auto min-w-0 flex-1 justify-start p-0 text-left hover:bg-transparent" onClick={() => setOpen((value) => !value)}><div><p className="font-bold text-[#002a44] dark:text-white">{match.competition} · {match.matchType} {match.qualificationNumber}</p><p className="mt-1 text-xs text-[#315979] dark:text-[#b8d2df]">Completed on {formatRecordedDate(match.recordedAt)}</p></div><ChevronDown className={`ml-auto size-5 text-[#315979] transition-transform dark:text-[#a9c9df] ${open ? 'rotate-180' : ''}`} /></Button><Button variant="ghost" size="icon" aria-label="Delete match history" className="text-[#c73d3d]" onClick={onDelete}><Trash2 className="size-4" /></Button></div><StatusProgress subsystems={match.subsystems} />{open && <div className="mt-4 space-y-3 border-t border-[#b6d8ed] pt-4 dark:border-[#29415f]">{match.subsystems.map((subsystem) => <HistorySubsystemSummary key={subsystem.id} subsystem={subsystem} completedBy={match.completedBy} completedAt={match.recordedAt} />)}</div>}</CardContent></Card>
}

function HistorySubsystemSummary({ subsystem, completedBy, completedAt }: { subsystem: MatchHistory['subsystems'][number]; completedBy: string; completedAt: string }) {
  const issueItems = subsystem.items.filter((item) => item.status === 'Issue')
  const noteItems = subsystem.items.filter((item) => item.notes.trim())
  return <div className="rounded-lg bg-[#eaf4fb] p-3 dark:bg-[#0d2a40]"><p className="text-sm font-bold text-[#002a44] dark:text-white">{subsystem.name} · {progressForSubsystem(subsystem)}%</p><p className="mt-1 text-xs text-[#315979] dark:text-[#b8d2df]">Completed by {completedBy} on {formatRecordedDate(completedAt)}</p>{issueItems.length > 0 || noteItems.length > 0 ? <div className="mt-3 space-y-3 border-t border-[#b6d8ed] pt-3 dark:border-[#29415f]">{issueItems.length > 0 ? <div><p className="font-black text-[#c73d3d]">Issues</p><ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[#7d3030] dark:text-[#f0a5a5]">{issueItems.map((item) => <li key={`history-issue-${item.id}`}>{item.name}</li>)}</ul></div> : null}{noteItems.length > 0 ? <div><p className="font-black text-[#315979] dark:text-[#b8d2df]">Notes</p><ul className="mt-1 space-y-1 text-sm text-[#315979] dark:text-[#b8d2df]">{noteItems.map((item) => <li key={`history-note-${item.id}`}><span className="font-bold">{item.name}:</span> {item.notes}</li>)}</ul></div> : null}</div> : <p className="mt-2 text-xs text-[#315979] dark:text-[#b8d2df]">No issues or notes recorded.</p>}</div>
}

function StatusProgress({ subsystems }: { subsystems: MatchHistory['subsystems'] }) {
  const items = subsystems.flatMap((subsystem) => subsystem.items)
  const total = items.length || 1
  const completed = items.filter((item) => item.status !== null).length
  const okPercent = (items.filter((item) => item.status === 'OK').length / total) * 100
  const issuePercent = (items.filter((item) => item.status === 'Issue').length / total) * 100
  return <div className="mt-3 flex items-center gap-3"><div className="flex h-3 flex-1 overflow-hidden rounded-full bg-[#d8ecf8]" aria-label={`${Math.round((completed / total) * 100)}% complete`}><span className="bg-[#3a9525]" style={{ width: `${okPercent}%` }} /><span className="bg-[#c73d3d]" style={{ width: `${issuePercent}%` }} /></div><span className="text-xs font-black text-[#315979] dark:text-[#b8d2df]">{Math.round((completed / total) * 100)}%</span></div>
}

function formatRecordedDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value))
}
