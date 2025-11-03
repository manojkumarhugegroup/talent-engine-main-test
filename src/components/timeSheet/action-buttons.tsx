// "use client"

// import React, { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Check, X } from "lucide-react"
// import approve from "../../../public/assets/icons/time sheet/approve.png"
// import decline from "../../../public/assets/icons/time sheet/decline.png"
// import Image from "next/image"
// import { ConfirmActionDialog } from "./ConfirmActionDialog"
// import { useEffect } from "react"

// type Status = "pending" | "approved" | "declined"

// interface ActionButtonsProps {
//   externalStatus?: Status  // <- This comes from parent when bulk action is taken
// }

// export function ActionButtons({ externalStatus }: ActionButtonsProps) {
//   const [status, setStatus] = useState<Status>("pending")
//   const [dialogOpen, setDialogOpen] = useState(false)
//   const [actionType, setActionType] = useState<"approve" | "reject">("approve")

//   // 👇 Update internal state when parent sends external status
//   useEffect(() => {
//     if (externalStatus && externalStatus !== status) {
//       setStatus(externalStatus)
//     }
//   }, [externalStatus])

//   const handleActionClick = (type: "approve" | "reject") => {
//     setActionType(type)
//     setDialogOpen(true)
//   }

//   const handleConfirm = (reason?: string) => {
//     if (actionType === "approve") {
//       setStatus("approved")
//     } else {
//       setStatus("declined")
//     }
//     setDialogOpen(false)
//   }

//   if (status === "approved") {
//     return (
//       <div className="flex items-center gap-2 text-green-600 font-semibold">
//         <Check className="h-4 w-4" />
//         Approved
//       </div>
//     )
//   }

//   if (status === "declined") {
//     return (
//       <div className="flex items-center gap-2 text-red-600 font-semibold">
//         <X className="h-4 w-4" />
//         Declined
//       </div>
//     )
//   }

//   return (
//     <div className="flex items-center justify-center gap-4">
//       <Button
//         variant="outline"
//         size="icon"
//         aria-label="Decline"
//         onClick={() => handleActionClick("reject")}
//       >
//         <Image src={decline} alt="decline" />
//       </Button>
//       <Button
//         variant="outline"
//         size="icon"
//         aria-label="Approve"
//         onClick={() => handleActionClick("approve")}
//       >
//         <Image src={approve} alt="approve" />
//       </Button>

//       <ConfirmActionDialog
//         open={dialogOpen}
//         onOpenChange={setDialogOpen}
//         type={actionType}
//         onConfirm={handleConfirm}
//       />
//     </div>
//   )
// }

"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import approve from "../../../public/assets/icons/time sheet/approve.png"
import decline from "../../../public/assets/icons/time sheet/decline.png"
import Image from "next/image"
import { ConfirmActionDialog } from "./ConfirmActionDialog"
import { useEffect } from "react"

type Status = "pending" | "approved" | "declined"

interface ActionButtonsProps {
  externalStatus?: Status  // <- This comes from parent when bulk action is taken
}

export function ActionButtons({ externalStatus }: ActionButtonsProps) {
  const [status, setStatus] = useState<Status>("pending")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject">("approve")


  console.log("External status received:", externalStatus);


  // 👇 Update internal state when parent sends external status
  useEffect(() => {
    if (externalStatus && externalStatus !== status) {
      setStatus(externalStatus)
    }
  }, [externalStatus])

  const handleActionClick = (type: "approve" | "reject") => {
    setActionType(type)
    setDialogOpen(true)
  }

  const handleConfirm = (reason?: string) => {
    if (actionType === "approve") {
      setStatus("approved")
    } else {
      setStatus("declined")
    }
    setDialogOpen(false)
  }

  if (status === "approved") {
    return (
      <div className="flex items-center gap-2 text-green-600 font-semibold">
        <Check className="h-4 w-4" />
        Approved
      </div>
    )
  }

  if (status === "declined") {
    return (
      <div className="flex items-center gap-2 text-red-600 font-semibold">
        <X className="h-4 w-4" />
        Declined
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="icon"
        aria-label="Decline"
        onClick={() => handleActionClick("reject")}
      >
        <Image src={decline} alt="decline" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="Approve"
        onClick={() => handleActionClick("approve")}
      >
        <Image src={approve} alt="approve" />
      </Button>

      <ConfirmActionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        type={actionType}
        onConfirm={handleConfirm}
      />
    </div>
  )
}

