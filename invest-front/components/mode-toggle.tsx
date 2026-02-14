"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Necessário para evitar erro de hidratação (diferença entre server/client)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-800 opacity-50" /> // Placeholder enquanto carrega
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2
        ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-200 border-slate-300'}
      `}
      aria-label="Alternar tema"
    >
      {/* Ícones de fundo (Ficam fixos e a bolinha passa por cima) */}
      <span className="absolute inset-0 flex justify-between items-center px-1.5 pointer-events-none">
        <Sun className={`h-3.5 w-3.5 ${isDark ? 'text-slate-50 opacity-50' : 'text-amber-500 opacity-50'} transition-all`} />
        <Moon className={`h-3.5 w-3.5 ${isDark ? 'text-blue-400 opacity-100' : 'text-slate-900 opacity-50'} transition-all`} />
      </span>

      {/* A "bolinha" que desliza */}
      <span
        className={`
          pointer-events-none block h-6 w-6 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out
          ${isDark ? 'translate-x-7' : 'translate-x-0'}
        `}
      >
      </span>
    </button>
  )
}