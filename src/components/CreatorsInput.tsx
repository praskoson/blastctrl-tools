import {
  MinusIcon,
  PlusCircleIcon,
} from '@heroicons/react/20/solid';
import { useMemo, useState } from 'react';
import { produce } from 'immer';


export const MAX_CREATORS = 5;

export const CreatorsInput = () => {
  const [creators, setCreators] = useState([
    { address: '', share: '', exists: false },
    { address: '', share: '', exists: false },
    { address: '', share: '', exists: false },
    { address: '', share: '', exists: false },
    { address: '', share: '', exists: false },
  ]);
  const isAddable = useMemo(
    () => creators.filter((c) => !c.exists).length > 0,
    [creators]
  );

  const handleAddCreator = () => {
    const unused = creators.findIndex((c) => !c.exists);

    if (unused === -1) {
      return;
    }

    setCreators(
      produce((creators) => {
        creators[unused].exists = true;
      })
    );
  };

  const handleRemoveSelf = (index: number) => () => {
    setCreators(
      produce((creators) => {
        creators[index] = { address: '', share: '', exists: false };
      })
    );
  };

  const PlusButton = (
    <button
      onClick={handleAddCreator}
      type='button'
      className='inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
      Add Creator
      <PlusCircleIcon className='ml-3 -mr-1 h-5 w-5' aria-hidden='true' />
    </button>
  );

  const inputGroup = ({ idx }: { idx: number }) => {
    return (
      <fieldset>
        <legend className='sr-only'>Creator address and share</legend>
        <div className='mt-1 -space-y-px rounded-md bg-white shadow-sm'>
          <div className='grid grid-cols-9 -space-x-px'>
            <div className='col-span-6 flex-1'>
              <label className='sr-only'>Creator</label>
              <input
                type='text'
                className='relative block w-full rounded-none rounded-bl-md rounded-tl-md border-gray-300 bg-transparent pr-6 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                placeholder='Creator address'
              />
            </div>
            <div className='col-span-2 flex-1'>
              <label className='sr-only'>Share</label>
              <input
                type='text'
                className='relative block w-full rounded-none border-gray-300 bg-transparent focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                placeholder='Share'
              />
            </div>
            <div className='col-span-1'>
              <label className='sr-only'>Remove creator</label>
              <button
                className='inline-flex h-full w-full items-center justify-center rounded-none rounded-tr-md rounded-br-md border border-gray-300 bg-red-500'
                type='button'
                onClick={handleRemoveSelf(idx)}>
                <MinusIcon className='h-5 w-5 font-semibold text-white' />
              </button>
            </div>
          </div>
        </div>
      </fieldset>
    );
  };

  return (
    <div>
      {creators.map((c, idx) => {
        return c.exists ? inputGroup({ idx }) : null;
      })}
      {isAddable && PlusButton}
    </div>
  );
};
