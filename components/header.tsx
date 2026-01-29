"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="bg-primary text-primary-foreground py-4 sticky top-0 z-50 shadow-lg">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-around items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl hover:opacity-80 transition">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <img src="/icon-dark-32x32.png" alt="Image Logo" />
            </div>
            <span className="tracking-wide">inVAS</span>
            {/* <span className="text-xs self-end">Payment Gateway</span> */}
          </Link>

          {/* Dark Mode Toggle */}
          {/* <button onClick={toggleTheme} className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors" aria-label="Toggle dark mode">
            {mounted ? (
              theme === "dark" ? (
                <Sun className="w-5 h-5 text-primary-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-primary-foreground" />
              )
            ) : (
              <div className="w-5 h-5" /> // Placeholder while mounting
            )}
          </button> */}
        </div>
      </div>
    </header>
  )
}