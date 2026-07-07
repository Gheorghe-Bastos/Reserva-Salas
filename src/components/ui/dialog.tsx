import * as React from "react"
import { cn } from "../../lib/utils"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

const DialogContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
} | null>(null)

function Dialog({ open = false, onOpenChange, children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange: onOpenChange ?? (() => {}) }}>
      {children}
    </DialogContext.Provider>
  )
}

function DialogTrigger({ children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(DialogContext)
  return (
    <button
      onClick={(e) => {
        ctx?.onOpenChange(true)
        onClick?.(e)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

function DialogContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = React.useContext(DialogContext)

  if (!ctx?.open) return null

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-black/40 modal-overlay"
        onClick={() => ctx?.onOpenChange(false)}
      />
      <div
        className={cn(
          "absolute bottom-0 left-0 w-full md:relative md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md bg-surface rounded-t-3xl md:rounded-xl shadow-xl p-card-padding animate-in slide-in-from-bottom",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex justify-between items-center mb-6", className)}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("font-headline-md text-headline-md text-primary", className)} {...props} />
  )
}

function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-3 pt-4", className)}
      {...props}
    />
  )
}

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter }
