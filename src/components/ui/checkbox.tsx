"use client"
import { useEffect } from "react"
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  indeterminate?: boolean
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, indeterminate, checked, ...props }, ref) => {
  const innerRef = React.useRef<HTMLButtonElement>(null)
  const combinedRef = ref || innerRef

  useEffect(() => {
    if (combinedRef && typeof combinedRef !== "function") {
      const element = combinedRef.current
      if (element) {
        const input = element.querySelector('input[type="checkbox"]')
        if (input instanceof HTMLInputElement) {
          input.indeterminate = indeterminate === true
        }
      }
    }
  }, [indeterminate, combinedRef])

  return (
    <CheckboxPrimitive.Root
      ref={combinedRef}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "aria-[invalid=true]:border-red aria-[invalid=true]:focus-visible:ring-red",
        className
      )}
      checked={indeterminate ? false : checked}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        {indeterminate ? (
          <Minus className="h-4 w-4" />
        ) : (
          <Check className="h-4 w-4" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
