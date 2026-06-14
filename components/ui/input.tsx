import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-xl border-2 border-black bg-white px-3 py-2 text-black transition-colors outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-black disabled:pointer-events-none disabled:opacity-50 md:text-sm font-semibold",
        className
      )}
      {...props}
    />
  )
}

export { Input }
