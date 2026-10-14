import { Upload } from 'lucide-react'
import { useRef, type ChangeEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

function readImage(file: File, onChange: (value: string) => void) {
  if (!file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => onChange(String(reader.result))
  reader.readAsDataURL(file)
}

export function ImagePicker({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)

  function chooseFiles(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) readImage(file, onChange)
    event.target.value = ''
  }

  return <div className="grid gap-2"><Label htmlFor={id}>{label}</Label><div className="flex flex-wrap items-center gap-3"><Button type="button" variant="outline" className="h-10" onClick={() => inputRef.current?.click()}><Upload className="size-4" />Choose picture</Button>{value ? <img src={value} alt="Selected" className="size-12 rounded-lg object-cover" /> : null}<input ref={inputRef} id={id} type="file" accept="image/*" className="sr-only" onChange={chooseFiles} /></div></div>
}
