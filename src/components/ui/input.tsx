import { Input as BaseInput } from "@base-ui-components/react/input";
import * as React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<typeof BaseInput> {
  children?: React.ReactNode;
  inputWrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ children, className, inputWrapperClassName, ...props }, ref) => {
    const hasLeadingIcon = React.Children.toArray(children).some(
      (child) =>
        React.isValidElement(child) &&
        isInputIconProps(child.props) &&
        child.type === InputIcon &&
        child.props.side === "leading"
    );
    const hasTrailingIcon = React.Children.toArray(children).some(
      (child) =>
        React.isValidElement(child) &&
        isInputIconProps(child.props) &&
        child.type === InputIcon &&
        child.props.side === "trailing"
    );

    return (
      <div className={cn("relative", inputWrapperClassName)}>
        {children}
        <BaseInput
          ref={ref}
          className={cn(
            "h-10 w-full max-w-64 rounded-md border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline focus:-outline-offset-1 focus:outline-blue-800",
            hasLeadingIcon && "pl-10",
            hasTrailingIcon && "pr-10",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

interface InputIconProps extends React.ComponentPropsWithoutRef<"div"> {
  side: "leading" | "trailing";
  children?: React.ReactNode;
}

function isInputIconProps(props: unknown): props is InputIconProps {
  return (
    props !== undefined &&
    props !== null &&
    typeof props === "object" &&
    "side" in props
  );
}

const InputIcon = React.forwardRef<HTMLDivElement, InputIconProps>(
  ({ children, className, side, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4",
        side === "leading" && "left-3",
        side === "trailing" && "right-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
InputIcon.displayName = "InputIcon";

export { Input, InputIcon };
