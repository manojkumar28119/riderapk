import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'isLoading'> {
  isLoading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-grey-200 bg-transparent px-3 py-1 text-blue-700 font-medium text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-grey-50",
          "aria-[invalid=true]:border-red aria-[invalid=true]:focus-visible:ring-red",
          "autofill:[-webkit-text-fill-color:rgb(46,73,118)] autofill:[-webkit-box-shadow:0_0_0_9999px_white_inset]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
