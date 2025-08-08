import * as React from "react";

import { cn } from "@/lib/utils";

const variants = {
  default: "",
  ghost:
    "outline-none hover:outline hover:outline-gray-300 shadow-none hover:shadow-gray-300",
} as const;

function Button({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"button"> & { variant?: keyof typeof variants }) {
  return (
    <button
      className={cn(
        "p-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0  focus-visible:outline-gray-500 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive outline outline-gray-200 hover:outline-gray-300 shadow-sm shadow-gray-200 hover:shadow-gray-300 text-gray-500 hover:text-gray-600",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Button };
