import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 rounded-t-lg font-body-lg text-body-lg p-3 transition-colors outline-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
