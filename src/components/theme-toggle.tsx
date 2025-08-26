'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window === 'undefined') return 'light'
        const stored = window.localStorage.getItem('narratorai_theme') as 'light' | 'dark' | null
        if (stored) return stored
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        return prefersDark ? 'dark' : 'light'
    })

    useEffect(() => {
        const root = document.documentElement
        if (theme === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
        try { window.localStorage.setItem('narratorai_theme', theme) } catch { }
    }, [theme])

    return (
        <Button size="sm" variant="outline" onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))} aria-pressed={theme === 'dark'} title="Toggle theme">
            {theme === 'dark' ? 'Light' : 'Dark'} mode
        </Button>
    )
}
