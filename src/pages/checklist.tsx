import { ChevronRight, ClipboardCheck } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { Card, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { progressFor, useChecklist, type MatchType } from '@/lib/checklist-context'
import { useUiStore } from '@/lib/ui-store'

export function Checklist() {
  const role = useUiStore((state) => state.role)
  const mentorCanEditMatch = useUiStore((state) => state.mentorCanEditMatch)
  const setMentorCanEditMatch = useUiStore((state) => state.setMentorCanEditMatch)
  const { competition, competitions, matchType, qualificationNumber, robotImageUrl, subsystems, setMatchSettings } = useChecklist()
  const [qualificationDraft, setQualificationDraft] = useState(String(qualificationNumber))
  const overall = progressFor(subsystems)
  const totalItems = subsystems.reduce((count, subsystem) => count + subsystem.items.length, 0) || 1
  const okOverallPercent = (subsystems.flatMap((subsystem) => subsystem.items).filter((item) => item.status === 'OK').length / totalItems) * 100
  const issueOverallPercent = (subsystems.flatMap((subsystem) => subsystem.items).filter((item) => item.status === 'Issue').length / totalItems) * 100

  return (
    <main className="mx-auto max-w-3xl py-5 sm:py-8">
      <div className="mb-5 space-y-2 sm:mb-7">
        <h1 className="text-3xl font-black tracking-tight text-[#002a44] dark:text-[#eef8ff] sm:text-4xl">Pre Match Checklist</h1>
        <p className="text-[#315979] dark:text-[#a9c9df]">Work through every subsystem before the robot leaves the pit. Changes save automatically.</p>
      </div>

      <Card className="mb-5 border-2 border-[#b6d8ed] bg-white shadow-[0_10px_24px_rgb(0_55_92/0.08)] dark:border-[#1c5375] dark:bg-[#0d2a40]">
        <CardHeader className="gap-4 p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_9rem] sm:items-center sm:gap-5">
            <div className="space-y-4">
              {role === 'Mentor' ? (
                <>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-[#b6d8ed] bg-[#eaf4fb] px-3 py-2.5 dark:border-[#1c5375] dark:bg-[#102f47]">
                    <div className="min-w-0"><p className="text-sm font-bold text-[#002a44] dark:text-white">Edit match details</p><p className="text-xs text-[#315979] dark:text-[#b8d2df]">Allow event and match changes</p></div>
                    <button type="button" role="switch" aria-checked={mentorCanEditMatch} aria-label="Edit match details" onClick={() => setMentorCanEditMatch(!mentorCanEditMatch)} className={`relative inline-flex h-7 w-12 shrink-0 rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0086cb] ${mentorCanEditMatch ? 'border-[#00517e] bg-[#00517e]' : 'border-[#9ecde7] bg-white dark:bg-[#0d2a40]'}`}><span className={`pointer-events-none block size-5 rounded-full bg-white shadow-sm transition-transform ${mentorCanEditMatch ? 'translate-x-5' : 'translate-x-0'}`} /></button>
                  </div>
                  {mentorCanEditMatch ? (
                <div className="grid gap-3 sm:grid-cols-[1fr_8rem_8rem]">
                  <div className="grid gap-2">
                    <Label>Competition</Label>
                    <Select value={competition} onValueChange={(value) => value && setMatchSettings(value, qualificationNumber, matchType)}>
                      <SelectTrigger className="h-11 w-full border-[#0086cb] bg-white dark:bg-[#102f47]"><SelectValue /></SelectTrigger>
                      <SelectContent>{competitions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Match type</Label>
                    <Select value={matchType} onValueChange={(value) => value && setMatchSettings(competition, Number(qualificationDraft) || 1, value as MatchType)}>
                      <SelectTrigger className="h-11 border-[#0086cb] bg-white dark:bg-[#102f47]"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Qualification">Qualification</SelectItem><SelectItem value="Playoff">Playoff</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="match-number">{matchType} match</Label>
                    <Input id="match-number" type="number" min="1" value={qualificationDraft} onChange={(event) => setQualificationDraft(event.target.value)} onBlur={() => setMatchSettings(competition, Number(qualificationDraft) || 1, matchType)} className="h-11 border-[#0086cb] bg-white dark:bg-[#102f47] dark:text-white" />
                  </div>
                </div>
                  ) : <p className="text-xl font-black text-[#002a44] dark:text-white">{competition} · {matchType} {qualificationNumber}</p>}
                </>
              ) : (
                <p className="text-xl font-black text-[#002a44] dark:text-white">{competition} · {matchType} {qualificationNumber}</p>
              )}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-[#002a44] dark:text-white"><span>Overall robot readiness</span><span>{overall}%</span></div>
                <div className="flex h-3 overflow-hidden rounded-full bg-[#d8ecf8]" aria-label={`${overall}% complete`}><span className="bg-[#3a9525]" style={{ width: `${okOverallPercent}%` }} /><span className="bg-[#c73d3d]" style={{ width: `${issueOverallPercent}%` }} /></div>
              </div>
            </div>
            <img
              src={robotImageUrl}
              alt="Team 341 robot Miss Daisy"
              className="h-44 w-full rounded-2xl object-cover object-center shadow-sm sm:mx-auto sm:size-28"
            />
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-3">
        {subsystems.map((subsystem) => {
          const percent = subsystem.items.length ? Math.round((subsystem.items.filter((item) => item.status !== null).length / subsystem.items.length) * 100) : 0
          const totalItems = subsystem.items.length || 1
          const okPercent = (subsystem.items.filter((item) => item.status === 'OK').length / totalItems) * 100
          const issuePercent = (subsystem.items.filter((item) => item.status === 'Issue').length / totalItems) * 100
          const issueItems = subsystem.items.filter((item) => item.status === 'Issue')
          const noteItems = subsystem.items.filter((item) => item.notes.trim())
          return <Link key={subsystem.id} to={`/checklist/${subsystem.id}`} className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0086cb]">
            <Card className="border border-[#b6d8ed] bg-white/70 transition-colors hover:bg-[#f5fbff] dark:border-[#12648b] dark:bg-[#062b43]/40 dark:hover:bg-[#0b4564]">
              <div className="flex min-h-20 flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5">
                <span className="flex min-w-0 items-center gap-3">{subsystem.imageUrl ? <img src={subsystem.imageUrl} alt="" className="size-16 shrink-0 rounded-xl object-cover sm:size-12" /> : <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-[#dff0fa] text-[#00517e] dark:bg-[#0b4564] dark:text-[#65c6f7] sm:size-12"><ClipboardCheck className="size-7 sm:size-6" /></span>}<span className="min-w-0"><span className="block truncate text-lg font-black text-[#002a44] dark:text-[#eef8ff]">{subsystem.name}</span><span className="text-sm text-[#315979] dark:text-[#a9c9df]">{subsystem.items.length} checklist items</span></span></span>
                <span className="flex w-full items-center gap-3 sm:w-auto"><span className="relative flex h-3 min-w-0 flex-1 items-center sm:w-24 sm:flex-none"><span className="absolute -top-4 right-0 text-xs font-black text-[#315979] dark:text-[#b8d2df]">{percent}%</span><span className="flex h-3 w-full overflow-hidden rounded-full bg-[#d8ecf8]" aria-label={`${percent}% complete`}><span className="bg-[#3a9525]" style={{ width: `${okPercent}%` }} /><span className="bg-[#c73d3d]" style={{ width: `${issuePercent}%` }} /></span></span><ChevronRight className="size-5 shrink-0 text-[#315979] dark:text-[#a9c9df]" /></span>
              </div>
              {(issueItems.length > 0 || noteItems.length > 0) ? <div className="border-t border-[#b6d8ed] px-4 py-3 text-sm dark:border-[#12648b] sm:px-5"><div className="space-y-2">{issueItems.length > 0 ? <div><p className="font-black text-[#c73d3d]">Issues</p><ul className="mt-1 list-disc space-y-1 pl-5 text-[#7d3030] dark:text-[#f0a5a5]">{issueItems.map((item) => <li key={`issue-${item.id}`}>{item.name}</li>)}</ul></div> : null}{noteItems.length > 0 ? <div><p className="font-black text-[#315979] dark:text-[#b8d2df]">Notes</p><ul className="mt-1 space-y-1 text-[#315979] dark:text-[#b8d2df]">{noteItems.map((item) => <li key={`note-${item.id}`}><span className="font-bold">{item.name}:</span> {item.notes}</li>)}</ul></div> : null}</div></div> : null}
            </Card>
          </Link>
        })}
      </div>
    </main>
  )
}

