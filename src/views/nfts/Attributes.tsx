import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { CreateFormInputs } from "pages/nft-tools/mint";
import { Control, useFieldArray, UseFormRegister } from "react-hook-form";
import { classNames } from "utils";
import { isPublicKey } from "utils/spl/common";

export type AttributesProps = {
  register: UseFormRegister<CreateFormInputs>;
  control: Control<CreateFormInputs, any>;
};

export const Attributes = ({ control, register }: AttributesProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
    rules: {
      required: false,
    },
  });

  return (
    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
      <div className="sm:col-span-6">
        <div className="flex flex-col gap-y-2">
          {fields.map((field, idx) => (
            <fieldset key={field.id}>
              <legend className="sr-only">Trait Type and Value</legend>
              <div className="mt-1 -space-y-px rounded-md bg-white">
                <div className="grid grid-cols-9 space-x-2">
                  <div className="col-span-4 flex-1">
                    <label className="sr-only">Trait Type</label>
                    <input
                      type="text"
                      {...register(`attributes.${idx}.trait_type` as const, {
                        required: true,
                      })}
                      defaultValue=""
                      className={classNames(
                        "relative block w-full rounded-md border-gray-300 bg-transparent pr-6",
                        "focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      )}
                      placeholder="Trait type"
                    />
                  </div>
                  <div className="col-span-4 flex-1">
                    <label className="sr-only">Value</label>
                    <input
                      type="text"
                      {...register(`attributes.${idx}.value` as const)}
                      className={classNames(
                        "relative block w-full rounded-md border-gray-300 bg-transparent",
                        "focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      )}
                      placeholder="Value"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="sr-only">Remove creator</label>
                    <button
                      className="inline-flex h-full w-full items-center justify-center rounded-md border border-transparent bg-red-500"
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
          <div className="mt-2">
            <button
              onClick={() => append({ trait_type: "", value: "" })}
              type="button"
              className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-violet-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            >
              Add Attribute
              <PlusCircleIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
