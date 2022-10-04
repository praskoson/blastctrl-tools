import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useFieldArray, Control, UseFormRegister, FieldErrorsImpl } from "react-hook-form";
import { FormInputs } from "pages/update-nft";
import { isPublicKey } from "utils/spl/common";
import { classNames } from "utils";

export const MAX_CREATORS = 5;

export const CreatorsInput = ({
  control,
  register,
  errors,
}: {
  control: Control<FormInputs>;
  register: UseFormRegister<FormInputs>;
  errors: FieldErrorsImpl<FormInputs>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "creators",
    rules: {
      maxLength: MAX_CREATORS,
      minLength: 0,
    },
  });

  const isAddable = fields.length < MAX_CREATORS;

  const PlusButton = (
    <button
      onClick={() => append({ address: "", share: 0 })}
      type="button"
      className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      Add Creator
      <PlusCircleIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
    </button>
  );

  return (
    <div className="flex flex-col gap-y-2">
      {fields.map((field, idx) => (
        <fieldset key={field.id}>
          <legend className="sr-only">Creator address and share</legend>
          <div className="mt-1 -space-y-px rounded-md bg-white shadow-sm">
            <div className="grid grid-cols-9 -space-x-px">
              <div className="col-span-6 flex-1">
                <label className="sr-only">Creator</label>
                <input
                  type="text"
                  {...register(`creators.${idx}.address` as const, {
                    required: true,
                    validate: {
                      pubkey: isPublicKey,
                    },
                  })}
                  defaultValue=""
                  className={classNames(
                    "relative block w-full rounded-none rounded-bl-md rounded-tl-md border-gray-300 bg-transparent pr-6",
                    "focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                    errors?.creators?.[idx]?.address &&
                      "border-red-500 focus:border-red-600 focus:ring-red-500"
                  )}
                  placeholder="Creator address"
                />
              </div>
              <div className="col-span-2 flex-1">
                <label className="sr-only">Share</label>
                <input
                  type="number"
                  {...register(`creators.${idx}.share` as const, {
                    required: true,
                    min: 0,
                    max: 100,
                  })}
                  className={classNames(
                    "relative block w-full rounded-none border-gray-300 bg-transparent",
                    "focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                    errors?.creators?.[idx]?.share &&
                      "border-red-500 focus:border-red-600 focus:ring-red-500"
                  )}
                  placeholder="Share"
                />
              </div>
              <div className="col-span-1">
                <label className="sr-only">Remove creator</label>
                <button
                  className="inline-flex h-full w-full items-center justify-center rounded-none rounded-tr-md rounded-br-md border border-gray-300 bg-red-500"
                  type="button"
                  onClick={() => remove(idx)}
                >
                  <XMarkIcon className="h-5 w-5 font-semibold text-white" />
                </button>
              </div>
            </div>
          </div>
        </fieldset>
      ))}
      <div className="mt-2">{isAddable && PlusButton}</div>
    </div>
  );
};
