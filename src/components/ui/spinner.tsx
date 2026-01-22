import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const spinnerVariants = cva(
  "animate-spin rounded-full border-current border-t-transparent",
  {
    variants: {
      size: {
        sm: "h-4 w-4 border-2",
        md: "h-6 w-6 border-2",
        lg: "h-8 w-8 border-3",
        xl: "h-12 w-12 border-4",
      },
      color: {
        default: "text-brand-primary",
        white: "text-white",
        primary: "text-brand-primary",
        secondary: "text-gray-400",
      },
    },
    defaultVariants: {
      size: "md",
      color: "primary",
    },
  }
);

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof spinnerVariants> {
  overlay?: boolean;
  centered?: boolean;
  overlayClassName?: string;
}

export function Spinner({
  className,
  size,
  color,
  overlay,
  centered,
  overlayClassName,
  ...props
}: SpinnerProps) {
  const spinnerElement = (
    <div
      className={cn(
        spinnerVariants({ size, color }),
        centered && "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        className
      )}
      {...props}
    />
  );

  if (overlay) {
    return (
      <div className={cn("absolute inset-0 z-50 flex items-center justify-center", overlayClassName)}>
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
}