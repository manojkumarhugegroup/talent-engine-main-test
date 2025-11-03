// "use client"

// import * as React from "react"
// import * as Dialog from "@radix-ui/react-dialog"
// import { cn } from "@/lib/utils"

// type PopupModelProps = {
//   open: boolean
//   onClose: () => void
//   onSubmit?: (attachSummary: boolean) => void
// }

// export default function PopupModel({ open, onClose, onSubmit }: PopupModelProps) {
//   const [attachSummary, setAttachSummary] = React.useState(true)

//   const handleSubmit = () => {
//     if (onSubmit) {
//       onSubmit(attachSummary)
//     }
//     // Don't call onClose here, let the parent handle it
//   }

//   const handleClose = (openState: boolean) => {
//     if (!openState) {
//       onClose()
//     }
//   }

//   return (
//     <Dialog.Root open={open} onOpenChange={handleClose}>
//       <Dialog.Portal>
//         <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
//         <Dialog.Content
//        className={cn(
//                   "fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2",
//                   "rounded-md bg-card p-6 shadow-xl focus:outline-none"
//                 )}
//           onEscapeKeyDown={onClose}
//           onPointerDownOutside={onClose}
//         >
//           <Dialog.Title className="text-lg font-medium mb-4">
//             Are you sure you want to submit profiles?
//           </Dialog.Title>

//           <div className="flex items-center mb-6">
//             <input
//               type="checkbox"
//               id="attach-summary"
//               checked={attachSummary}
//               onChange={(e) => setAttachSummary(e.target.checked)}
//               className="mr-2 h-4 w-4 text-[#003C47] bg-gray-100 border-gray-300 rounded"
//             />
//             <label htmlFor="attach-summary" className="text-sm text-gray-700">
//               Attach profile summary
//             </label>
//           </div>

//           <div className="flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
//             >
//               No
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               className="px-4 py-2 bg-[#003C47] text-white rounded hover:bg-[#002c35] transition-colors duration-200"
//             >
//               Yes
//             </button>
//           </div>
//         </Dialog.Content>
//       </Dialog.Portal>
//     </Dialog.Root>
//   )
// }

"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

type PopupModelProps = {
  open: boolean
  onClose: () => void
  onSubmit?: (attachSummary: boolean) => void
  count: number
}

export default function PopupModel({ open, onClose, onSubmit, count }: PopupModelProps) {
  const [attachSummary, setAttachSummary] = React.useState(true)

  const handleSubmit = () => {
    onSubmit?.(attachSummary)
  }

  const handleClose = (openState: boolean) => {
    if (!openState) {
      onClose()
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2",
            "rounded-md bg-card p-6 shadow-xl focus:outline-none"
          )}
          onEscapeKeyDown={onClose}
          onPointerDownOutside={onClose}
        >
          <Dialog.Title className="text-lg font-medium mb-4">
            Are you sure you want to submit the selected {count} item
            {count !== 1 ? "s" : ""} to the client?
          </Dialog.Title>

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="attach-summary"
              checked={attachSummary}
              onChange={(e) => setAttachSummary(e.target.checked)}
              className="mr-2 h-4 w-4 text-[#003C47] bg-gray-100 border-gray-300 rounded"
            />
            <label htmlFor="attach-summary" className="text-sm text-gray-700">
              Attach profile summary
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
            >
              No
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#003C47] text-white rounded hover:bg-[#002c35] transition-colors duration-200"
            >
              Yes
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
