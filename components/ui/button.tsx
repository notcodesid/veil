import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border-2 border-black bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-black active:translate-y-0.5 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 font-luckiest-guy uppercase tracking-wider text-black",
  {
    variants: {
      variant: {
        default: "bg-emerald-400 shadow-[2px_2px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-y-px active:shadow-[1px_1px_0px_0px_#000]",
        outline: "bg-white shadow-[2px_2px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-y-px active:shadow-[1px_1px_0px_0px_#000]",
        secondary: "bg-yellow-300 shadow-[2px_2px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-y-px active:shadow-[1px_1px_0px_0px_#000]",
        ghost: "border-transparent bg-transparent hover:bg-black/5 hover:text-black active:bg-black/10 shadow-none font-sans lowercase normal-case tracking-normal",
        destructive: "bg-red-400 shadow-[2px_2px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-y-px active:shadow-[1px_1px_0px_0px_#000]",
        link: "border-transparent bg-transparent underline-offset-4 hover:underline shadow-none font-sans lowercase normal-case tracking-normal",
      },
      size: {
        default: "h-10 gap-1.5 px-4",
        xs: "h-7 gap-1 rounded-lg px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8.5 gap-1 rounded-lg px-3 text-[0.8rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-1.5 px-6 text-base",
        icon: "size-10 rounded-xl",
        "icon-xs": "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8.5 rounded-lg",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
