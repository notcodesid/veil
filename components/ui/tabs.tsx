"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-full items-center justify-center border-2 border-black bg-white p-1 text-black rounded-2xl shadow-[2px_2px_0px_0px_#000] group-data-horizontal/tabs:h-12",
  {
    variants: {
      variant: {
        default: "",
        line: "gap-1 bg-transparent border-none shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-transparent px-3 py-1.5 text-sm font-luckiest-guy uppercase tracking-wider text-zinc-500 transition-all duration-150 select-none outline-none disabled:pointer-events-none disabled:opacity-50",
        "data-active:bg-emerald-400 data-active:text-black data-active:border-black data-active:shadow-[2px_2px_0px_0px_#000] data-active:-translate-y-0.5",
        "hover:text-black hover:bg-zinc-100 data-active:hover:bg-emerald-400",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
