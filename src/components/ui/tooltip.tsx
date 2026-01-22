"use client";
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";
import { Question } from "@/data/constants/icons.constants";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 10, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-visible rounded-lg bg-blue-100 px-4 py-3 text-sm text-brand-primary border border-slate-200 shadow-md",
        "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

interface InfoTooltipProps {
  content: string;
  position?: "top" | "right" | "bottom" | "left";
  trigger?: React.ReactNode;
  iconSize?: number;
  iconClassName?: string;
  contentClassName?: string;
  delayDuration?: number;
}

export function InfoTooltip({
  content,
  position = "right",
  trigger,
  contentClassName = "text-xs font-normal text-brand-primary",
  delayDuration = 100,
}: InfoTooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          {trigger || <Question className="text-brand-primary" size={16} />}
        </TooltipTrigger>
        <TooltipContent
          side={position}
          className={cn(
            contentClassName,
            "relative",
            "before:absolute before:w-2 before:h-2 before:bg-slate-100 before:border-r before:border-b before:border-slate-200 before:rotate-45",
            position === "top" &&
              "before:bottom-[-5px] before:left-1/2 before:-translate-x-1/2",
            position === "bottom" &&
              "before:top-[-5px] before:left-1/2 before:-translate-x-1/2 before:rotate-[225deg]",
            position === "left" &&
              "before:right-[-5px] before:top-1/2 before:-translate-y-1/2 before:rotate-[-45deg]",
            position === "right" &&
              "before:left-[-5px] before:top-1/2 before:-translate-y-1/2 before:rotate-[135deg]"
          )}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
