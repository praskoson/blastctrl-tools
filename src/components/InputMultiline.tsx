import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import React from "react";
import { FieldError } from "react-hook-form";

const classNames = (...classes: any[]) => classes.filter(Boolean).join(" ");

export interface InputMultilineProps extends React.ComponentPropsWithoutRef<"textarea"> {
  label: string;
  description?: string;
  error?: FieldError;
  className?: string;
}

export const InputMultiline = React.forwardRef<HTMLTextAreaElement, InputMultilineProps>(
  function InputMultiline(props, ref) {
    const { label, description, error, className, ...rest } = props;

    return (
      <div className={className}>
        <label htmlFor={rest.name} className="block space-x-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {description && <span className="text-xs font-normal text-gray-500">{description}</span>}
        </label>
        <div className="relative mt-1">
          <textarea
            ref={ref}
            {...rest}
            id={rest.name}
            className={classNames(
              "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
              !!error &&
                "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500"
            )}
            aria-invalid={error ? "true" : "false"}
          />
          {error && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600" id={error?.type}>
            {error?.message}
          </p>
        )}
      </div>
    );
  }
);
