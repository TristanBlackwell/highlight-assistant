import { Input as BaseInput } from "@base-ui-components/react/input";
import * as React from "react";

import { cn } from "@/lib/utils";
import ArrowTurnDownLeftIcon from "../icons/arrowTurnDownLeft";

interface InputProps extends React.ComponentProps<typeof BaseInput> {
  children?: React.ReactNode;
  inputWrapperClassName?: string;
}

const baseInputStyles =
  "h-10 w-full max-w-64 rounded-md border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline focus:-outline-offset-1 focus:outline-blue-800";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ children, className, inputWrapperClassName, ...props }, ref) => {
    return (
      <div className={cn("relative", inputWrapperClassName)}>
        {children}
        <BaseInput
          ref={ref}
          className={cn(baseInputStyles, className)}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

const InputWithSubmit = React.forwardRef<HTMLInputElement, InputProps>(
  ({ children, className, inputWrapperClassName, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600",
          inputWrapperClassName
        )}
      >
        {children}
        <BaseInput
          ref={ref}
          className={cn(
            baseInputStyles,
            "block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6",
            className
          )}
          {...props}
        />
        <button className="grid shrink-0 grid-cols-1 focus-within:relative">
          <ArrowTurnDownLeftIcon className="size-6" />
        </button>
      </div>
    );
  }
);
Input.displayName = "InputWithSubmit";

export { Input, InputWithSubmit };
