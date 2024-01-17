import { Popover as PopoverPrimitive } from "@headlessui/react";
import { cn } from "lib/utils";
import React, { type ComponentPropsWithoutRef, type ComponentRef } from "react";

export const Popover = PopoverPrimitive;
export const PopoverButton = PopoverPrimitive.Button;

const PopoverPanel = React.forwardRef<
  ComponentRef<typeof PopoverPrimitive.Panel>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Panel>
>((props, ref) => {
  const { className, children, ...rest } = props;

  return (
    <>
      <PopoverPrimitive.Overlay className="fixed inset-0 bg-black/60 isolate z-10 xs:hidden" />
      <PopoverPrimitive.Panel
        className={cn(
          "bg-white p-4 rounded shadow-md border border-black/5 overflow-hidden z-20",
          "sm:absolute sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2",
          "fixed left-8 top-20",
          className,
        )}
        ref={ref}
        {...rest}
      >
        {children}
      </PopoverPrimitive.Panel>
    </>
  );
});

PopoverPanel.displayName = "PopoverPanel";

export { PopoverPanel };
