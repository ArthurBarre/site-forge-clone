"use client"

import * as React from "react"
import * as ToolbarPrimitive from "@radix-ui/react-toolbar"
import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const Toolbar = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex min-w-max shrink-0 items-center gap-1",
      className
    )}
    {...props}
  />
))
Toolbar.displayName = ToolbarPrimitive.Root.displayName

const ToolbarButton = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Button>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Button> &
    VariantProps<typeof toolbarButtonVariants>
>(({ className, variant, size, ...props }, ref) => (
  <ToolbarPrimitive.Button
    ref={ref}
    className={cn(toolbarButtonVariants({ variant, size, className }))}
    {...props}
  />
))
ToolbarButton.displayName = ToolbarPrimitive.Button.displayName

const ToolbarToggle = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.ToggleItem>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.ToggleItem> &
    VariantProps<typeof toolbarButtonVariants>
>(({ className, variant, size, ...props }, ref) => (
  <ToolbarPrimitive.ToggleItem
    ref={ref}
    className={cn(toolbarButtonVariants({ variant, size, className }))}
    {...props}
  />
))
ToolbarToggle.displayName = ToolbarPrimitive.ToggleItem.displayName

const ToolbarGroup = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.ToggleGroup>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.ToggleGroup>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.ToggleGroup
    ref={ref}
    className={cn("flex items-center", className)}
    {...props}
  />
))
ToolbarGroup.displayName = ToolbarPrimitive.ToggleGroup.displayName

const ToolbarSeparator = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Separator
    ref={ref}
    className={cn("my-1 w-px bg-border", className)}
    {...props}
  />
))
ToolbarSeparator.displayName = ToolbarPrimitive.Separator.displayName

const ToolbarLink = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Link>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Link> &
    VariantProps<typeof toolbarButtonVariants>
>(({ className, variant, size, ...props }, ref) => (
  <ToolbarPrimitive.Link
    ref={ref}
    className={cn(toolbarButtonVariants({ variant, size, className }))}
    {...props}
  />
))
ToolbarLink.displayName = ToolbarPrimitive.Link.displayName

const ToolbarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-1 items-center", className)} {...props} />
))
ToolbarContent.displayName = "ToolbarContent"

const ToolbarItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
ToolbarItem.displayName = "ToolbarItem"

const toolbarButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-background hover:bg-muted hover:text-accent-foreground",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-3",
        sm: "h-8 px-2 text-xs",
        lg: "h-10 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export {
  Toolbar,
  ToolbarButton,
  ToolbarToggle,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarLink,
  ToolbarContent,
  ToolbarItem,
}
