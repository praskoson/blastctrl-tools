import { Popover as PopoverPrimitive } from "@headlessui/react";
import { cn } from "lib/utils";
import React, { type ComponentRef, type ComponentPropsWithoutRef } from "react";

export const Popover = PopoverPrimitive;
export const PopoverButton = PopoverPrimitive.Button;

const PopoverPanel = React.forwardRef<
  ComponentRef<typeof PopoverPrimitive.Panel>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Panel>
>((props, ref) => {
  const { className, children, ...rest } = props;
  return (
    <PopoverPrimitive.Panel
      className={cn(
        "bg-white p-4 rounded shadow-md border border-black/5 overflow-hidden z-10",
        "sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2",
        "absolute -left-2 -top-60",
        className
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </PopoverPrimitive.Panel>
  );
});

PopoverPanel.displayName = "PopoverPanel";

export { PopoverPanel };
