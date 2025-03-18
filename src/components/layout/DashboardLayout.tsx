'use client'

import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div className="grid grid-cols-2 gap-4 p-4 h-screen">
        {children}
      </div>
    </div>
  )
} 