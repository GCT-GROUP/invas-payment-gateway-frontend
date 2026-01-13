"use client"

import { AlertCircle, X } from "lucide-react"
import { useState } from "react"

interface DemoBannerProps {
  show: boolean
}

export default function DemoBanner({ show }: DemoBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (!show || dismissed) {
    return null
  }

  return (
    <div className="bg-accent/10 border-b border-accent/20 px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-accent flex-shrink-0" />
        <p className="text-sm text-foreground">
          This application is using demo data. Connect your API to see live pricing.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-muted-foreground hover:text-foreground transition"
        aria-label="Dismiss"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}
