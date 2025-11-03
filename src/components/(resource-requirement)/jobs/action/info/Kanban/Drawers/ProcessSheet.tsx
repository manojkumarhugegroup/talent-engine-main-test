"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { KanbanFeature } from "@/types/jobs/Info/kanban.type"

export type ProcessSheetPayload = {
  actionId: string
  actionLabel: string
  feature: KanbanFeature | null
}

export function ProcessSheet({
  open,
  onOpenChange,
  payload,
}: {
  open: boolean
  onOpenChange: (next: boolean) => void
  payload?: ProcessSheetPayload | null
}) {
  const feature = payload?.feature ?? null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[420px] sm:w-[460px]">
        <SheetHeader>
          <SheetTitle className="text-pretty">Process Action</SheetTitle>
          <SheetDescription className="text-sm">
            {payload ? `You selected: ${payload.actionLabel}` : "Select an action to continue."}
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        {feature && (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div className="font-semibold text-sm">{feature.candidate.name || "No candidate name"}</div>
              <Badge variant="outline" className="text-xs">
                {feature.status}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">{feature.job_title || "No job title"}</div>
            {feature.summary ? <p className="text-sm leading-relaxed">{feature.summary}</p> : null}

            <div className="text-xs text-muted-foreground">
              Stage: {feature.stage} • Action: {payload?.actionId}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
