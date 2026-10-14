import { Laptop, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
  const Icon = resolvedTheme === 'dark' ? Moon : Sun

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={<Button variant="ghost" size="icon" aria-label={`Switch to ${nextTheme} theme`} />}
          onClick={() => setTheme(nextTheme)}
        >
          <Icon />
        </TooltipTrigger>
        <TooltipContent>
          <p className="flex items-center gap-2">
            <Laptop className="size-3.5" />
            Toggle theme
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
