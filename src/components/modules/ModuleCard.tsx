import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ModuleCardProps {
  title: string
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

export function ModuleCard({ title, children, className, contentClassName }: ModuleCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="py-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className={cn("p-2", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  )
} 