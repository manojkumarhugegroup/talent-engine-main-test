"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { CusTextarea } from "../forms/CusTextarea"
interface ConfirmActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason?: string) => void
  type: "approve" | "reject"
}

export function ConfirmActionDialog({
  open,
  onOpenChange,
  onConfirm,
  type,
}: ConfirmActionDialogProps) {

  const [reason, setReason] = React.useState("")
  const [touched, setTouched] = React.useState(false);


  const isReject = type === "reject"
  const title = isReject ? "Are you sure you want to reject?" : "Are you sure you want to approve?"
  const subtitle = isReject ? "(It will go back to the agency and return with changes)" : ""
  const confirmLabel = isReject ? "Yes" : "Yes"
  const cancelLabel = "No"

  const handleConfirm = () => {
    onConfirm(isReject ? reason : undefined)
    onOpenChange(false)
    setReason("")
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2",
            "rounded-md bg-card p-6 shadow-xl focus:outline-none"
          )}
        >
          <Dialog.Title className="text-base font-semibold text-gray-900">{title}</Dialog.Title>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}

          {isReject && (
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Reason<span className="text-red-500">*</span></label>
              {/* <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for rejection"
              /> */}
          <CusTextarea
  required
  value={reason}
  onChange={(e) => setReason(e.target.value)}
  onBlur={() => setTouched(true)}
  error={touched && reason.trim() === "" ? "Reason is required" : ""}
  className="min-h-20"
/>

            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {cancelLabel}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isReject && reason.trim() === ""}
            >
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
