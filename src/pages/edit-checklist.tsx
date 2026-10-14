import { ChevronDown, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useChecklist, type Subsystem } from '@/lib/checklist-context'

export function EditChecklist() {
  const { subsystems, addSubsystem } = useChecklist()
  const [openId, setOpenId] = useState<string | null>(subsystems[0]?.id ?? null)
  const [newName, setNewName] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')

  function createSubsystem() {
    if (!newName.trim()) return
    addSubsystem(newName.trim(), newImageUrl.trim())
    setNewName('')
    setNewImageUrl('')
  }

  return (
    <main className="mx-auto max-w-4xl space-y-7 py-8">
      <div className="space-y-2"><h1 className="text-3xl font-black tracking-tight text-[#002a44] dark:text-[#eef8ff] sm:text-4xl">Edit Subsystem Checklist</h1><p className="text-[#315979] dark:text-[#a9c9df]">Checklist templates can change from year to year. Updates apply immediately to the current mock checklist.</p></div>
      <Card className="border border-[#b6d8ed] bg-white p-4 shadow-[0_10px_24px_rgb(0_55_92/0.08)] dark:border-[#12648b] dark:bg-[#062b43]/40 sm:p-5"><div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"><div><Label htmlFor="new-subsystem">Add subsystem</Label><Input id="new-subsystem" placeholder="e.g. Climber" value={newName} onChange={(event) => setNewName(event.target.value)} className="mt-2 h-11 border-[#0086cb] bg-white dark:bg-[#102f47] dark:text-white" /></div><div><Label htmlFor="new-subsystem-image">Picture URL (optional)</Label><Input id="new-subsystem-image" type="url" placeholder="https://..." value={newImageUrl} onChange={(event) => setNewImageUrl(event.target.value)} className="mt-2 h-11 border-[#0086cb] bg-white dark:bg-[#102f47] dark:text-white" /></div><Button className="h-11 bg-[#00517e] text-white hover:bg-[#003f61]" onClick={createSubsystem}><Plus />Add subsystem</Button></div></Card>
      <div className="space-y-3">{subsystems.map((subsystem) => <SubsystemEditor key={subsystem.id} subsystem={subsystem} open={openId === subsystem.id} onToggle={() => setOpenId(openId === subsystem.id ? null : subsystem.id)} />)}</div>
    </main>
  )
}

function SubsystemEditor({ subsystem, open, onToggle }: { subsystem: Subsystem; open: boolean; onToggle: () => void }) {
  const { renameSubsystem, setSubsystemImage, removeSubsystem, addItem, updateItem, removeItem } = useChecklist()
  const [name, setName] = useState(subsystem.name)
  const [imageUrl, setImageUrl] = useState(subsystem.imageUrl ?? '')
  const [newItemName, setNewItemName] = useState('')
  const [newItemImageUrl, setNewItemImageUrl] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  function saveName() {
    if (name.trim()) renameSubsystem(subsystem.id, name.trim())
    setSubsystemImage(subsystem.id, imageUrl.trim())
  }

  function createItem() {
    if (!newItemName.trim()) return
    addItem(subsystem.id, newItemName.trim(), '', newItemImageUrl.trim())
    setNewItemName('')
    setNewItemImageUrl('')
  }

  return (
      <Card className="overflow-hidden border border-[#b6d8ed] bg-white/70 dark:border-[#12648b] dark:bg-[#062b43]/40"><div className="flex items-center gap-3 p-4 sm:p-5"><Button variant="ghost" className="flex h-auto min-w-0 flex-1 justify-start gap-3 p-0 text-left hover:bg-transparent" onClick={onToggle}><span className="min-w-0"><span className="flex items-center gap-2"><span className="truncate text-xl font-black text-[#002a44] dark:text-[#eef8ff]">{subsystem.name}</span><ChevronDown className={`size-5 text-[#315979] transition-transform dark:text-[#a9c9df] ${open ? 'rotate-180' : ''}`} /></span><span className="text-sm text-[#315979] dark:text-[#a9c9df]">{subsystem.items.length} checklist items</span></span></Button><Button variant="ghost" size="icon" aria-label={`Remove ${subsystem.name}`} className="text-[#c73d3d]" onClick={() => removeSubsystem(subsystem.id)}><Trash2 className="size-4" /></Button></div>{open && <div className="border-t border-[#b6d8ed] p-4 dark:border-[#12648b] sm:p-5"><div className="grid gap-4"><div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"><div><Label htmlFor={`subsystem-${subsystem.id}`}>Subsystem name</Label><Input id={`subsystem-${subsystem.id}`} value={name} onChange={(event) => setName(event.target.value)} className="mt-2 h-11 border-[#0086cb] bg-white dark:bg-[#102f47] dark:text-white" /></div><div><Label htmlFor={`subsystem-image-${subsystem.id}`}>Picture URL (optional)</Label><Input id={`subsystem-image-${subsystem.id}`} type="url" placeholder="https://..." value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className="mt-2 h-11 border-[#0086cb] bg-white dark:bg-[#102f47] dark:text-white" /></div><Button variant="outline" className="h-11" onClick={saveName}><Pencil className="size-4" />Save</Button></div><div className="space-y-3">{subsystem.items.map((item) => <div key={item.id} className="rounded-xl border border-[#b6d8ed] bg-[#eaf4fb] p-4 dark:border-[#29415f] dark:bg-[#102f47]">{editingId === item.id ? <EditItemForm item={item} onSave={(nextName, nextDetail, nextImageUrl) => { updateItem(subsystem.id, item.id, nextName, nextDetail, nextImageUrl); setEditingId(null) }} onCancel={() => setEditingId(null)} /> : <div className="flex items-start justify-between gap-3"><div><p className="font-bold text-[#002a44] dark:text-white">{item.name}</p>{item.imageUrl ? <p className="mt-1 text-xs font-semibold text-[#0086cb]">Picture included</p> : null}</div><div className="flex shrink-0 gap-1"><Button variant="ghost" size="icon" aria-label={`Edit ${item.name}`} onClick={() => setEditingId(item.id)}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" aria-label={`Delete ${item.name}`} className="text-[#c73d3d]" onClick={() => removeItem(subsystem.id, item.id)}><Trash2 className="size-4" /></Button></div></div>}</div>)}</div><div className="rounded-xl border border-dashed border-[#9ecde7] p-4"><p className="mb-3 font-bold text-[#002a44] dark:text-white">Add checklist item</p><div className="grid gap-3"><Input placeholder="Item name" value={newItemName} onChange={(event) => setNewItemName(event.target.value)} className="h-11 border-[#9ecde7] bg-white dark:bg-[#0d2a40] dark:text-white" /><Input type="url" placeholder="Optional picture URL" value={newItemImageUrl} onChange={(event) => setNewItemImageUrl(event.target.value)} className="h-11 border-[#9ecde7] bg-white dark:bg-[#0d2a40] dark:text-white" /><Button className="h-11 w-full bg-[#00517e] text-white hover:bg-[#003f61]" onClick={createItem}><Plus />Add item</Button></div></div></div></div>}</Card>
  )
}

function EditItemForm({ item, onSave, onCancel }: { item: Subsystem['items'][number]; onSave: (name: string, detail: string, imageUrl: string) => void; onCancel: () => void }) {
  const [name, setName] = useState(item.name)

  const [imageUrl, setImageUrl] = useState(item.imageUrl ?? '')
  return <div className="grid gap-3"><Input value={name} onChange={(event) => setName(event.target.value)} className="h-11 border-[#0086cb] bg-white dark:bg-[#0d2a40] dark:text-white" /><Input type="url" placeholder="Optional picture URL" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className="h-11 border-[#9ecde7] bg-white dark:bg-[#0d2a40] dark:text-white" /><div className="flex gap-2"><Button className="bg-[#00517e] text-white hover:bg-[#003f61]" onClick={() => onSave(name.trim(), item.detail, imageUrl.trim())}>Save changes</Button><Button variant="outline" onClick={onCancel}>Cancel</Button></div></div>
}
