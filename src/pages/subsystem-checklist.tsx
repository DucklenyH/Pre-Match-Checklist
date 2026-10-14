import { ArrowLeft, CheckCheck, ClipboardCheck } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { progressForSubsystem, useChecklist, type ChecklistStatus, type ChecklistItem } from '@/lib/checklist-context'

export function SubsystemChecklist() {
  const { subsystemId } = useParams()
  const { markSubsystemOk, subsystems } = useChecklist()
  const subsystem = subsystems.find((entry) => entry.id === subsystemId)

  if (!subsystem) {
    return <main className="mx-auto max-w-3xl py-8"><Card className="p-6 text-center"><p className="font-bold text-[#002a44] dark:text-white">Subsystem not found.</p><Link to="/checklist" className="mt-4 inline-flex text-sm font-bold text-[#00517e] underline">Back to checklist</Link></Card></main>
  }

  const percent = progressForSubsystem(subsystem)
  const totalItems = subsystem.items.length || 1
  const okPercent = (subsystem.items.filter((item) => item.status === 'OK').length / totalItems) * 100
  const issuePercent = (subsystem.items.filter((item) => item.status === 'Issue').length / totalItems) * 100

  return (
    <main className="mx-auto max-w-3xl py-8">
      <Link to="/checklist" className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[#00517e] hover:underline dark:text-[#8bd4f5]"><ArrowLeft className="size-4" />Back to checklist</Link>
      <Card className="mb-6 overflow-hidden border-2 border-[#b6d8ed] bg-white shadow-[0_10px_24px_rgb(0_55_92/0.08)] dark:border-[#1c5375] dark:bg-[#0d2a40]">
        <div className="bg-white p-5 dark:bg-[#0d2a40] sm:p-6">
          <div className="flex items-center gap-4">{subsystem.imageUrl ? <img src={subsystem.imageUrl} alt="" className="size-20 shrink-0 rounded-2xl object-cover shadow-sm" /> : <span className="grid size-20 shrink-0 place-items-center rounded-2xl bg-[#dff0fa] text-[#00517e] dark:bg-[#0b4564] dark:text-[#65c6f7]"><ClipboardCheck className="size-9" /></span>}<div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0086cb]">Subsystem checklist</p><h1 className="mt-1 truncate text-3xl font-black tracking-tight text-[#002a44] dark:text-[#eef8ff] sm:text-4xl">{subsystem.name}</h1><p className="mt-1 text-sm text-[#315979] dark:text-[#b8d2df]">Complete each item before the robot leaves the pit.</p></div></div>
          <div className="mt-5 border-t border-[#b6d8ed] pt-4 dark:border-[#1c5375]"><div className="flex justify-between text-sm font-bold text-[#002a44] dark:text-white"><span>Subsystem readiness</span><span>{percent}%</span></div><div className="mt-2 flex h-3 overflow-hidden rounded-full bg-[#d8ecf8]" aria-label={`${percent}% complete`}><span className="bg-[#3a9525]" style={{ width: `${okPercent}%` }} /><span className="bg-[#c73d3d]" style={{ width: `${issuePercent}%` }} /></div><Button className="mt-4 h-11 w-full bg-[#3a9525] text-white hover:bg-[#2c791c]" onClick={() => markSubsystemOk(subsystem.id)}><CheckCheck className="size-4" />Mark all as OK</Button></div>
        </div>
      </Card>

      <div className="space-y-4">{subsystem.items.map((item) => <ChecklistItemRow key={item.id} subsystemId={subsystem.id} item={item} />)}</div>
    </main>
  )
}

function ChecklistItemRow({ subsystemId, item }: { subsystemId: string; item: ChecklistItem }) {
  const { setItemStatus, setItemNotes } = useChecklist()
  const statuses: ChecklistStatus[] = ['OK', 'Issue']

  return (
    <Card className="border border-[#b6d8ed] bg-white p-4 dark:border-[#29415f] dark:bg-[#102f47] sm:p-5">
      <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-bold text-[#002a44] dark:text-white">{item.name}</p></div>{item.status === 'OK' ? <span className="mt-1 size-3 shrink-0 rounded-full bg-[#3a9525]" aria-label="Complete" /> : null}</div>
      {item.imageUrl ? <img src={item.imageUrl} alt={`Illustration for ${item.name}`} className="mt-4 max-h-64 w-full rounded-xl object-cover" /> : null}
      <div className="mt-4 grid grid-cols-3 gap-2">{statuses.map((status) => <Button key={status} variant="outline" className={`h-11 ${item.status === status ? (status === 'Issue' ? 'border-[#c73d3d] bg-[#c73d3d] text-white hover:bg-[#a72e2e]' : 'border-[#3a9525] bg-[#3a9525] text-white hover:bg-[#2c791c]') : status === 'Issue' ? 'border-[#e8a6a6] bg-[#fff0f0] text-[#c73d3d] hover:bg-[#ffe0e0]' : 'border-[#9dcc92] bg-[#eef8eb] text-[#3a9525] hover:bg-[#dff1d9]'}`} onClick={() => setItemStatus(subsystemId, item.id, item.status === status ? null : status)}>{status}</Button>)}<Textarea aria-label="Add extra notes" value={item.notes} onChange={(event) => setItemNotes(subsystemId, item.id, event.target.value)} placeholder="Add extra notes" className="h-11 min-h-11 resize-none border-[#a9c7da] bg-[#eef5f9] px-3 py-2 text-sm text-[#315979] dark:bg-[#102f47] dark:text-white" />
      </div>
    </Card>
  )
}
