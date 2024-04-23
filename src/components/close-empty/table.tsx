"use client";

import { clsx } from "clsx";
import type React from "react";
import { createContext, useContext } from "react";

const TableContext = createContext<{
  bleed: boolean;
  dense: boolean;
  grid: boolean;
  striped: boolean;
}>({
  bleed: false,
  dense: false,
  grid: false,
  striped: false,
});

export function Table({
  bleed = false,
  dense = false,
  grid = false,
  striped = false,
  className,
  children,
  ...props
}: {
  bleed?: boolean;
  dense?: boolean;
  grid?: boolean;
  striped?: boolean;
} & React.ComponentPropsWithoutRef<"div">) {
  return (
    <TableContext.Provider
      value={{ bleed, dense, grid, striped } as React.ContextType<typeof TableContext>}
    >
      <div className="flow-root">
        <div
          {...props}
          className={clsx(className, "-mx-[--gutter] overflow-x-auto whitespace-nowrap")}
        >
          <div
            className={clsx("inline-block min-w-full align-middle", !bleed && "sm:px-[--gutter]")}
          >
            <table className="min-w-full text-left text-sm/6">{children}</table>
          </div>
        </div>
      </div>
    </TableContext.Provider>
  );
}

export function TableHead({ className, ...props }: React.ComponentPropsWithoutRef<"thead">) {
  return <thead className={clsx(className, "text-zinc-500")} {...props} />;
}

export function TableBody(props: React.ComponentPropsWithoutRef<"tbody">) {
  return <tbody {...props} />;
}

export function TableRow({
  title,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"tr">) {
  let { striped } = useContext(TableContext);

  return (
    <tr {...props} className={clsx(className, striped && "even:bg-zinc-950/[2.5%]")}>
      {children}
    </tr>
  );
}

export function TableHeader({ className, ...props }: React.ComponentPropsWithoutRef<"th">) {
  let { bleed, grid } = useContext(TableContext);

  return (
    <th
      {...props}
      className={clsx(
        className,
        "border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))]",
        grid && "border-l border-l-zinc-950/5 first:border-l-0",
        !bleed && "sm:first:pl-2 sm:last:pr-2",
      )}
    />
  );
}

export function TableCell({ className, children, ...props }: React.ComponentPropsWithoutRef<"td">) {
  let { bleed, dense, grid, striped } = useContext(TableContext);

  return (
    <td
      {...props}
      className={clsx(
        className,
        "relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))]",
        !striped && "border-b border-zinc-950/5",
        grid && "border-l border-l-zinc-950/5 first:border-l-0",
        dense ? "py-2.5" : "py-4",
        !bleed && "sm:first:pl-2 sm:last:pr-2",
      )}
    >
      {children}
    </td>
  );
}
