import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-7 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-xl border-2 border-black px-3 py-1 text-xs font-luckiest-guy uppercase tracking-wider text-black transition-all select-none shadow-[1.5px_1.5px_0px_0px_#000] [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-emerald-400",
        secondary: "bg-yellow-300",
        destructive: "bg-red-400",
        outline: "bg-white",
        ghost: "border-transparent bg-transparent shadow-none font-sans lowercase normal-case tracking-normal",
        link: "border-transparent bg-transparent underline shadow-none font-sans lowercase normal-case tracking-normal",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
